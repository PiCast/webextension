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
var background = (function () {
    var storage = new API.Storage();
    var _self = this;
    var _window = {};
    var settings = {};

    function getSettings() {
        storage.get('settings').then(function (_settings) {
            if (!_settings || !_settings.hasOwnProperty('server_ip')) {
                return;
            }
            _self.settings = _settings;
            PiCast.server_ip = _settings.server_ip;
        });
    }

    _self.getSettings = getSettings;

    function getRuntimeSettings() {
        return _self.settings;
    }

    _self.getRuntimeSettings = getRuntimeSettings;

    function saveSettings(settings, cb) {
        PiCast.server_ip = settings.server_ip;
        //window.settings contains the run-time settings
        _self.settings = settings;


        storage.set('settings', settings).then(function () {
            getSettings();
        });

    }

    _self.saveSettings = saveSettings;

    function doAction(action){
        PiCast.doAction(action);
    }
    _self.doAction = doAction;


    function addToQueue(url){
        API.notifications.create('PiCast', 'Trying to add video to queue');
        PiCast.addToQueue(url);
    }
    _self.addToQueue = addToQueue;
    _window.addToQueue = addToQueue;


    function castNow(url){
        API.notifications.create('PiCast', 'Trying to get video stream URL. Please wait ~ 10-20 seconds.');
        PiCast.castNow(url);
    }
    _self.castNow = castNow;
    _window.castNow = castNow;

    //window.contextMenu.setContextItems(logins);

    API.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        //console.log('Method call', msg.method);

        if (!msg || !msg.hasOwnProperty('method')) {
            return;
        }

        var result = _self[msg.method](msg.args, sender);

        sendResponse(result);
    });
    getSettings();
    return _window;
}());

