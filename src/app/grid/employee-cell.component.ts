import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiHint} from '@taiga-ui/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

import {Employee} from '../employee';
import {OnboardingCardComponent} from '../onboarding/onboarding-card.component';
import {OnboardingService} from '../onboarding/onboarding.service';

@Component({
    selector: 'app-employee-cell',
    imports: [OnboardingCardComponent, TuiButton, TuiHint],
    templateUrl: './employee-cell.component.html',
    styleUrl: './employee-cell.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCellComponent implements ICellRendererAngularComp {
    protected readonly onboarding = inject(OnboardingService);
    protected employee!: Employee;

    public agInit(params: ICellRendererParams<Employee>): void {
        if (params.data) {
            this.employee = params.data;
        }
    }

    public refresh(params: ICellRendererParams<Employee>): boolean {
        this.agInit(params);

        return true;
    }

    protected openComments(): void {
        if (this.onboarding.isCommentStepFor(this.employee.id)) {
            this.onboarding.showTabsStep(this.employee);
            return;
        }

        this.onboarding.openSidebar(this.employee);
    }
}
