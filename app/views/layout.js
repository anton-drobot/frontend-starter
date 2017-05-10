import { appUrl } from 'framework/utils/url';

/**
 * Page layout.
 *
 * @param {Object} context
 * @param {String} markup
 *
 * @return {String}
 */
export default function layout(context, markup) {
    return `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="${appUrl('/assets/css/app.css')}">
                <title>Hello React</title>
            </head>
            <body>
                <div id="app">${markup}</div>
                <script src="${appUrl('/assets/js/app.js')}" defer></script>
            </body>
        </html>`;
}
