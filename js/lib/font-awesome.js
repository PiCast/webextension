/**
 * PiCast
 *
 * @copyright Copyright (c) 2016, Sander Brand (brantje@gmail.com)
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
function insertFontCSS() {
    var fontPath = API.extension.getURL('');
    var fontCss = ["@font-face {",
        "font-family: 'FontAwesome';",
        "src: url('" + fontPath + "fonts/fontawesome-webfont.eot?v=4.7.0');",
        "src: url('" + fontPath + "fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('" + fontPath + "fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('" + fontPath + "fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('" + fontPath + "fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('" + fontPath + "fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');",
        "font-weight: normal;",
        "font-style: normal;",
        "}"];
    if (window.navigator.userAgent.indexOf('Firefox') !== -1) {
        fontCss[2] = "src: url('" + fontPath + "fonts/fontawesome-webfont.eot?v=4.7.0');";
        fontCss[3] = "src: url('" + fontPath + "fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('" + fontPath + "fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('" + fontPath + "fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('" + fontPath + "fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('" + fontPath + "fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');";
    }
    var css = fontCss.join('');
    var style = document.createElement('style'),
        head = document.head || document.getElementsByTagName('head')[0];

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}
insertFontCSS();