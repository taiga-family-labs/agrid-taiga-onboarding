import {DestroyRef, inject, Injectable} from '@angular/core';

import {OnboardingService} from '../../onboarding/onboarding.service';
import {ONE_STEP} from './comment-onboarding-steps/one-step.component';
import {THIRD_STEP} from './comment-onboarding-steps/third-step.component';
import {TWO_STEP} from './comment-onboarding-steps/two-step.component';

@Injectable()
export class CommentOnboardingService {
    private readonly ref = inject(OnboardingService).register({
        id: 'comment-triggers',
        steps: [ONE_STEP, TWO_STEP, THIRD_STEP] as const,
    });

    public readonly steps = this.ref.steps;

    constructor() {
        inject(DestroyRef).onDestroy(() => this.ref.unregister());
    }

    public start(force = false): boolean {
        return this.ref.start(force);
    }

    public next(): void {
        this.ref.next();
    }

    public close(): void {
        this.ref.close();
    }

    public shouldAutoStart(): boolean {
        return this.ref.shouldAutoStart();
    }
}
