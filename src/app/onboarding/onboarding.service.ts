import {computed, Injectable, signal} from '@angular/core';

import {Employee} from '../employee';

export type OnboardingStep = 'idle' | 'comment-icon' | 'comment-tabs' | 'justification-checkbox';

@Injectable({providedIn: 'root'})
export class OnboardingService {
    public readonly step = signal<OnboardingStep>('idle');
    public readonly selectedEmployee = signal<Employee | null>(null);
    public readonly sidebarOpened = signal(false);
    public readonly isRunning = computed(() => this.step() !== 'idle');

    public start(employee: Employee): void {
        this.selectedEmployee.set(employee);
        this.sidebarOpened.set(false);
        this.step.set('comment-icon');
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
        this.step.set('idle');
    }

    public closeTour(): void {
        this.step.set('idle');
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
}
