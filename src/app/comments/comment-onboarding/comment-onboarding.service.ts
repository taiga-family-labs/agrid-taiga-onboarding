import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core';

import {FeatureFlagsService} from '../../feature-flags.service';
import {Onboarding} from '../../onboarding/onboarding';
import {OnboardingService} from '../../onboarding/onboarding.service';
import {ProposalDto} from '../../proposal.dto';
import {ONE_STEP} from './comment-onboarding-steps/one-step.component';
import {THIRD_STEP} from './comment-onboarding-steps/third-step.component';
import {TWO_STEP} from './comment-onboarding-steps/two-step.component';

const COMMENT_ONBOARDING_STEPS = [ONE_STEP, TWO_STEP, THIRD_STEP] as const;
const EMPTY_STEPS = [null, null, null] as const;

type CommentOnboarding = Onboarding<typeof COMMENT_ONBOARDING_STEPS>;

@Injectable()
export class CommentOnboardingService {
    private readonly featureFlags = inject(FeatureFlagsService);
    private readonly onboarding = inject(OnboardingService);
    private readonly targetProposalId = signal<number | null>(null);
    private readonly ref = signal<CommentOnboarding | null>(null);

    public readonly enabled = this.featureFlags.enableCommentsOnboarding.asReadonly();
    public readonly steps = computed(() => this.ref()?.steps ?? EMPTY_STEPS);

    private readonly registration = effect((onCleanup) => {
        if (!this.enabled()) {
            this.targetProposalId.set(null);
            return;
        }

        const ref = untracked(() =>
            this.onboarding.register({
                id: 'comment-triggers',
                steps: COMMENT_ONBOARDING_STEPS,
            }),
        );

        this.ref.set(ref);

        onCleanup(() => {
            ref.unregister();
            this.ref.set(null);
            this.targetProposalId.set(null);
        });
    });

    public start(proposal: ProposalDto, force = false): boolean {
        const ref = this.ref();

        if (ref === null) {
            return false;
        }

        this.targetProposalId.set(proposal.id);

        const started = ref.start(force);

        if (!started) {
            this.targetProposalId.set(null);
        }

        return started;
    }

    public isTarget(proposal: ProposalDto): boolean {
        return this.enabled() && this.targetProposalId() === proposal.id;
    }

    public next(): void {
        this.ref()?.next();
    }

    public close(): void {
        this.ref()?.close();
    }

    public clearMutedState(): void {
        this.ref()?.clearMutedState();
    }

    public shouldAutoStart(): boolean {
        return this.ref()?.shouldAutoStart() ?? false;
    }
}
