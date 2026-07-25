import {computed, inject, Injectable, InjectionToken, signal} from '@angular/core';

export interface OnboardingConfig {
    readonly count: number;
    readonly storageKey: string;
}

export const ONBOARDING_CONFIG = new InjectionToken<OnboardingConfig>('ONBOARDING_CONFIG');

const MUTED_STATE = 'muted';

@Injectable()
export class OnboardingService<TContext = unknown> {
    private readonly config = inject(ONBOARDING_CONFIG);
    private readonly mutedState = signal(this.readMutedState());

    public readonly step = signal(0);
    public readonly context = signal<TContext | null>(null);
    public readonly count = this.config.count;
    public readonly isRunning = computed(() => this.step() > 0);
    public readonly isMuted = this.mutedState.asReadonly();
    public readonly shouldAutoStart = computed(() => !this.mutedState());

    public start(context: TContext, force = false): boolean {
        if (this.mutedState() && !force) {
            return false;
        }

        this.context.set(context);
        this.step.set(1);

        return true;
    }

    public next(): void {
        const currentStep = this.step();

        if (currentStep === 0) {
            return;
        }

        if (currentStep >= this.count) {
            this.close();
            return;
        }

        this.step.set(currentStep + 1);
    }

    public close(): void {
        this.mute();
    }

    public isActive(step: number, context?: TContext): boolean {
        return (
            this.step() === step &&
            (context === undefined || Object.is(this.context(), context))
        );
    }

    private mute(): void {
        try {
            localStorage.setItem(this.config.storageKey, MUTED_STATE);
        } catch {
            // The tour still closes when storage is unavailable, for example in private mode.
        }

        this.mutedState.set(true);
        this.step.set(0);
        this.context.set(null);
    }

    private readMutedState(): boolean {
        try {
            return localStorage.getItem(this.config.storageKey) === MUTED_STATE;
        } catch {
            return false;
        }
    }
}
