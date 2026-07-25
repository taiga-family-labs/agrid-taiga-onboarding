import {computed, Directive, inject, input} from '@angular/core';
import {tuiDirectiveBinding} from '@taiga-ui/cdk';
import {TuiHintDirective, TuiHintManual} from '@taiga-ui/core';

import {OnboardingService} from './onboarding.service';

@Directive({
    selector: '[onboardingHintStep]',
    hostDirectives: [
        {
            directive: TuiHintDirective,
            inputs: ['tuiHint', 'tuiHintDirection'],
        },
        TuiHintManual,
    ],
    host: {
        '[class.onboarding-active-anchor]': 'active()',
    },
})
export class OnboardingHintStepDirective {
    private readonly onboarding = inject(OnboardingService);

    public readonly step = input.required<number>({alias: 'onboardingHintStep'});
    public readonly context = input<unknown | null>(null, {
        alias: 'onboardingHintStepContext',
    });

    protected readonly active = computed(() => {
        const context = this.context();

        return (
            this.onboarding.step() === this.step() &&
            (context === null || Object.is(this.onboarding.context(), context))
        );
    });

    private readonly appearance = tuiDirectiveBinding(
        TuiHintDirective,
        'appearance',
        'onboarding',
    );

    private readonly manual = tuiDirectiveBinding(TuiHintManual, 'visible', this.active);
}
