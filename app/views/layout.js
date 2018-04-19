import { URL_PROVIDER } from 'framework/Providers/types';

const URL = global.Container.make(URL_PROVIDER);

/**
 * Page layout.
 *
 * @param {Object} context
 * @param {String} markup
 * @param {Object} helmet
 * @param {StoreCollection} StoreCollection
 *
 * @return {String}
 */
export default function layout(context, markup, helmet, StoreCollection) {
    return `<!DOCTYPE html>
        <html ${helmet.htmlAttributes.toString()}>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                <link rel="stylesheet" href="${(new URL).makeApp('/assets/css/app.css')}">
                ${helmet.link.toString()}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
                <div id="app">${markup}</div>
                <script nonce="${context.res.nonce}">
                    window.__INITIAL_STATE__ = ${JSON.stringify(StoreCollection.serialize()).replace(/</g, '\\u003c')};
                </script>
                <script nonce="${context.res.nonce}">
                    // loadJS
                    loadjs=function(){function e(e,n){var t,r,i,c=[],o=(e=e.push?e:[e]).length,f=o;for(t=function(e,t){t.length&&c.push(e),--f||n(c)};o--;)r=e[o],(i=s[r])?t(r,i):(u[r]=u[r]||[]).push(t)}function n(e,n){if(e){var t=u[e];if(s[e]=n,t)for(;t.length;)t[0](e,n),t.splice(0,1)}}function t(e,n,r,i){var o,s,u=document,f=r.async,a=(r.numRetries||0)+1,h=r.before||c;i=i||0,/(^css!|\\.css$)/.test(e)?(o=!0,(s=u.createElement("link")).rel="stylesheet",s.href=e.replace(/^css!/,"")):((s=u.createElement("script")).src=e,s.async=void 0===f||f),s.onload=s.onerror=s.onbeforeload=function(c){var u=c.type[0];if(o&&"hideFocus"in s)try{s.sheet.cssText.length||(u="e")}catch(e){u="e"}if("e"==u&&(i+=1)<a)return t(e,n,r,i);n(e,u,c.defaultPrevented)},!1!==h(e,s)&&u.head.appendChild(s)}function r(e,n,r){var i,c,o=(e=e.push?e:[e]).length,s=o,u=[];for(i=function(e,t,r){if("e"==t&&u.push(e),"b"==t){if(!r)return;u.push(e)}--o||n(u)},c=0;c<s;c++)t(e[c],i,r)}function i(e,t,i){var s,u;if(t&&t.trim&&(s=t),u=(s?i:t)||{},s){if(s in o)throw"LoadJS";o[s]=!0}r(e,function(e){e.length?(u.error||c)(e):(u.success||c)(),n(s,e)},u)}var c=function(){},o={},s={},u={};return i.ready=function(n,t){return e(n,function(e){e.length?(t.error||c)(e):(t.success||c)()}),i},i.done=function(e){n(e,[])},i.reset=function(){o={},s={},u={}},i.isDefined=function(e){return e in o},i}();
                    
                    document.addEventListener('DOMContentLoaded', function () {
                        loadjs(['${(new URL).makeApp('/assets/js/manifest.js')}', '${(new URL).makeApp('/assets/js/vendor.chunk.js')}', '${(new URL).makeApp('/assets/js/app.chunk.js')}'], {
                            success: function() {
                                window.timeCorrection = ${Date.now()} - Date.now();
                            },
                            async: false
                        });
                    }, true);
                </script>
            </body>
        </html>`;
}
