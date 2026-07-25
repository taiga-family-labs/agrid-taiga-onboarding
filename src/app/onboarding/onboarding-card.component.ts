import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';

export type OnboardingPreview = 'icons' | 'tabs' | 'checkbox';

@Component({
    selector: 'app-onboarding-card',
    imports: [TuiButton, TuiTitle],
    templateUrl: './onboarding-card.component.html',
    styleUrl: './onboarding-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingCardComponent {
    public readonly title = input.required<string>();
    public readonly description = input.required<string>();
    public readonly currentStep = input.required<number>();
    public readonly preview = input.required<OnboardingPreview>();
    public readonly actionText = input('Далее');
    public readonly next = output<void>();
    public readonly close = output<void>();
}
