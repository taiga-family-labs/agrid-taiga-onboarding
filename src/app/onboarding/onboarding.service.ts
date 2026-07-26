import {computed, inject, Injectable, signal} from '@angular/core';
import {WA_LOCAL_STORAGE} from '@ng-web-apis/common';

import {assert} from '../utils/assert';
import {
    type OnboardingOptions,
    type OnboardingStep,
    type OnboardingStepDefinition,
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
    private readonly activeStep = signal<OnboardingStep | null>(null);

    private registration: RegisteredOnboarding | null = null;

    public readonly stepIndex = computed(() => this.activeStep()?.index ?? -1);
    public readonly isRunning = computed(() => this.activeStep() !== null);

    public get count(): number {
        return this.registration?.steps.length ?? 0;
    }

    public register<const TSteps extends readonly OnboardingStepDefinition[]>(
        options: OnboardingOptions<TSteps>,
    ): OnboardingSteps<TSteps> {
        assert(this.registration === null, 'Another onboarding is already registered');
        assert(
            options.steps.length > 0,
            `Onboarding "${options.id}" must contain at least one step`,
        );

        const steps = options.steps.map((step, index) => ({
            ...step,
            index,
        })) as OnboardingSteps<TSteps>;

        this.registration = {
            storageKey: `@onboarding.${options.id}.v${options.version ?? DEFAULT_VERSION}`,
            steps,
        };

        return steps;
    }

    public isActive(step: OnboardingStep): boolean {
        return this.activeStep() === step;
    }

    public start(ignoreMuted = false): boolean {
        const firstStep = this.registration?.steps[0];

        if (!firstStep || (!ignoreMuted && !this.canStart())) {
            return false;
        }

        this.activeStep.set(firstStep);

        return true;
    }

    public next(): void {
        const registration = this.registration;
        const currentStep = this.activeStep();

        if (!registration || !currentStep) {
            return;
        }

        currentStep.onNext?.();

        const nextStep = registration.steps[currentStep.index + 1];

        if (!nextStep) {
            this.close();
            return;
        }

        this.activeStep.set(nextStep);
    }

    public close(): void {
        const registration = this.registration;

        if (registration === null || this.activeStep() === null) {
            return;
        }

        this.localStorage.setItem(registration.storageKey, MUTED_STATE);
        this.activeStep.set(null);
    }

    public unregister(): void {
        this.activeStep.set(null);
        this.registration = null;
    }

    public canStart(): boolean {
        return (
            this.registration !== null &&
            this.localStorage.getItem(this.registration.storageKey) !== MUTED_STATE
        );
    }
}
