import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';

import {CommentsOnboardingService} from './onboarding.service';

@Component({
    selector: 'app-onboarding-step',
    imports: [TuiButton],
    templateUrl: './onboarding-step.component.html',
    styleUrl: './onboarding-step.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingStepComponent {
    protected readonly onboarding = inject(CommentsOnboardingService);
}
