import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiHint} from '@taiga-ui/core';

import {CommentsOnboardingService} from '../../onboarding/onboarding.service';
import {JUSTIFICATION_CHECKBOX_ONBOARDING_STEP} from '../../onboarding/steps/justification-checkbox-onboarding-step.component';
import {ProposalDto} from '../../proposal.dto';

@Component({
    selector: 'app-comment-form',
    imports: [FormsModule, TuiButton, TuiHint],
    templateUrl: './comment-form.component.html',
    styleUrl: './comment-form.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
    protected readonly onboarding = inject(CommentsOnboardingService);
    protected readonly onboardingStep = JUSTIFICATION_CHECKBOX_ONBOARDING_STEP;
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
