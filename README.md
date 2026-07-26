# AG Grid + Taiga UI onboarding prototype

Учебный прототип трехшагового онбординга для AG Grid и правого сайдбара комментариев.

## Стек

- Angular 19.2.6;
- Taiga UI 4.69.0;
- AG Grid 34.2.0;
- без `ngx-ui-tour-tui-hint`.

## Архитектура

### Общая инфраструктура

- `OnboardingService` управляет одной зарегистрированной onboarding-последовательностью;
- `Onboarding` представляет зарегистрированную последовательность;
- `OnboardingStepDirective` скрывает интеграцию с `TuiHint`, `TuiHintManual`, `TuiHintPosition` и `tuiDirectiveBinding`;
- стили anchor и overlay подключаются самой директивой через `tuiWithStyles`;
- `OnboardingStepComponent` задает общий layout шага и использует content projection;
- интерфейсы и типы вынесены в `onboarding.types.ts`.

`id` используется только для построения ключа `localStorage`. Ключ формируется по шаблону `@onboarding.{id}.v{version}`, где `version` по умолчанию равна `1`.

### Runtime configuration

До bootstrap приложение загружает `config.json` и предоставляет его через token `APP_CONFIG`.

```json
{
  "features": {
    "enableTriggersUiImprovement": true
  }
}
```

`provideCommentOnboarding()` проверяет этот флаг и предоставляет token `COMMENT_ONBOARDING`:

- экземпляр `CommentOnboardingService`, когда флаг включен;
- `null`, когда флаг выключен.

При выключенном флаге сервис не создается и onboarding не регистрируется.

### Онбординг комментариев

- `CommentOnboardingService` регистрирует три шага;
- шаги представлены типизированным immutable tuple `steps`;
- содержимое находится в `comments/comment-onboarding/comment-onboarding-steps`;
- каждый шаг передается в Taiga UI как `PolymorpheusComponent`;
- открытие сайдбара объявлено рядом с anchor через `(onboardingStepOnNext)`;
- первый шаг регистрируется только для выбранного `ProposalDto`, а не для каждой строки AG Grid;
- при уничтожении feature-сервиса регистрация автоматически удаляется.

После удаления временного онбординга общие `OnboardingService`, `OnboardingStepDirective` и `OnboardingStepComponent` остаются для следующих сценариев. Нужно удалить только feature-provider, три `[onboardingStep]` binding и директорию `comments/comment-onboarding`.

## Локальный запуск

```bash
npm install
npm start
```

Откройте `http://localhost:4200`.

Чтобы отключить onboarding, измените флаг в `src/config.json` и перезапустите приложение:

```json
{
  "features": {
    "enableTriggersUiImprovement": false
  }
}
```

Для повторной проверки первого посещения:

```js
localStorage.removeItem('@onboarding.comment-triggers.v1');
location.reload();
```

## Поведение

1. Первый шаг привязан к иконке комментария выбранной заявки в AG Grid.
2. Кнопка `Далее` вызывает `(onboardingStepOnNext)` и открывает широкий сайдбар с целым `ProposalDto`.
3. Второй шаг привязан к `tui-segmented`.
4. Третий шаг привязан к контролу `Учитывать как обоснование`.
5. Крестик или `Понятно` сохраняют `muted` в `localStorage`.
6. `Escape` не закрывает онбординг.
7. Прозрачный backdrop блокирует интерфейс под текущим шагом.
8. Кнопка `Запустить онбординг` вызывает `start(true)` и повторно запускает демонстрацию без удаления muted-state.

## Production build

```bash
npm run build
```

Для GitHub Pages:

```bash
npm run build:pages
```

Результат находится в `dist/agrid-taiga-onboarding/browser`.

## CI и GitHub Pages

Workflow `.github/workflows/pages.yml`:

- собирает проект для каждого Pull Request;
- собирает и публикует GitHub Pages после push в `main`;
- поддерживает ручной запуск через `workflow_dispatch`;
- создает `404.html` для SPA fallback.

Для публикации выберите:

`Settings` → `Pages` → `Build and deployment` → `Source: GitHub Actions`.

После merge в `main` приложение будет доступно по адресу:

`https://taiga-family-labs.github.io/agrid-taiga-onboarding/`
