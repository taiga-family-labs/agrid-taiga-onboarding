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

import {CommentOnboardingService} from './comments/comment-onboarding/comment-onboarding.service';
import {CommentsSidebarComponent} from './comments/comments-sidebar/comments-sidebar.component';
import {CommentsSidebarService} from './comments/comments-sidebar/comments-sidebar.service';
import {PROPOSALS} from './data/proposals';
import {FeatureFlagsService} from './feature-flags.service';
import {EmployeeCellComponent} from './grid/employee-cell.component';
import {OnboardingService} from './onboarding/onboarding.service';
import {ProposalDto} from './proposal.dto';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'onboarding-demo',
    imports: [AgGridAngular, CommentsSidebarComponent, TuiButton, TuiRoot, TuiTitle],
    providers: [CommentOnboardingService, CommentsSidebarService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected readonly featureFlags = inject(FeatureFlagsService);
    protected readonly onboarding = inject(OnboardingService);
    protected readonly commentOnboarding = inject(CommentOnboardingService);
    protected readonly sidebar = inject(CommentsSidebarService);
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
        this.startTour();
    }

    protected setCommentsOnboardingEnabled(event: Event): void {
        const target = event.target;

        if (target instanceof HTMLInputElement) {
            this.featureFlags.setEnableCommentsOnboarding(target.checked);
        }
    }

    protected startTour(force = false): void {
        const proposal = this.rowData[0];

        if (!proposal || (!force && !this.commentOnboarding.shouldAutoStart())) {
            return;
        }

        this.sidebar.close();
        this.gridApi?.ensureColumnVisible('employeeFullName');
        this.gridApi?.forEachNode((node) => {
            if (node.data?.id === proposal.id) {
                this.gridApi?.ensureNodeVisible(node, 'middle');
            }
        });
        this.commentOnboarding.start(proposal, force);
    }

    protected closeSidebar(): void {
        this.sidebar.close();

        if (this.onboarding.stepIndex() > 0) {
            this.commentOnboarding.close();
        }
    }
}
