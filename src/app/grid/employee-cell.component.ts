import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

import {CommentOnboardingService} from '../comments/comment-onboarding/comment-onboarding.service';
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
    protected readonly commentOnboarding = inject(CommentOnboardingService);
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
        if (
            this.commentOnboarding.isTarget(this.proposal) &&
            this.onboarding.isActive(this.commentOnboarding.steps[0])
        ) {
            this.commentOnboarding.next();
            return;
        }

        this.sidebar.open(this.proposal);
    }
}
