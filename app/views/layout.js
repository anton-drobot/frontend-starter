import { URL_PROVIDER } from 'framework/Providers/types';

const URL = global.Container.make(URL_PROVIDER);

/**
 * Page layout.
 *
 * @param {Object} context
 * @param {String} markup
 * @param {Object} helmet
 * @param {Object[]} bundles
 * @param {StoreCollection} StoreCollection
 *
 * @return {String}
 */
export default function layout(context, markup, helmet, bundles, StoreCollection) {
    const styles = bundles.filter(({ file }) => file.endsWith('.css'));
    const scripts = bundles.filter(({ file }) => file.endsWith('.js'));

    return `<!DOCTYPE html>
        <html ${helmet.htmlAttributes.toString()}>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                <link rel="stylesheet" href="${(new URL).makeApp('/assets/css/app.chunk.css')}">
                <link rel="stylesheet" href="${(new URL).makeApp('/assets/css/common.chunk.css')}">
                ${styles.map(({ file }) => `<link rel="stylesheet" href="${(new URL).makeApp(`/assets/${file}`)}">`).join()}
                ${helmet.link.toString()}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
                <div id="app">${markup}</div>
                <script nonce="${context.res.nonce}">
                    window.__INITIAL_STATE__ = ${JSON.stringify(StoreCollection.serialize()).replace(/</g, '\\u003c')};
                    window.timeCorrection = ${Date.now()} - Date.now();
                </script>
                <script src="${(new URL).makeApp('/assets/js/manifest.js')}"></script>
                <script src="${(new URL).makeApp('/assets/js/vendor.chunk.js')}"></script>
                <script src="${(new URL).makeApp('/assets/js/common.chunk.js')}"></script>
                ${scripts.map(({ file }) => `<script src="${(new URL).makeApp(`/assets/${file}`)}"></script>`).join()}
                <script src="${(new URL).makeApp('/assets/js/app.chunk.js')}"></script>
            </body>
        </html>`;
}
