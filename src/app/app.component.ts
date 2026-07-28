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

import {
    provideTravelNotesOnboarding,
    TRAVEL_NOTES_ONBOARDING,
} from './comments/comment-onboarding/comment-onboarding.provider';
import {TravelNotesSidebarComponent} from './comments/comments-sidebar/comments-sidebar.component';
import {TravelNotesSidebarService} from './comments/comments-sidebar/comments-sidebar.service';
import {TRAVEL_PLANS} from './data/proposals';
import {TravelPlanCellComponent} from './grid/employee-cell.component';
import {OnboardingService} from './onboarding/onboarding.service';
import {TravelPlanDto} from './proposal.dto';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'onboarding-demo',
    imports: [AgGridAngular, TravelNotesSidebarComponent, TuiButton, TuiRoot, TuiTitle],
    providers: [provideTravelNotesOnboarding(), TravelNotesSidebarService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected readonly onboarding = inject(OnboardingService);
    protected readonly travelNotesOnboarding = inject(TRAVEL_NOTES_ONBOARDING);
    protected readonly sidebar = inject(TravelNotesSidebarService);
    protected readonly rowData = TRAVEL_PLANS;

    protected readonly defaultColDef: ColDef<TravelPlanDto> = {
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 140,
    };

    protected readonly columnDefs: ColDef<TravelPlanDto>[] = [
        {
            colId: 'title',
            field: 'title',
            headerName: 'Маршрут',
            cellRenderer: TravelPlanCellComponent,
            minWidth: 300,
            flex: 1.5,
        },
        {field: 'country', headerName: 'Страна', minWidth: 190},
        {field: 'season', headerName: 'Сезон', minWidth: 130},
        {field: 'durationDays', headerName: 'Дней', minWidth: 110},
        {field: 'status', headerName: 'Статус', minWidth: 170},
    ];

    private gridApi: GridApi<TravelPlanDto> | null = null;
    private autoStartAttempted = false;

    protected onGridReady(event: GridReadyEvent<TravelPlanDto>): void {
        this.gridApi = event.api;
    }

    protected onFirstDataRendered(): void {
        if (this.autoStartAttempted) {
            return;
        }

        this.autoStartAttempted = true;
        this.startTour();
    }

    protected startTour(ignoreMuted = false): void {
        const travelPlan = this.rowData[0];

        if (
            !travelPlan ||
            !this.travelNotesOnboarding?.start(travelPlan, ignoreMuted)
        ) {
            return;
        }

        this.sidebar.close();
        this.gridApi?.ensureColumnVisible('title');
        this.gridApi?.forEachNode((node) => {
            if (node.data?.id === travelPlan.id) {
                this.gridApi?.ensureNodeVisible(node, 'middle');
            }
        });
    }

    protected closeSidebar(): void {
        this.sidebar.close();

        if (this.onboarding.isRunning()) {
            this.onboarding.close();
        }
    }
}
