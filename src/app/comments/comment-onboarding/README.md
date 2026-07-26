# Comment onboarding

`CommentOnboardingService` регистрирует временный onboarding комментариев в общей инфраструктуре.

Он предоставляет типизированный tuple `steps`, автоматически удаляет регистрацию при уничтожении feature scope и использует ключ `@onboarding.comment-triggers.v1`.

После окончания показа:

1. удалите `CommentOnboardingService` из feature providers;
2. удалите три `[onboardingStep]` binding из cell renderer, sidebar и comment form;
3. удалите директорию `comments/comment-onboarding`.

Общие `OnboardingService`, `Onboarding`, `OnboardingStepDirective` и `OnboardingStepComponent` останутся для других сценариев.
