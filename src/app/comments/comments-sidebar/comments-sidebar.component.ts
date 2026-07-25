import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiSegmented} from '@taiga-ui/kit';

import {OnboardingStepDirective} from '../../onboarding/onboarding-step.directive';
import {ProposalDto} from '../../proposal.dto';
import {CommentFormComponent} from '../comment-form/comment-form.component';
import {CommentOnboardingService} from '../comment-onboarding/comment-onboarding.service';

@Component({
    selector: 'comments-sidebar',
    imports: [CommentFormComponent, OnboardingStepDirective, TuiButton, TuiSegmented],
    templateUrl: './comments-sidebar.component.html',
    styleUrl: './comments-sidebar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsSidebarComponent {
    protected readonly commentOnboarding = inject(CommentOnboardingService);
    protected activeSegment = 0;

    public readonly proposal = input.required<ProposalDto>();
    public readonly closed = output<void>();
}
