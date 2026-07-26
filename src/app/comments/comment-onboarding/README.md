# Comment onboarding

`config.json` загружается до bootstrap приложения и попадает в `APP_CONFIG`.

`provideCommentOnboarding()` проверяет `features.enableTriggersUiImprovement`:

- при `true` token `COMMENT_ONBOARDING` возвращает экземпляр `CommentOnboardingService`;
- при `false` token возвращает `null`, а сервис не создается и onboarding не регистрируется.

`CommentOnboardingService`:

- регистрирует типизированный tuple `steps`;
- хранит переход первого шага в `onNext`, который открывает sidebar;
- автоматически удаляет регистрацию при уничтожении feature scope;
- использует ключ `@onboarding.comment-triggers.v1`.

После окончания показа:

1. удалите `provideCommentOnboarding()` из feature providers;
2. удалите три `[onboardingStep]` binding из cell renderer, sidebar и comment form;
3. удалите директорию `comments/comment-onboarding`.

Общие `OnboardingService`, `OnboardingStepDirective` и `OnboardingStepComponent` останутся для других сценариев.
