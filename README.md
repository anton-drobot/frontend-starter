# Перед запуском

Создать в корневой папке файл `.env` с содержимым

```ini
HOST=localhost
PORT=3000
BACKEND_URL=https://jsonplaceholder.typicode.com/
```

# Запуск dev версии

```sh
$ npm start
```

# Запуск production версии

В проде нельзя использовать бабель в риалтайме, потому что это очень дорого. Поэтому сначала нужно скомпилировать в старый синтаксис.

Скопируем папку:
```sh
$ rm -rf production
$ cp -r dev production
```

После этого можно установить зависомисти. Затем:
```sh
$ NODE_PATH=. NODE_ENV=production dev/node_modules/.bin/babel dev -d production --ignore dev/node_modules,dev/static
$ cd production
$ NODE_PATH=. NODE_ENV=production node_modules/.bin/webpack
```

Не забыть правильно включить сервер через pm2

```sh
$ NODE_PATH=. NODE_ENV=production pm2 start server.js --name [NAME]
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
