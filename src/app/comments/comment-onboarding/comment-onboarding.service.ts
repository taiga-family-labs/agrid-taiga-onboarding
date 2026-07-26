import {DestroyRef, inject, Injectable, signal} from '@angular/core';

import {OnboardingService} from '../../onboarding/onboarding.service';
import {ProposalDto} from '../../proposal.dto';
import {CommentsSidebarService} from '../comments-sidebar/comments-sidebar.service';
import {ONE_STEP} from './comment-onboarding-steps/one-step.component';
import {THIRD_STEP} from './comment-onboarding-steps/third-step.component';
import {TWO_STEP} from './comment-onboarding-steps/two-step.component';

@Injectable()
export class CommentOnboardingService {
    private readonly onboarding = inject(OnboardingService);
    private readonly sidebar = inject(CommentsSidebarService);
    private readonly targetProposal = signal<ProposalDto | null>(null);

    public readonly steps = this.onboarding.register({
        id: 'comment-triggers',
        steps: [
            {
                content: ONE_STEP,
                onNext: () => {
                    const proposal = this.targetProposal();

                    if (proposal) {
                        this.sidebar.open(proposal);
                    }
                },
            },
            {content: TWO_STEP},
            {content: THIRD_STEP},
        ] as const,
    });

    public constructor() {
        inject(DestroyRef).onDestroy(() => this.onboarding.unregister());
    }

    public start(proposal: ProposalDto, ignoreMuted = false): boolean {
        this.targetProposal.set(proposal);

        const started = this.onboarding.start(ignoreMuted);

        if (!started) {
            this.targetProposal.set(null);
        }

        return started;
    }

    public isTarget(proposal: ProposalDto): boolean {
        return this.targetProposal()?.id === proposal.id;
    }

    public next(): void {
        this.onboarding.next();
    }

    public close(): void {
        this.onboarding.close();
    }

    public canStart(): boolean {
        return this.onboarding.canStart();
    }
}
