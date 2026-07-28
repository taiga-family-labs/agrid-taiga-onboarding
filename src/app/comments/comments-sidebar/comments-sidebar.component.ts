import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiSegmented} from '@taiga-ui/kit';

import {OnboardingStepDirective} from '../../onboarding/onboarding-step.directive';
import {TravelPlanDto} from '../../proposal.dto';
import {TravelNoteFormComponent} from '../comment-form/comment-form.component';
import {TRAVEL_NOTES_ONBOARDING} from '../comment-onboarding/comment-onboarding.provider';

@Component({
    selector: 'travel-notes-sidebar',
    imports: [TravelNoteFormComponent, OnboardingStepDirective, TuiButton, TuiSegmented],
    templateUrl: './comments-sidebar.component.html',
    styleUrl: './comments-sidebar.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravelNotesSidebarComponent {
    protected readonly travelNotesOnboarding = inject(TRAVEL_NOTES_ONBOARDING);
    protected readonly onboardingStep = this.travelNotesOnboarding?.steps[1] ?? null;
    protected activeSegment = 0;

    public readonly travelPlan = input.required<TravelPlanDto>();
    public readonly closed = output<void>();
}
