# Перед запуском

Создать в корневой папке файл `.env` с содержимым

```ini
HOST=localhost
PORT=3000
```

# Запуск dev версии

```sh
$ npm start
```

# Запуск production версии

TODO: переделать package.json и актуализировать документацию.

В проде нельзя использовать бабель в риалтайме, потому что это очень дорого. Поэтому сначала нужно скомпилировать в старый синтаксис.

```sh
$ rm -rf build
$ cp -r frontend build
$ rm -rf build/node_modules
$ NODE_ENV=production frontend/node_modules/.bin/babel frontend -d build --ignore frontend/node_modules
$ cd build
$ NODE_ENV=production node_modules/.bin/webpack
```

# Namespaces

Чтобы избежать бесконечных ../../../component, В коде используются пути относительно корневой папки проекта.

# Структура проекта

- app — папка приложения
  - config — конфигурационные файлы
  - modules — модули приложения
  - styles — базовые стили
  - utils — утилиты
  - views — html шаблоны
- bootstrap — входные скрипты приложений (для сервера, клиента, консоли)
- static — статика: картинки, шрифты и так далее
- framework — код фрэймворка

# Стили

Каждый блок с шириной 100% (например: header, content, footer) должен иметь внутренний блок со стилями

```scss
&__wrapper {
    @include wrapper;
}
```
# TODO

1. Написать webpack-svg-spritesmith.
2. Решить проблему с отображением ошибок 404, 500 и так далее.
3. Добавить адаптивную сетку.
4. Написать тесты.
5. API.
6. Поле зависимостей для модулей.
7. Стайлгайды.
8. Усовершенствовать интерфейс для CLI (https://github.com/mattallty/Caporal.js).
9. Автоматический импорт переводов.
