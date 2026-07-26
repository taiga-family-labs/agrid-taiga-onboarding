import {DestroyRef, inject, Injectable, signal} from '@angular/core';

import {OnboardingService} from '../../onboarding/onboarding.service';
import {ProposalDto} from '../../proposal.dto';
import {ONE_STEP} from './comment-onboarding-steps/one-step.component';
import {THIRD_STEP} from './comment-onboarding-steps/third-step.component';
import {TWO_STEP} from './comment-onboarding-steps/two-step.component';

@Injectable()
export class CommentOnboardingService {
    private readonly targetProposalId = signal<number | null>(null);
    private readonly ref = inject(OnboardingService).register({
        id: 'comment-triggers',
        steps: [ONE_STEP, TWO_STEP, THIRD_STEP] as const,
    });

    public readonly steps = this.ref.steps;

    constructor() {
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

    public clearMutedState(): void {
        this.ref.clearMutedState();
    }

    public shouldAutoStart(): boolean {
        return this.ref.shouldAutoStart();
    }
}
