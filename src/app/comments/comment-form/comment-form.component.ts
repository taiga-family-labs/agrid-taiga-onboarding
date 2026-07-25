import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

import {OnboardingStepDirective} from '../../onboarding/onboarding-step.directive';
import {ProposalDto} from '../../proposal.dto';
import {CommentOnboardingService} from '../comment-onboarding/comment-onboarding.service';

@Component({
    selector: 'comment-form',
    imports: [FormsModule, OnboardingStepDirective, TuiButton, TuiIcon],
    templateUrl: './comment-form.component.html',
    styleUrl: './comment-form.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
    protected readonly commentOnboarding = inject(CommentOnboardingService);
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
