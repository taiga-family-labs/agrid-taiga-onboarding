import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiHint} from '@taiga-ui/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

import {CommentsOnboardingService} from '../onboarding/onboarding.service';
import {COMMENT_ICON_ONBOARDING_STEP} from '../onboarding/steps/comment-icon-onboarding-step.component';
import {ProposalDto} from '../proposal.dto';

@Component({
    selector: 'app-employee-cell',
    imports: [TuiButton, TuiHint],
    templateUrl: './employee-cell.component.html',
    styleUrl: './employee-cell.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCellComponent implements ICellRendererAngularComp {
    protected readonly onboarding = inject(CommentsOnboardingService);
    protected readonly onboardingStep = COMMENT_ICON_ONBOARDING_STEP;
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
        if (this.onboarding.isCommentStepFor(this.proposal.id)) {
            this.onboarding.next();
            return;
        }

        this.onboarding.openSidebar(this.proposal);
    }
}
