import {computed, Directive, inject, input} from '@angular/core';
import {tuiDirectiveBinding} from '@taiga-ui/cdk';
import {
    type TuiHintDirection,
    TuiHintDirective,
    TuiHintManual,
    TuiHintPosition,
} from '@taiga-ui/core';

import {OnboardingService, type OnboardingStepRef} from './onboarding.service';

@Directive({
    selector: '[onboardingHintStep]',
    hostDirectives: [TuiHintDirective, TuiHintManual],
    host: {
        '[class.onboarding-active-anchor]': 'active()',
    },
})
export class OnboardingHintStepDirective {
    private readonly onboarding = inject(OnboardingService);

    public readonly step = input.required<OnboardingStepRef>({
        alias: 'onboardingHintStep',
    });

    public readonly context = input<unknown | undefined>(undefined, {
        alias: 'onboardingHintStepContext',
    });

    public readonly direction = input<TuiHintDirection>('bottom', {
        alias: 'onboardingHintDirection',
    });

    protected readonly active = computed(() =>
        this.onboarding.isActive(this.step(), this.context()),
    );

    private readonly content = tuiDirectiveBinding(
        TuiHintDirective,
        'content',
        computed(() => this.step().content),
    );

    private readonly appearance = tuiDirectiveBinding(
        TuiHintDirective,
        'appearance',
        'onboarding',
    );

    private readonly manual = tuiDirectiveBinding(
        TuiHintManual,
        'tuiHintManual',
        this.active,
    );

    private readonly position = tuiDirectiveBinding(
        TuiHintPosition,
        'direction',
        this.direction,
    );
}
