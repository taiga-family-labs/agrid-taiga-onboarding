import {computed, Injectable, signal} from '@angular/core';
import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';

const MUTED_STATE = 'muted';

export interface OnboardingStepDefinition<TContext> {
    readonly content: PolymorpheusContent;
    readonly beforeNext?: (context: TContext) => void;
}

export interface OnboardingDefinition<TContext> {
    readonly id: string;
    readonly storageKey: string;
    readonly steps: readonly OnboardingStepDefinition<TContext>[];
}

export interface OnboardingStepRef {
    readonly onboardingId: string;
    readonly index: number;
    readonly content: PolymorpheusContent;
}

export class OnboardingRef<TContext> {
    public readonly steps: readonly OnboardingStepRef[];

    constructor(
        private readonly service: OnboardingService,
        private readonly definition: OnboardingDefinition<TContext>,
    ) {
        this.steps = definition.steps.map(({content}, index) => ({
            onboardingId: definition.id,
            index: index + 1,
            content,
        }));
    }

    public start(context: TContext, force = false): boolean {
        return this.service.start(this.definition.id, context, force);
    }

    public next(): void {
        this.service.next(this.definition.id);
    }

    public close(): void {
        this.service.close(this.definition.id);
    }

    public shouldAutoStart(): boolean {
        return this.service.shouldAutoStart(this.definition.id);
    }

    public unregister(): void {
        this.service.unregister(this.definition.id);
    }
}

@Injectable({providedIn: 'root'})
export class OnboardingService {
    private readonly registrations = new Map<string, OnboardingDefinition<unknown>>();
    private readonly activeId = signal<string | null>(null);

    public readonly step = signal(0);
    public readonly context = signal<unknown | null>(null);
    public readonly isRunning = computed(() => this.activeId() !== null && this.step() > 0);
    public readonly count = computed(
        () => this.registrations.get(this.activeId() ?? '')?.steps.length ?? 0,
    );

    public register<TContext>(definition: OnboardingDefinition<TContext>): OnboardingRef<TContext> {
        if (this.registrations.has(definition.id)) {
            throw new Error(`Onboarding "${definition.id}" is already registered`);
        }

        if (definition.steps.length === 0) {
            throw new Error(`Onboarding "${definition.id}" must contain at least one step`);
        }

        this.registrations.set(
            definition.id,
            definition as OnboardingDefinition<unknown>,
        );

        return new OnboardingRef(this, definition);
    }

    public isActive(step: OnboardingStepRef, context?: unknown): boolean {
        return (
            this.activeId() === step.onboardingId &&
            this.step() === step.index &&
            (context === undefined || Object.is(this.context(), context))
        );
    }

    public close(onboardingId?: string): void {
        const activeId = this.activeId();

        if (activeId === null || (onboardingId !== undefined && activeId !== onboardingId)) {
            return;
        }

        const definition = this.registrations.get(activeId);

        if (definition) {
            try {
                localStorage.setItem(definition.storageKey, MUTED_STATE);
            } catch {
                // The flow still closes when storage is unavailable.
            }
        }

        this.reset();
    }

    public unregister(onboardingId: string): void {
        if (this.activeId() === onboardingId) {
            this.reset();
        }

        this.registrations.delete(onboardingId);
    }

    public shouldAutoStart(onboardingId: string): boolean {
        const definition = this.registrations.get(onboardingId);

        if (!definition) {
            return false;
        }

        try {
            return localStorage.getItem(definition.storageKey) !== MUTED_STATE;
        } catch {
            return true;
        }
    }

    public start<TContext>(onboardingId: string, context: TContext, force = false): boolean {
        const definition = this.registrations.get(onboardingId);

        if (!definition || (!force && !this.shouldAutoStart(onboardingId))) {
            return false;
        }

        this.activeId.set(onboardingId);
        this.context.set(context);
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
        const context = this.context();

        if (!definition || currentStep === 0 || context === null) {
            this.reset();
            return;
        }

        definition.steps[currentStep - 1]?.beforeNext?.(context);

        if (currentStep >= definition.steps.length) {
            this.close(activeId);
            return;
        }

        this.step.set(currentStep + 1);
    }

    private reset(): void {
        this.activeId.set(null);
        this.step.set(0);
        this.context.set(null);
    }
}
