import {computed, Injectable, signal} from '@angular/core';

import {Employee} from '../employee';

export type OnboardingStep = 'idle' | 'comment-icon' | 'comment-tabs' | 'justification-checkbox';

const ONBOARDING_STORAGE_KEY = 'agrid-taiga-onboarding:comments:v1';
const MUTED_STATE = 'muted';

@Injectable({providedIn: 'root'})
export class OnboardingService {
    private readonly mutedState = signal(this.readMutedState());

    public readonly step = signal<OnboardingStep>('idle');
    public readonly selectedEmployee = signal<Employee | null>(null);
    public readonly sidebarOpened = signal(false);
    public readonly isRunning = computed(() => this.step() !== 'idle');
    public readonly isMuted = this.mutedState.asReadonly();
    public readonly shouldAutoStart = computed(() => !this.mutedState());

    public start(employee: Employee, force = false): boolean {
        if (this.mutedState() && !force) {
            return false;
        }

        this.selectedEmployee.set(employee);
        this.sidebarOpened.set(false);
        this.step.set('comment-icon');

        return true;
    }

    public openSidebar(employee: Employee): void {
        this.selectedEmployee.set(employee);
        this.sidebarOpened.set(true);
    }

    public showTabsStep(employee: Employee): void {
        this.openSidebar(employee);
        this.step.set('comment-tabs');
    }

    public showCheckboxStep(): void {
        this.step.set('justification-checkbox');
    }

    public finish(): void {
        this.mute();
    }

    public closeTour(): void {
        this.mute();
    }

    public closeSidebar(): void {
        this.sidebarOpened.set(false);

        if (this.step() === 'comment-tabs' || this.step() === 'justification-checkbox') {
            this.closeTour();
        }
    }

    public isCommentStepFor(employeeId: number): boolean {
        return this.step() === 'comment-icon' && this.selectedEmployee()?.id === employeeId;
    }

    private mute(): void {
        try {
            localStorage.setItem(ONBOARDING_STORAGE_KEY, MUTED_STATE);
        } catch {
            // The tour still closes when storage is unavailable, for example in private mode.
        }

        this.mutedState.set(true);
        this.step.set('idle');
    }

    private readMutedState(): boolean {
        try {
            return localStorage.getItem(ONBOARDING_STORAGE_KEY) === MUTED_STATE;
        } catch {
            return false;
        }
    }
}
