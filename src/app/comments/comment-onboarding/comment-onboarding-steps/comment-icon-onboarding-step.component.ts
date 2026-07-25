import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

import {OnboardingStepComponent} from '../../../onboarding/onboarding-step.component';
import {OnboardingService} from '../../../onboarding/onboarding.service';

@Component({
    selector: 'app-comment-icon-onboarding-step',
    imports: [OnboardingStepComponent, TuiButton, TuiTitle],
    template: `
        <app-onboarding-step>
            <h3 onboardingStepTitle tuiTitle>
                Обоснования переехали
                <span tuiSubtitle>По иконке комментария теперь можно увидеть и отклонения по заявке</span>
            </h3>

            <div class="preview">
                @for (name of names; track name; let index = $index) {
                    <div class="row">
                        <span>{{ name }}</span>
                        <span class="comment" [class.warning]="index === 2">●</span>
                    </div>
                }
            </div>

            <button
                onboardingStepAction
                appearance="flat"
                size="s"
                tuiButton
                type="button"
                (click)="onboarding.next()"
            >
                Далее
            </button>
        </app-onboarding-step>
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

        .comment {
            color: #8a929c;
        }

        .warning {
            color: #e5484d;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentIconOnboardingStepComponent {
    protected readonly onboarding = inject(OnboardingService);
    protected readonly names = [
        'Анна Агафонова',
        'Николай Арсеньев',
        'Олег Володин',
        'Татьяна Воробьева',
    ];
}

export const COMMENT_ICON_ONBOARDING_STEP = new PolymorpheusComponent(
    CommentIconOnboardingStepComponent,
);
