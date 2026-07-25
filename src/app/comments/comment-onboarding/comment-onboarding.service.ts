import {DestroyRef, inject, Injectable} from '@angular/core';

import {OnboardingService, type OnboardingRef} from '../../onboarding/onboarding.service';
import {ProposalDto} from '../../proposal.dto';
import {CommentsSidebarService} from '../comments-sidebar/comments-sidebar.service';
import {COMMENT_ICON_ONBOARDING_STEP} from './comment-onboarding-steps/comment-icon-onboarding-step.component';
import {COMMENT_SEGMENTS_ONBOARDING_STEP} from './comment-onboarding-steps/comment-segments-onboarding-step.component';
import {JUSTIFICATION_ONBOARDING_STEP} from './comment-onboarding-steps/justification-onboarding-step.component';

const COMMENTS_ONBOARDING_ID = 'comments';
const COMMENTS_ONBOARDING_STORAGE_KEY = 'agrid-taiga-onboarding:comments:v1';

@Injectable()
export class CommentOnboardingService {
    private readonly onboarding = inject(OnboardingService);
    private readonly sidebar = inject(CommentsSidebarService);
    private readonly ref: OnboardingRef<ProposalDto> = this.onboarding.register({
        id: COMMENTS_ONBOARDING_ID,
        storageKey: COMMENTS_ONBOARDING_STORAGE_KEY,
        steps: [
            {
                content: COMMENT_ICON_ONBOARDING_STEP,
                beforeNext: (proposal) => this.sidebar.open(proposal),
            },
            {content: COMMENT_SEGMENTS_ONBOARDING_STEP},
            {content: JUSTIFICATION_ONBOARDING_STEP},
        ],
    });

    public readonly stepOne = this.ref.steps[0]!;
    public readonly stepTwo = this.ref.steps[1]!;
    public readonly stepThree = this.ref.steps[2]!;

    constructor() {
        inject(DestroyRef).onDestroy(() => this.ref.unregister());
    }

    public start(proposal: ProposalDto, force = false): boolean {
        return this.ref.start(proposal, force);
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
