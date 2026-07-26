import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

import {OnboardingStepComponent} from '../../../onboarding/onboarding-step.component';
import {OnboardingService} from '../../../onboarding/onboarding.service';

@Component({
    selector: 'comment-onboarding-two-step',
    imports: [OnboardingStepComponent, TuiButton, TuiTitle],
    template: `
        <onboarding-step>
            <h3 tuiTitle>
                Все комментарии в одном месте
                <span tuiSubtitle>Комментарии, отклонения и обоснования теперь будут находиться здесь</span>
            </h3>

            <div class="preview">
                <div class="segments">
                    <span>Все</span>
                    <span>Обоснования</span>
                    <span>Другие комментарии</span>
                </div>

                <div class="panel">
                    <strong>Отклонения от правил в заявке</strong>
                    <span>• Превышение рекомендаций</span>
                    <span>• Новый CR выше текущего</span>
                </div>
            </div>

            <button
                appearance="flat"
                size="s"
                tuiButton
                type="button"
                (click)="onboarding.next()"
            >
                Далее
            </button>
        </onboarding-step>
    `,
    styles: `
        h3 {
            padding-inline-end: 2rem;
        }

        .preview {
            overflow: hidden;
            min-block-size: 8.75rem;
            border-radius: 0.75rem;
            background: #fff;
            color: #333;
        }

        .segments {
            display: flex;
            gap: 0.25rem;
            padding: 0.625rem;
            font-size: 0.7rem;
        }

        .segments span {
            padding: 0.35rem 0.5rem;
            border-radius: 0.4rem;
            background: #f0f1f2;
        }

        .panel {
            display: grid;
            gap: 0.5rem;
            margin: 0 0.625rem 0.625rem;
            padding: 0.75rem;
            border-radius: 0.6rem;
            background: #f5f6f7;
            font-size: 0.7rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoStepComponent {
    protected readonly onboarding = inject(OnboardingService);
}

export const TWO_STEP = new PolymorpheusComponent(TwoStepComponent);
