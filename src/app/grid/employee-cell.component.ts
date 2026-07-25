import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

import {CommentsSidebarService} from '../comments/comments-sidebar/comments-sidebar.service';
import {OnboardingHintStepDirective} from '../onboarding/onboarding-hint-step.directive';
import {OnboardingService} from '../onboarding/onboarding.service';
import {COMMENT_ICON_ONBOARDING_STEP} from '../onboarding/steps/comment-icon-onboarding-step.component';
import {ProposalDto} from '../proposal.dto';

@Component({
    selector: 'app-employee-cell',
    imports: [OnboardingHintStepDirective, TuiButton],
    templateUrl: './employee-cell.component.html',
    styleUrl: './employee-cell.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCellComponent implements ICellRendererAngularComp {
    private readonly sidebar = inject(CommentsSidebarService);
    protected readonly onboarding = inject<OnboardingService<ProposalDto>>(OnboardingService);
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
        this.sidebar.open(this.proposal);

        if (this.onboarding.isActive(1, this.proposal)) {
            this.onboarding.next();
        }
    }
}
