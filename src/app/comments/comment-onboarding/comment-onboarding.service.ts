import {DestroyRef, inject, Injectable, signal} from '@angular/core';

import {OnboardingService} from '../../onboarding/onboarding.service';
import {TravelPlanDto} from '../../proposal.dto';
import {TravelNotesSidebarService} from '../comments-sidebar/comments-sidebar.service';
import {ONE_STEP} from './comment-onboarding-steps/one-step.component';
import {THIRD_STEP} from './comment-onboarding-steps/third-step.component';
import {TWO_STEP} from './comment-onboarding-steps/two-step.component';

@Injectable()
export class TravelNotesOnboardingService {
    private readonly onboarding = inject(OnboardingService);
    private readonly sidebar = inject(TravelNotesSidebarService);
    private readonly targetTravelPlan = signal<TravelPlanDto | null>(null);

    public readonly steps = this.onboarding.register({
        id: 'travel-notes',
        steps: [
            {
                content: ONE_STEP,
                onNext: () => {
                    const travelPlan = this.targetTravelPlan();

                    if (travelPlan) {
                        this.sidebar.open(travelPlan);
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

    public start(travelPlan: TravelPlanDto, ignoreMuted = false): boolean {
        this.targetTravelPlan.set(travelPlan);

        const started = this.onboarding.start(ignoreMuted);

        if (!started) {
            this.targetTravelPlan.set(null);
        }

        return started;
    }

    public isFirstStepTarget(travelPlan: TravelPlanDto): boolean {
        return (
            this.onboarding.isActive(this.steps[0]) &&
            this.targetTravelPlan()?.id === travelPlan.id
        );
    }
}
