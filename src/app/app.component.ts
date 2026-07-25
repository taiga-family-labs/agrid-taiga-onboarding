import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton, TuiRoot, TuiTitle} from '@taiga-ui/core';
import {AgGridAngular} from 'ag-grid-angular';
import {
    AllCommunityModule,
    type ColDef,
    type GridApi,
    type GridReadyEvent,
    ModuleRegistry,
} from 'ag-grid-community';

import {CommentsSidebarComponent} from './comments/comments-sidebar/comments-sidebar.component';
import {PROPOSALS} from './data/proposals';
import {EmployeeCellComponent} from './grid/employee-cell.component';
import {CommentsOnboardingService} from './onboarding/onboarding.service';
import {ProposalDto} from './proposal.dto';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'app-root',
    imports: [AgGridAngular, CommentsSidebarComponent, TuiButton, TuiRoot, TuiTitle],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected readonly onboarding = inject(CommentsOnboardingService);
    protected readonly rowData = PROPOSALS;

    protected readonly defaultColDef: ColDef<ProposalDto> = {
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 140,
    };

    protected readonly columnDefs: ColDef<ProposalDto>[] = [
        {
            colId: 'employeeFullName',
            field: 'employeeFullName',
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

    private gridApi: GridApi<ProposalDto> | null = null;
    private autoStartAttempted = false;

    protected onGridReady(event: GridReadyEvent<ProposalDto>): void {
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
        const proposal = this.rowData[0];

        if (!proposal || (!force && !this.onboarding.shouldAutoStart())) {
            return;
        }

        this.gridApi?.ensureColumnVisible('employeeFullName');
        this.gridApi?.forEachNode((node) => {
            if (node.data?.id === proposal.id) {
                this.gridApi?.ensureNodeVisible(node, 'middle');
            }
        });
        this.onboarding.start(proposal, force);
    }
}
