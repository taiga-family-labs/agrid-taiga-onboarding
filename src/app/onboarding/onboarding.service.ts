import {computed, inject, Injectable, signal} from '@angular/core';
import {WA_LOCAL_STORAGE} from '@ng-web-apis/common';
import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';

import {assert} from '../utils/assert';
import {Onboarding} from './onboarding';
import {
    type OnboardingAnchor,
    type OnboardingOptions,
    type OnboardingStep,
} from './onboarding.types';

const MUTED_STATE = 'muted';
const DEFAULT_VERSION = 1;

interface RegisteredOnboarding {
    readonly id: string;
    readonly storageKey: string;
    readonly steps: readonly PolymorpheusContent[];
}

@Injectable({providedIn: 'root'})
export class OnboardingService {
    private readonly localStorage = inject(WA_LOCAL_STORAGE);
    private readonly registrations = new Map<string, RegisteredOnboarding>();
    private readonly anchors = new Map<string, OnboardingAnchor[]>();
    private readonly activeId = signal<string | null>(null);

    public readonly step = signal(0);
    public readonly isRunning = computed(() => this.activeId() !== null && this.step() > 0);
    public readonly count = computed(
        () => this.registrations.get(this.activeId() ?? '')?.steps.length ?? 0,
    );

    public register<const TSteps extends readonly PolymorpheusContent[]>(
        options: OnboardingOptions<TSteps>,
    ): Onboarding<TSteps> {
        assert(
            !this.registrations.has(options.id),
            `Onboarding "${options.id}" is already registered`,
        );
        assert(
            options.steps.length > 0,
            `Onboarding "${options.id}" must contain at least one step`,
        );

        const version = options.version ?? DEFAULT_VERSION;

        this.registrations.set(options.id, {
            id: options.id,
            storageKey: `@onboarding.${options.id}.v${version}`,
            steps: options.steps,
        });

        return new Onboarding(this, options);
    }

    public registerAnchor(step: OnboardingStep, anchor: OnboardingAnchor): () => void {
        const key = this.getStepKey(step);
        const anchors = this.anchors.get(key) ?? [];

        anchors.push(anchor);
        this.anchors.set(key, anchors);

        return () => {
            const registered = this.anchors.get(key)?.filter((item) => item !== anchor) ?? [];

            if (registered.length > 0) {
                this.anchors.set(key, registered);
            } else {
                this.anchors.delete(key);
            }
        };
    }

    public isActive(step: OnboardingStep, anchor?: OnboardingAnchor): boolean {
        if (this.activeId() !== step.onboardingId || this.step() !== step.index) {
            return false;
        }

        return anchor === undefined || this.getActiveAnchor(step) === anchor;
    }

    public start(onboardingId: string, force = false): boolean {
        if (!this.registrations.has(onboardingId) || (!force && !this.shouldAutoStart(onboardingId))) {
            return false;
        }

        this.activeId.set(onboardingId);
        this.step.set(1);

        return true;
    }

    public next(onboardingId?: string): void {
        const activeId = this.activeId();

        if (activeId === null || (onboardingId !== undefined && activeId !== onboardingId)) {
            return;
        }

        const definition = this.registrations.get(activeId);
        const currentStep = this.step();

        if (!definition || currentStep === 0) {
            this.reset();
            return;
        }

        const step: OnboardingStep = {
            onboardingId: activeId,
            index: currentStep,
            content: definition.steps[currentStep - 1] ?? null,
        };

        this.getActiveAnchor(step)?.onNext();

        if (currentStep >= definition.steps.length) {
            this.close(activeId);
            return;
        }

        this.step.set(currentStep + 1);
    }

    public close(onboardingId?: string): void {
        const activeId = this.activeId();

        if (activeId === null || (onboardingId !== undefined && activeId !== onboardingId)) {
            return;
        }

        const definition = this.registrations.get(activeId);

        if (definition) {
            this.localStorage.setItem(definition.storageKey, MUTED_STATE);
        }

        this.reset();
    }

    public clearMutedState(onboardingId: string): void {
        const definition = this.registrations.get(onboardingId);

        if (definition) {
            this.localStorage.removeItem(definition.storageKey);
        }
    }

    public unregister(onboardingId: string): void {
        if (this.activeId() === onboardingId) {
            this.reset();
        }

        this.registrations.delete(onboardingId);

        for (const key of this.anchors.keys()) {
            if (key.startsWith(`${onboardingId}:`)) {
                this.anchors.delete(key);
            }
        }
    }

    public shouldAutoStart(onboardingId: string): boolean {
        const definition = this.registrations.get(onboardingId);

        return (
            !!definition && this.localStorage.getItem(definition.storageKey) !== MUTED_STATE
        );
    }

    private getActiveAnchor(step: OnboardingStep): OnboardingAnchor | undefined {
        return this.anchors.get(this.getStepKey(step))?.[0];
    }

    private getStepKey(step: OnboardingStep): string {
        return `${step.onboardingId}:${step.index}`;
    }

    private reset(): void {
        this.activeId.set(null);
        this.step.set(0);
    }
}
