import {inject, InjectionToken, type Provider} from '@angular/core';

import {APP_CONFIG} from '../../app-config';
import {CommentOnboardingService} from './comment-onboarding.service';

export const COMMENT_ONBOARDING = new InjectionToken<CommentOnboardingService | null>(
    '[COMMENT_ONBOARDING]: CommentOnboardingService',
);

export function provideCommentOnboarding(): Provider {
    return [
        CommentOnboardingService,
        {
            provide: COMMENT_ONBOARDING,
            useFactory: () =>
                inject(APP_CONFIG).features?.enableTriggersUiImprovement
                    ? inject(CommentOnboardingService)
                    : null,
        },
    ];
}
