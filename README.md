# semantic-release-config

Дефолтный конфиг semantic-release для проектов Sitko.ru

## Использование

Создать в корне репозитория файл `release.config.js` с содержимым:

```js
module.exports = {
    "extends": "@sitkoru/semantic-release-config"
};

```

Можно расширять:

```js
module.exports = {
    "extends": "@sitkoru/semantic-release-config",
    tagFormat: "${version}"
};
```

## GitHub Actions

Создаём два workflow.

### release.yml

```yml
name: Build

on:
    push:
        branches:
            - "*"
        tags:
            - "!*"
    pull_request:

jobs:
    build:
        // сборка, тесты
    release:
        name: Release
        runs-on: self-hosted
        container: ghcr.io/sitkoru/actions-container
        needs: [ build ]
        if: ${{ github.event_name == 'push' }}
        steps:
          - name: Checkout
            uses: actions/checkout@v2
            with:
              fetch-depth: 0
              persist-credentials: false
          - name: Semantic Release
            uses: sitkoru/semantic-release-action@v1
            env:
              GH_TOKEN: ${{ secrets.BOT_TOKEN }}
              GIT_AUTHOR_NAME: ${{ secrets.BOT_NAME }}
              GIT_AUTHOR_EMAIL: ${{ secrets.BOT_EMAIL }}
              GIT_COMMITTER_NAME: ${{ secrets.BOT_NAME }}
              GIT_COMMITTER_EMAIL: ${{ secrets.BOT_EMAIL }}

```

### deploy.yml

```yml
name: "Deploy"
on:
    release:
        types:
            - released

jobs:
    deployment:
        // настройки задачи
        steps:
            -   uses: actions/checkout@v2.3.4
            -   name: Prepare
                id: prep
                shell: bash
                run: |
                    VERSION=${GITHUB_REF#refs/tags/}
                    // ещё какие-то переменный окружения вроде тегов для образа можно заполнить тут
                    echo ::set-output name=version::${VERSION}
           // дальнейшие шаги по деплою. Версия доступна в переменной ${{ steps.prep.outputs.version }}
```
