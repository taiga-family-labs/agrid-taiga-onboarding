import {
    ChangeDetectionStrategy,
    Component,
    computed,
    Directive,
    effect,
    inject,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import {tuiDirectiveBinding, tuiWithStyles} from '@taiga-ui/cdk';
import {
    type TuiHintDirection,
    TuiHintDirective,
    TuiHintManual,
    TuiHintPosition,
} from '@taiga-ui/core';

import {OnboardingService} from './onboarding.service';
import {
    type OnboardingAnchor,
    type OnboardingStep,
} from './onboarding.types';

@Component({
    standalone: true,
    template: '',
    styles: `
        [onboardingActiveAnchor] {
            position: relative;
            z-index: 1;
            box-shadow:
                0 0 0 2px #6aa5ff,
                0 0 0 4px #fff,
                0 0 0 6px #b5d2ff !important;
        }

        onboarding-step footer [tuiButton] {
            min-inline-size: 5.75rem;
            background: #fff;
            color: #303744;
        }

        onboarding-step footer [tuiButton]:hover {
            background: #f2f5fa !important;
        }

        tui-hint[data-appearance='onboarding'] {
            inline-size: min(29rem, calc(100vw - 1rem)) !important;
            max-inline-size: calc(100vw - 1rem) !important;
            pointer-events: auto !important;
        }
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnboardingStyles {}

@Directive({
    selector: '[onboardingStep]',
    hostDirectives: [TuiHintDirective, TuiHintManual],
    host: {
        '[attr.onboardingActiveAnchor]': 'active() ? "" : null',
    },
})
export class OnboardingStepDirective {
    private readonly onboarding = inject(OnboardingService);

    public readonly step = input.required<OnboardingStep>({alias: 'onboardingStep'});
    public readonly direction = input<TuiHintDirection>('bottom', {
        alias: 'onboardingStepDirection',
    });
    public readonly onNext = output<void>({alias: 'onboardingStepOnNext'});

    private readonly anchor: OnboardingAnchor = {
        onNext: () => this.onNext.emit(),
    };

    protected readonly active = computed(() =>
        this.onboarding.isActive(this.step(), this.anchor),
    );

    protected readonly styles = tuiWithStyles(OnboardingStyles);

    protected readonly registration = effect((onCleanup) => {
        const unregister = this.onboarding.registerAnchor(this.step(), this.anchor);

        onCleanup(unregister);
    });

    protected readonly content = tuiDirectiveBinding(
        TuiHintDirective,
        'content',
        computed(() => this.step().content),
    );

    protected readonly appearance = tuiDirectiveBinding(
        TuiHintDirective,
        'appearance',
        'onboarding',
    );

    protected readonly manual = tuiDirectiveBinding(
        TuiHintManual,
        'tuiHintManual',
        this.active,
    );

    protected readonly position = tuiDirectiveBinding(
        TuiHintPosition,
        'direction',
        this.direction,
    );
}
