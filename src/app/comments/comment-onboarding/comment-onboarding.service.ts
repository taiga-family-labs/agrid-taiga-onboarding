import {DestroyRef, inject, Injectable, signal} from '@angular/core';

import {OnboardingService} from '../../onboarding/onboarding.service';
import {ProposalDto} from '../../proposal.dto';
import {ONE_STEP} from './comment-onboarding-steps/one-step.component';
import {THIRD_STEP} from './comment-onboarding-steps/third-step.component';
import {TWO_STEP} from './comment-onboarding-steps/two-step.component';

const COMMENT_ONBOARDING_STEPS = [ONE_STEP, TWO_STEP, THIRD_STEP] as const;

@Injectable()
export class CommentOnboardingService {
    private readonly ref = inject(OnboardingService).register({
        id: 'comment-triggers',
        steps: COMMENT_ONBOARDING_STEPS,
    });
    private readonly targetProposalId = signal<number | null>(null);

    public readonly steps = this.ref.steps;

    public constructor() {
        inject(DestroyRef).onDestroy(() => this.ref.unregister());
    }

    public start(proposal: ProposalDto, force = false): boolean {
        this.targetProposalId.set(proposal.id);

        const started = this.ref.start(force);

        if (!started) {
            this.targetProposalId.set(null);
        }

        return started;
    }

    public isTarget(proposal: ProposalDto): boolean {
        return this.targetProposalId() === proposal.id;
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
