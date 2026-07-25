import {type PolymorpheusContent} from '@taiga-ui/polymorpheus';

export interface OnboardingOptions<TSteps extends readonly PolymorpheusContent[]> {
    readonly id: string;
    readonly version?: number;
    readonly steps: TSteps;
}

export interface OnboardingStep {
    readonly onboardingId: string;
    readonly index: number;
    readonly content: PolymorpheusContent;
}

export interface OnboardingAnchor {
    readonly onNext: () => void;
}

export type OnboardingSteps<TSteps extends readonly PolymorpheusContent[]> = {
    readonly [K in keyof TSteps]: OnboardingStep;
};
