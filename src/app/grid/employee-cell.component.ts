import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

import {COMMENT_ONBOARDING} from '../comments/comment-onboarding/comment-onboarding.provider';
import {CommentsSidebarService} from '../comments/comments-sidebar/comments-sidebar.service';
import {OnboardingService} from '../onboarding/onboarding.service';
import {OnboardingStepDirective} from '../onboarding/onboarding-step.directive';
import {ProposalDto} from '../proposal.dto';

@Component({
    selector: 'employee-cell',
    imports: [OnboardingStepDirective, TuiButton],
    templateUrl: './employee-cell.component.html',
    styleUrl: './employee-cell.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCellComponent implements ICellRendererAngularComp {
    protected readonly sidebar = inject(CommentsSidebarService);
    protected readonly onboarding = inject(OnboardingService);
    protected readonly commentOnboarding = inject(COMMENT_ONBOARDING);
    protected readonly onboardingStep = this.commentOnboarding?.steps[0] ?? null;
    protected proposal!: ProposalDto;

    public agInit(params: ICellRendererParams<ProposalDto>): void {
        if (params.data) {
            this.proposal = params.data;
        }
    }

    public refresh(params: ICellRendererParams<ProposalDto>): boolean {
        this.agInit(params);

        return true;
    }

    protected openComments(): void {
        const commentOnboarding = this.commentOnboarding;
        const step = this.onboardingStep;

        if (
            step &&
            commentOnboarding?.isTarget(this.proposal) &&
            this.onboarding.isActive(step)
        ) {
            commentOnboarding.next();
            return;
        }

        this.sidebar.open(this.proposal);
    }
}
