# AG Grid + Taiga UI onboarding prototype

Прототип трехшагового онбординга для таблицы заявок и правого сайдбара комментариев.

## Что реализовано

- Angular 19.2.6;
- Taiga UI 4.69.0;
- AG Grid 34.2.0;
- моковые данные сотрудников;
- Angular cell renderer для иконки комментария;
- открытие сайдбара справа от таблицы;
- три шага онбординга на `TuiHint` + `tuiHintManual`;
- без `ngx-ui-tour-tui-hint`;
- автоматический запуск при первом открытии страницы;
- блокирующий backdrop на время прохождения;
- сохранение mute-состояния в `localStorage`;
- подсветка anchor-элементов и закрытие по `Escape`;
- ручной повторный запуск кнопкой «Запустить онбординг».

## Поведение onboarding

При первом открытии страницы onboarding запускается автоматически и блокирует взаимодействие с интерфейсом под hint.

Onboarding сохраняет значение `muted` по ключу:

```text
agrid-taiga-onboarding:comments:v1
```

Mute-состояние записывается в двух случаях:

- пользователь нажал крестик в карточке onboarding или `Escape`;
- пользователь дошел до третьего шага и нажал «Понятно».

После перезагрузки страницы onboarding автоматически больше не показывается. Кнопка «Запустить онбординг» оставлена для ручной демонстрации прототипа и запускает его принудительно.

Чтобы проверить сценарий первого открытия повторно, выполните в DevTools:

```js
localStorage.removeItem('agrid-taiga-onboarding:comments:v1');
location.reload();
```

## Локальный запуск

```bash
npm install
npm start
```

Откройте `http://localhost:4200`.

## Production build

```bash
npm run build
```

Для GitHub Pages используется отдельная сборка с корректным `base-href`:

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

Для публикации в настройках репозитория выберите:

`Settings` → `Pages` → `Build and deployment` → `Source: GitHub Actions`.

После merge в `main` приложение будет доступно по адресу:

`https://taiga-family-labs.github.io/agrid-taiga-onboarding/`

## Сценарий

1. Шаг привязан к иконке комментария первой строки AG Grid.
2. По «Далее» открывается сайдбар выбранного сотрудника и подсвечиваются табы.
3. Последний шаг привязан к чекбоксу «Учитывать как обоснование».

Это намеренно локальный прототип: он показывает механику ручного тура на Taiga UI без отдельного tour framework.
