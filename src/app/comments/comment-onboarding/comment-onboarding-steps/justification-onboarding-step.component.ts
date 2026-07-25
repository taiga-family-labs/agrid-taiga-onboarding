import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

import {OnboardingStepComponent} from '../../../onboarding/onboarding-step.component';
import {OnboardingService} from '../../../onboarding/onboarding.service';

@Component({
    selector: 'app-justification-onboarding-step',
    imports: [OnboardingStepComponent, TuiButton, TuiTitle],
    template: `
        <app-onboarding-step>
            <h3 onboardingStepTitle tuiTitle>
                Комментарий как обоснование
                <span tuiSubtitle>Если по заявке есть отклонения от правил, комментарий может учитываться как обоснование</span>
            </h3>

            <div class="preview">
                <span class="checkbox"></span>
                <span>Учитывать как обоснование</span>
            </div>

            <button
                onboardingStepAction
                appearance="flat"
                size="s"
                tuiButton
                type="button"
                (click)="onboarding.next()"
            >
                Понятно
            </button>
        </app-onboarding-step>
    `,
    styles: `
        h3 {
            padding-inline-end: 2rem;
        }

        .preview {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-block-size: 8.75rem;
            padding: 1rem;
            border-radius: 0.75rem;
            background: #fff;
            color: #333;
        }

        .checkbox {
            inline-size: 1.25rem;
            block-size: 1.25rem;
            border: 1px solid #c9ced6;
            border-radius: 0.35rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JustificationOnboardingStepComponent {
    protected readonly onboarding = inject(OnboardingService);
}

export const JUSTIFICATION_ONBOARDING_STEP = new PolymorpheusComponent(
    JustificationOnboardingStepComponent,
);
