# Comment onboarding

`CommentOnboardingService` условно регистрирует onboarding комментариев, когда включен feature flag `enableCommentsOnboarding`.

Общая инфраструктура допускает только один зарегистрированный onboarding. `id` используется только для storage key `@onboarding.comment-triggers.v1` и не попадает в runtime-шаги.

Шаги имеют индексы `0`, `1`, `2`. Сервис предоставляет типизированный tuple `steps`, автоматически удаляет регистрацию при выключении feature flag или уничтожении feature scope, после чего anchors также удаляются.

После окончания показа:

1. удалите `CommentOnboardingService` из feature providers;
2. удалите три `[onboardingStep]` binding из cell renderer, sidebar и comment form;
3. удалите директорию `comments/comment-onboarding`.

Общие `OnboardingService`, `Onboarding`, `OnboardingStepDirective` и `OnboardingStepComponent` останутся для других последовательных сценариев.
