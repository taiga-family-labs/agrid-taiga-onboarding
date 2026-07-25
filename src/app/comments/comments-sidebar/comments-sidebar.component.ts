import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiSegmented} from '@taiga-ui/kit';

import {OnboardingHintStepDirective} from '../../onboarding/onboarding-hint-step.directive';
import {COMMENT_TABS_ONBOARDING_STEP} from '../../onboarding/steps/comment-tabs-onboarding-step.component';
import {ProposalDto} from '../../proposal.dto';
import {CommentFormComponent} from '../comment-form/comment-form.component';

@Component({
    selector: 'app-comments-sidebar',
    imports: [CommentFormComponent, OnboardingHintStepDirective, TuiButton, TuiSegmented],
    templateUrl: './comments-sidebar.component.html',
    styleUrl: './comments-sidebar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsSidebarComponent {
    protected readonly onboardingStep = COMMENT_TABS_ONBOARDING_STEP;
    protected activeSegment = 0;

    public readonly proposal = input.required<ProposalDto>();
    public readonly closed = output<void>();
}
