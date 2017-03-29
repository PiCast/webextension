/* global API */

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

window.contextMenu = (function () {
    'use strict';
    function initMenus() {
        API.contextMenus.create({
            id: 'play:',
            title: 'Play',
            contexts: ['link'],
            onclick: itemClickCallback
        });

        API.contextMenus.create({
            id: 'queue:',
            title: 'Add to queue',
            contexts: ['link'],
            onclick: itemClickCallback
        });
    }

    function createMenuItem(parentId, id, label, clickcb) {
        API.contextMenus.create({
            id: id,
            title: label,
            contexts: ["link"],
            parentId: parentId,
            onclick: clickcb
        });
    }

    function itemClickCallback(menu_action, login) {
        var action = menu_action.menuItemId.split(':', 1)[0];
        var url_encoded_url = menu_action.linkUrl;
        if(action === 'play'){
            background.castNow(url_encoded_url);
        } else {
            background.addToQueue(url_encoded_url);
        }
    }


    API.contextMenus.removeAll();
    initMenus();
}());