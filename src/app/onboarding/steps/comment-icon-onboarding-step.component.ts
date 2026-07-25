import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

import {CommentsSidebarService} from '../../comments/comments-sidebar/comments-sidebar.service';
import {ProposalDto} from '../../proposal.dto';
import {OnboardingStepComponent} from '../onboarding-step.component';
import {OnboardingService} from '../onboarding.service';

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
                (click)="next()"
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
    private readonly sidebar = inject(CommentsSidebarService);
    protected readonly onboarding = inject<OnboardingService<ProposalDto>>(OnboardingService);
    protected readonly names = [
        'Анна Агафонова',
        'Николай Арсеньев',
        'Олег Володин',
        'Татьяна Воробьева',
    ];

    protected next(): void {
        const proposal = this.onboarding.context();

        if (proposal === null) {
            this.onboarding.close();
            return;
        }

        this.sidebar.open(proposal);
        this.onboarding.next();
    }
}

export const COMMENT_ICON_ONBOARDING_STEP = new PolymorpheusComponent(
    CommentIconOnboardingStepComponent,
);
