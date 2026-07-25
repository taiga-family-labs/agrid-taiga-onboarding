import {computed, Injectable, signal} from '@angular/core';

import {ProposalDto} from '../proposal.dto';

export const COMMENTS_ONBOARDING_STEPS = [
    'comment-icon',
    'comment-tabs',
    'justification-checkbox',
] as const;

export type CommentsOnboardingStep = (typeof COMMENTS_ONBOARDING_STEPS)[number];

const ONBOARDING_STORAGE_KEY = 'agrid-taiga-onboarding:comments:v1';
const MUTED_STATE = 'muted';

@Injectable({providedIn: 'root'})
export class CommentsOnboardingService {
    private readonly mutedState = signal(this.readMutedState());

    public readonly step = signal<CommentsOnboardingStep | null>(null);
    public readonly selectedProposal = signal<ProposalDto | null>(null);
    public readonly sidebarOpened = signal(false);
    public readonly isRunning = computed(() => this.step() !== null);
    public readonly isMuted = this.mutedState.asReadonly();
    public readonly shouldAutoStart = computed(() => !this.mutedState());
    public readonly currentStepNumber = computed(() => {
        const currentStep = this.step();
        const index = currentStep === null ? -1 : COMMENTS_ONBOARDING_STEPS.indexOf(currentStep);

        return index + 1;
    });

    public readonly stepsCount = COMMENTS_ONBOARDING_STEPS.length;

    public start(proposal: ProposalDto, force = false): boolean {
        if (this.mutedState() && !force) {
            return false;
        }

        this.selectedProposal.set(proposal);
        this.sidebarOpened.set(false);
        this.step.set(COMMENTS_ONBOARDING_STEPS[0]);

        return true;
    }

    public openSidebar(proposal: ProposalDto): void {
        this.selectedProposal.set(proposal);
        this.sidebarOpened.set(true);
    }

    public next(): void {
        switch (this.step()) {
            case 'comment-icon':
                if (this.selectedProposal() === null) {
                    this.close();
                    return;
                }

                this.sidebarOpened.set(true);
                this.step.set('comment-tabs');
                break;

            case 'comment-tabs':
                this.step.set('justification-checkbox');
                break;

            case 'justification-checkbox':
                this.close();
                break;

            case null:
                break;
        }
    }

    public close(): void {
        this.mute();
    }

    public closeSidebar(): void {
        this.sidebarOpened.set(false);

        if (this.step() === 'comment-tabs' || this.step() === 'justification-checkbox') {
            this.close();
        }
    }

    public isCommentStepFor(proposalId: number): boolean {
        return this.step() === 'comment-icon' && this.selectedProposal()?.id === proposalId;
    }

    private mute(): void {
        try {
            localStorage.setItem(ONBOARDING_STORAGE_KEY, MUTED_STATE);
        } catch {
            // The tour still closes when storage is unavailable, for example in private mode.
        }

        this.mutedState.set(true);
        this.step.set(null);
    }

    private readMutedState(): boolean {
        try {
            return localStorage.getItem(ONBOARDING_STORAGE_KEY) === MUTED_STATE;
        } catch {
            return false;
        }
    }
}
