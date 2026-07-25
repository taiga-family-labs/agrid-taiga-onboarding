import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiHint, TuiRoot, TuiTitle} from '@taiga-ui/core';
import {TuiTabs} from '@taiga-ui/kit';
import {AgGridAngular} from 'ag-grid-angular';
import {
    AllCommunityModule,
    type ColDef,
    type GridApi,
    type GridReadyEvent,
    ModuleRegistry,
} from 'ag-grid-community';

import {EMPLOYEES} from './data/employees';
import {Employee} from './employee';
import {EmployeeCellComponent} from './grid/employee-cell.component';
import {OnboardingCardComponent} from './onboarding/onboarding-card.component';
import {OnboardingService} from './onboarding/onboarding.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'app-root',
    imports: [
        AgGridAngular,
        FormsModule,
        OnboardingCardComponent,
        TuiButton,
        TuiHint,
        TuiRoot,
        TuiTabs,
        TuiTitle,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected readonly onboarding = inject(OnboardingService);
    protected readonly rowData = EMPLOYEES;
    protected activeTab = 0;
    protected comment = '';
    protected isJustification = false;

    protected readonly defaultColDef: ColDef<Employee> = {
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 140,
    };

    protected readonly columnDefs: ColDef<Employee>[] = [
        {
            colId: 'employeeFullName',
            field: 'name',
            headerName: 'Сотрудник',
            cellRenderer: EmployeeCellComponent,
            minWidth: 320,
            flex: 1.5,
        },
        {field: 'department', headerName: 'Подразделение', minWidth: 210},
        {field: 'currentCr', headerName: 'Текущий CR', minWidth: 130},
        {field: 'recommendedCr', headerName: 'Новый CR', minWidth: 130},
        {field: 'status', headerName: 'Статус', minWidth: 180},
    ];

    private gridApi: GridApi<Employee> | null = null;
    private autoStartAttempted = false;

    protected onGridReady(event: GridReadyEvent<Employee>): void {
        this.gridApi = event.api;
    }

    protected onFirstDataRendered(): void {
        if (this.autoStartAttempted) {
            return;
        }

        this.autoStartAttempted = true;
        this.startTour(false);
    }

    protected startTour(force = true): void {
        const employee = this.rowData[0];

        if (!employee || (!force && !this.onboarding.shouldAutoStart())) {
            return;
        }

        this.gridApi?.ensureColumnVisible('employeeFullName');
        this.gridApi?.forEachNode((node) => {
            if (node.data?.id === employee.id) {
                this.gridApi?.ensureNodeVisible(node, 'middle');
            }
        });
        this.onboarding.start(employee, force);
    }

    protected sendComment(): void {
        this.comment = '';
        this.isJustification = false;
    }
}
