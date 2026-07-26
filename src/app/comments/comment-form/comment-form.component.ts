import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

import {OnboardingStepDirective} from '../../onboarding/onboarding-step.directive';
import {ProposalDto} from '../../proposal.dto';
import {COMMENT_ONBOARDING} from '../comment-onboarding/comment-onboarding.provider';

@Component({
    selector: 'comment-form',
    imports: [FormsModule, OnboardingStepDirective, TuiButton, TuiIcon],
    templateUrl: './comment-form.component.html',
    styleUrl: './comment-form.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
    protected readonly commentOnboarding = inject(COMMENT_ONBOARDING);
    protected readonly onboardingStep = this.commentOnboarding?.steps[2] ?? null;
    protected comment = '';
    protected isJustification = false;

    public readonly proposal = input.required<ProposalDto>();

    protected cancel(): void {
        this.comment = '';
        this.isJustification = false;
    }

    protected submit(): void {
        this.comment = '';
        this.isJustification = false;
    }
}
