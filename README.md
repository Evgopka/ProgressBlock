# Progress Block

Прототип блока Progress для мобильных web-приложений.  
Тестовое задание — реализован на чистом HTML + CSS + JS, без библиотек и фреймворков.

## Структура файлов

```
├── index.html                          # Разметка приложения
├── main.css                            # Базовые стили, токены, карточка, адаптивность
├── progressblock/
│   ├── progressblock.js                # Ядро: ProgressBlockManager (логика блока)
│   └── progressblock.css               # Стили дуги и состояний Normal / Animated
├── progressblockcontrol/
│   ├── progressblockcontrol.js         # Контроллер: привязка UI к менеджеру
│   └── progressblockcontrol.css        # Стили панели управления и инпута
└── checkbox/
    └── checkbox.css                    # Стили кастомного toggle-переключателя
```

## Состояния блока

| Состояние  | Описание |
|------------|----------|
| `Normal`   | Базовое. Дуга заполняется по значению Value (0–100), старт с 12 часов по часовой стрелке |
| `Animated` | Независимое. Блок вращается по часовой стрелке с постоянной скоростью |
| `Hidden`   | Блок скрывается со страницы с плавной анимацией |

## Адаптивность

- **Portrait** (вертикальная ориентация) — дуга сверху, контролы снизу
- **Landscape** (горизонтальная ориентация) — дуга слева, контролы справа

Реализовано через `@media (orientation: landscape)` — реагирует на поворот устройства.

## JavaScript API

После загрузки страницы менеджер доступен глобально как `window.progress`.  
Можно управлять блоком программно из консоли браузера или внешнего кода:

```js
// Установить значение прогресса (0–100)
progress.setValue(75);

// Включить / выключить анимацию вращения
progress.setMod('animated', true);
progress.setMod('animated', false);

// Скрыть / показать блок
progress.setMod('hidden', true);
progress.setMod('hidden', false);

// Напрямую через методы
progress.setAnimate(true);
progress.setHidden(false);

// Получить текущее состояние
progress.getState();
// → { value: 75, animate: true, hidden: false }
```

## Как запустить локально

Открыть `index.html` в браузере
