import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';

import {OnboardingService} from './onboarding.service';
import {
    type OnboardingOptions,
    type OnboardingSteps,
} from './onboarding.types';

export class Onboarding<TSteps extends readonly PolymorpheusContent[]> {
    public readonly id: string;
    public readonly steps: OnboardingSteps<TSteps>;

    constructor(
        private readonly service: OnboardingService,
        options: OnboardingOptions<TSteps>,
    ) {
        this.id = options.id;
        this.steps = options.steps.map((content, index) => ({
            onboardingId: options.id,
            index: index + 1,
            content,
        })) as OnboardingSteps<TSteps>;
    }

    public start(force = false): boolean {
        return this.service.start(this.id, force);
    }

    public next(): void {
        this.service.next(this.id);
    }

    public close(): void {
        this.service.close(this.id);
    }

    public clearMutedState(): void {
        this.service.clearMutedState(this.id);
    }

    public shouldAutoStart(): boolean {
        return this.service.shouldAutoStart(this.id);
    }

    public unregister(): void {
        this.service.unregister(this.id);
    }
}
