import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

import {OnboardingStepComponent} from '../../../onboarding/onboarding-step.component';
import {OnboardingService} from '../../../onboarding/onboarding.service';

@Component({
    selector: 'travel-notes-onboarding-one-step',
    imports: [OnboardingStepComponent, TuiButton, TuiTitle],
    template: `
        <onboarding-step>
            <h3 tuiTitle>
                Заметки прямо из таблицы
                <span tuiSubtitle>У каждого маршрута есть отдельная панель для идей и деталей поездки</span>
            </h3>

            <div class="preview">
                @for (route of routes; track route; let index = $index) {
                    <div class="row">
                        <span>{{ route }}</span>
                        <span class="note" [class.active]="index === 0">●</span>
                    </div>
                }
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
            border-radius: 0.75rem;
            background: #fff;
            color: #333;
        }

        .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-block-size: 2.1rem;
            padding: 0 0.75rem;
            border-block-end: 1px solid #e7e9ec;
            font-size: 0.75rem;
        }

        .note {
            color: #8a929c;
        }

        .active {
            color: #4584e6;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneStepComponent {
    protected readonly onboarding = inject(OnboardingService);
    protected readonly routes = [
        'Киото и Нара',
        'Лиссабон и Синтра',
        'Таллин и острова',
        'Рим и Флоренция',
    ];
}

export const ONE_STEP = new PolymorpheusComponent(OneStepComponent);
