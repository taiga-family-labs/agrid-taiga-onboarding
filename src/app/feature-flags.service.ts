import {inject, Injectable, signal} from '@angular/core';
import {WA_LOCAL_STORAGE} from '@ng-web-apis/common';

const ENABLE_COMMENTS_ONBOARDING_KEY = '@feature.enableCommentsOnboarding';

@Injectable({providedIn: 'root'})
export class FeatureFlagsService {
    private readonly localStorage = inject(WA_LOCAL_STORAGE);

    public readonly enableCommentsOnboarding = signal(
        this.localStorage.getItem(ENABLE_COMMENTS_ONBOARDING_KEY) !== 'false',
    );

    public setEnableCommentsOnboarding(enabled: boolean): void {
        this.localStorage.setItem(ENABLE_COMMENTS_ONBOARDING_KEY, String(enabled));
        this.enableCommentsOnboarding.set(enabled);
    }
}
