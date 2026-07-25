# AG Grid + Taiga UI onboarding prototype

Учебный прототип трехшагового онбординга для AG Grid и правого сайдбара комментариев.

## Стек

- Angular 19.2.6;
- Taiga UI 4.69.0;
- AG Grid 34.2.0;
- без `ngx-ui-tour-tui-hint`.

## Архитектура

### Общая инфраструктура

- `OnboardingService` регистрирует и удаляет независимые onboarding-flow.
- `Onboarding` представляет одну зарегистрированную последовательность.
- `OnboardingStepDirective` скрывает интеграцию с `TuiHint`, `TuiHintManual`, `TuiHintPosition` и `tuiDirectiveBinding`.
- стили anchor и overlay подключаются самой директивой через `tuiWithStyles`;
- `OnboardingStepComponent` задает общий layout шага и использует content projection;
- интерфейсы и типы вынесены в `onboarding.types.ts`.

### Онбординг комментариев

- `CommentOnboardingService` регистрирует три шага;
- шаги представлены типизированным immutable tuple `steps`;
- содержимое находится в `comments/comment-onboarding/comment-onboarding-steps`;
- файлы шагов называются `one-step`, `two-step` и `third-step`;
- каждый шаг передается в Taiga UI как `PolymorpheusComponent`;
- открытие сайдбара объявлено рядом с anchor через `(onboardingStepOnNext)`;
- при уничтожении feature-сервиса регистрация автоматически удаляется.

После удаления временного онбординга общие `OnboardingService`, `OnboardingStepDirective` и `OnboardingStepComponent` остаются для следующих сценариев. Нужно удалить только feature-provider, три `[onboardingStep]` binding и директорию `comments/comment-onboarding`.

## Локальный запуск

```bash
npm install
npm start
```

Откройте `http://localhost:4200`.

Для повторной проверки первого посещения:

```js
localStorage.removeItem('@onboarding.comment-triggers.1');
location.reload();
```

## Поведение

1. Первый шаг привязан к иконке комментария первой доступной заявки в AG Grid.
2. Кнопка `Далее` вызывает `(onboardingStepOnNext)` и открывает широкий сайдбар с целым `ProposalDto`.
3. Второй шаг привязан к `tui-segmented`.
4. Третий шаг привязан к контролу `Учитывать как обоснование`.
5. Крестик или `Понятно` сохраняют `muted` в `localStorage`.
6. `Escape` не закрывает онбординг.
7. Прозрачный backdrop блокирует интерфейс под текущим шагом.
8. Кнопка `Запустить онбординг` принудительно запускает демонстрацию повторно.

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
