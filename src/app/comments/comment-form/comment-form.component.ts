import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiIcon} from '@taiga-ui/core';

import {OnboardingStepDirective} from '../../onboarding/onboarding-step.directive';
import {TravelPlanDto} from '../../proposal.dto';
import {TRAVEL_NOTES_ONBOARDING} from '../comment-onboarding/comment-onboarding.provider';

@Component({
    selector: 'travel-note-form',
    imports: [FormsModule, OnboardingStepDirective, TuiButton, TuiIcon],
    templateUrl: './comment-form.component.html',
    styleUrl: './comment-form.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravelNoteFormComponent {
    protected readonly travelNotesOnboarding = inject(TRAVEL_NOTES_ONBOARDING);
    protected readonly onboardingStep = this.travelNotesOnboarding?.steps[2] ?? null;
    protected note = '';
    protected addToChecklist = false;

    public readonly travelPlan = input.required<TravelPlanDto>();

    protected cancel(): void {
        this.note = '';
        this.addToChecklist = false;
    }

    protected submit(): void {
        this.note = '';
        this.addToChecklist = false;
    }
}
