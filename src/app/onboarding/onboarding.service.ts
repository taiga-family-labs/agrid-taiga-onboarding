import {computed, inject, Injectable, signal} from '@angular/core';
import {WA_LOCAL_STORAGE} from '@ng-web-apis/common';
import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';

import {assert} from '../utils/assert';
import {Onboarding} from './onboarding';
import {
    type OnboardingAnchor,
    type OnboardingOptions,
    type OnboardingStep,
    type OnboardingSteps,
} from './onboarding.types';

const MUTED_STATE = 'muted';
const DEFAULT_VERSION = 1;

interface RegisteredOnboarding {
    readonly storageKey: string;
    readonly steps: readonly OnboardingStep[];
}

@Injectable({providedIn: 'root'})
export class OnboardingService {
    private readonly localStorage = inject(WA_LOCAL_STORAGE);
    private readonly registration = signal<RegisteredOnboarding | null>(null);
    private readonly activeStep = signal<OnboardingStep | null>(null);
    private readonly anchors = new Map<OnboardingStep, Set<OnboardingAnchor>>();
    private readonly anchorsRevision = signal(0);

    public readonly stepIndex = computed(() => this.activeStep()?.index ?? -1);
    public readonly isRunning = computed(() => this.activeStep() !== null);
    public readonly count = computed(() => this.registration()?.steps.length ?? 0);

    public register<const TSteps extends readonly PolymorpheusContent[]>(
        options: OnboardingOptions<TSteps>,
    ): Onboarding<TSteps> {
        assert(this.registration() === null, 'Another onboarding is already registered');
        assert(
            options.steps.length > 0,
            `Onboarding "${options.id}" must contain at least one step`,
        );

        const version = options.version ?? DEFAULT_VERSION;
        const steps = options.steps.map((content, index) => ({
            index,
            content,
        })) as OnboardingSteps<TSteps>;

        this.registration.set({
            storageKey: `@onboarding.${options.id}.v${version}`,
            steps,
        });

        return new Onboarding(this, steps);
    }

    public registerAnchor(step: OnboardingStep, anchor: OnboardingAnchor): () => void {
        const anchors = this.anchors.get(step) ?? new Set<OnboardingAnchor>();

        anchors.add(anchor);
        this.anchors.set(step, anchors);
        this.touchAnchors();

        return () => {
            const registered = this.anchors.get(step);

            if (!registered?.delete(anchor)) {
                return;
            }

            if (registered.size === 0) {
                this.anchors.delete(step);
            }

            this.touchAnchors();
        };
    }

    public isActive(step: OnboardingStep, anchor?: OnboardingAnchor): boolean {
        void this.anchorsRevision();

        if (this.activeStep() !== step) {
            return false;
        }

        return anchor === undefined || this.getActiveAnchor(step) === anchor;
    }

    public start(force = false): boolean {
        const registration = this.registration();
        const firstStep = registration?.steps[0];

        if (!firstStep || (!force && !this.shouldAutoStart())) {
            return false;
        }

        this.activeStep.set(firstStep);

        return true;
    }

    public next(): void {
        const registration = this.registration();
        const currentStep = this.activeStep();

        if (!registration || !currentStep) {
            return;
        }

        this.getActiveAnchor(currentStep)?.onNext();

        const nextStep = registration.steps[currentStep.index + 1];

        if (!nextStep) {
            this.close();
            return;
        }

        this.activeStep.set(nextStep);
    }

    public close(): void {
        if (this.activeStep() === null) {
            return;
        }

        const registration = this.registration();

        if (registration) {
            this.localStorage.setItem(registration.storageKey, MUTED_STATE);
        }

        this.reset();
    }

    public unregister(): void {
        this.reset();
        this.registration.set(null);

        if (this.anchors.size > 0) {
            this.anchors.clear();
            this.touchAnchors();
        }
    }

    public shouldAutoStart(): boolean {
        const registration = this.registration();

        return (
            registration !== null &&
            this.localStorage.getItem(registration.storageKey) !== MUTED_STATE
        );
    }

    private getActiveAnchor(step: OnboardingStep): OnboardingAnchor | undefined {
        return this.anchors.get(step)?.values().next().value;
    }

    private touchAnchors(): void {
        this.anchorsRevision.update((revision) => revision + 1);
    }

    private reset(): void {
        this.activeStep.set(null);
    }
}
