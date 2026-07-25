import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {TuiButton, TuiHint} from '@taiga-ui/core';
import {TuiTabs} from '@taiga-ui/kit';

import {CommentsOnboardingService} from '../../onboarding/onboarding.service';
import {COMMENT_TABS_ONBOARDING_STEP} from '../../onboarding/steps/comment-tabs-onboarding-step.component';
import {ProposalDto} from '../../proposal.dto';
import {CommentFormComponent} from '../comment-form/comment-form.component';

@Component({
    selector: 'app-comments-sidebar',
    imports: [CommentFormComponent, TuiButton, TuiHint, TuiTabs],
    templateUrl: './comments-sidebar.component.html',
    styleUrl: './comments-sidebar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsSidebarComponent {
    protected readonly onboarding = inject(CommentsOnboardingService);
    protected readonly onboardingStep = COMMENT_TABS_ONBOARDING_STEP;
    protected activeTab = 0;

    public readonly proposal = input.required<ProposalDto>();
    public readonly closed = output<void>();
}
