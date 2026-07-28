# AG Grid + Taiga UI onboarding prototype

Учебный прототип трехшагового онбординга для AG Grid и правого сайдбара заметок. Демонстрационный сценарий построен вокруг планирования путешествий и не привязан к реальному корпоративному продукту.

## Стек

- Angular 19.2.6;
- Taiga UI 4.69.0;
- AG Grid 34.2.0;
- без `ngx-ui-tour-tui-hint`.

## Архитектура

### Общая инфраструктура

- `OnboardingService` управляет одной зарегистрированной onboarding-последовательностью;
- `register()` возвращает типизированный tuple runtime-шагов;
- переход между шагами описывается через optional `onNext` в definition шага;
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
    "enableTravelNotesOnboarding": true
  }
}
```

`provideTravelNotesOnboarding()` проверяет этот флаг и предоставляет token `TRAVEL_NOTES_ONBOARDING`:

- экземпляр `TravelNotesOnboardingService`, когда флаг включен;
- `null`, когда флаг выключен.

При выключенном флаге сервис не создается и onboarding не регистрируется.

### Онбординг заметок о путешествии

- `TravelNotesOnboardingService` регистрирует три шага;
- шаги представлены типизированным immutable tuple `steps`;
- содержимое находится в `comments/comment-onboarding/comment-onboarding-steps`;
- каждый шаг передается в Taiga UI как `PolymorpheusComponent`;
- первый шаг содержит `onNext`, который открывает sidebar для выбранного `TravelPlanDto`;
- первый шаг привязывается только к выбранной строке AG Grid;
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
    "enableTravelNotesOnboarding": false
  }
}
```

Для повторной проверки первого посещения:

```js
localStorage.removeItem('@onboarding.travel-notes.v1');
location.reload();
```

## Демонстрационный сценарий

1. Таблица содержит вымышленные маршруты, страны, сезоны, длительность и статус планирования.
2. Первый шаг привязан к иконке заметок выбранного маршрута в AG Grid.
3. Кнопка `Далее` выполняет `onNext` первого шага и открывает sidebar с выбранным `TravelPlanDto`.
4. Второй шаг объясняет категории заметок: `Все`, `Подготовка` и `Впечатления`.
5. Третий шаг показывает, как добавить важную заметку в чек-лист подготовки.
6. Крестик или `Понятно` сохраняют `muted` в `localStorage`.
7. `Escape` не закрывает онбординг.
8. Прозрачный backdrop блокирует интерфейс под текущим шагом.
9. Кнопка `Запустить онбординг` вызывает `start(true)` и повторно запускает демонстрацию без удаления muted-state.

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
