import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

import {OnboardingStepComponent} from '../../../onboarding/onboarding-step.component';
import {OnboardingService} from '../../../onboarding/onboarding.service';

@Component({
    selector: 'travel-notes-onboarding-third-step',
    imports: [OnboardingStepComponent, TuiButton, TuiTitle],
    template: `
        <onboarding-step>
            <h3 tuiTitle>
                Добавляйте важное в чек-лист
                <span tuiSubtitle>Отметьте заметку, если ее нужно выполнить до начала поездки</span>
            </h3>

            <div class="preview">
                <span class="checkbox"></span>
                <span>Добавить в чек-лист</span>
            </div>

            <button
                appearance="flat"
                size="s"
                tuiButton
                type="button"
                (click)="onboarding.next()"
            >
                Понятно
            </button>
        </onboarding-step>
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
export class ThirdStepComponent {
    protected readonly onboarding = inject(OnboardingService);
}

export const THIRD_STEP = new PolymorpheusComponent(ThirdStepComponent);
