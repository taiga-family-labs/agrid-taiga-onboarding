import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';

import {OnboardingService} from './onboarding.service';
import {type OnboardingSteps} from './onboarding.types';

export class Onboarding<TSteps extends readonly PolymorpheusContent[]> {
    public constructor(
        private readonly service: OnboardingService,
        public readonly steps: OnboardingSteps<TSteps>,
    ) {}

    public start(force = false): boolean {
        return this.service.start(force);
    }

    public next(): void {
        this.service.next();
    }

    public close(): void {
        this.service.close();
    }

    public shouldAutoStart(): boolean {
        return this.service.shouldAutoStart();
    }

    public unregister(): void {
        this.service.unregister();
    }
}
