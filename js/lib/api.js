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
window.PiCast = (function () {
    var _API = {
        server_ip: '',
        getStatus: function (callback) {
            api_request('/status', 'GET', null, callback);
        },
        getPlaylist: function (callback) {
            api_request('/playlist', 'GET', null, callback);

        },
        castNow: function (url, callback) {
            var url_encoded_url = encodeURIComponent(url);
            api_request('/stream?url=' + url_encoded_url, 'GET', null, callback);

        },
        addToQueue: function (url, callback) {
            var url_encoded_url = encodeURIComponent(url);
            api_request('/queue?url=' + url_encoded_url, 'GET', null, callback);
        },
        updatePlaylist: function (playlist, callback) {
            api_request('/playlist', 'POST', playlist, callback);
        },
        scheduleShutdown: function (seconds, callback) {
            api_request('/shutdown?time=' + seconds, 'GET', null, callback);
        },
        doAction: function (action, callback) {
            var endpoint;
            switch (action) {
                case 'pause':
                    endpoint = '/video?control=pause';
                    break;
                case 'stop':
                    endpoint = '/video?control=stop';
                    break;

                case 'backward':
                    endpoint = '/video?control=left';
                    break;

                case 'forward':
                    endpoint = '/video?control=right';
                    break;

                case 'nextqueue':
                    endpoint = '/video?control=next';
                    break;

                case 'vol_down':
                    endpoint = '/sound?vol=less';
                    break;

                case 'vol_up':
                    endpoint = '/sound?vol=more';
                    break;
            }
            api_request(endpoint, 'GET', null, callback);
        }

    };

    var api_request = function (endpoint, method, data, callback) {
        var headers = new Headers();
        headers.append("Accept", " application/json, text/plain, */*");
        var opts = {
            method: method,
            headers: headers

        };

        if (method.toLowerCase() !== 'get') {
            headers.append('content-type', 'application/json;charset=UTF-8');
            opts.body = JSON.stringify(data);
        }

        var request = new Request('http://' + _API.server_ip + ':2020' + endpoint, opts);

        fetch(request).then(function (response) {
            if (response.status !== 200) {
                API.notifications.create('PiCast', 'Error during requesting from server ! Make sure the ip/port are corrects, and the PiCast is running.');
                callback({error: true, result: {statusText: response.statusText, status: response.status}});
                return;
            }
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (json) {
                    if (callback) {
                        callback(json);
                    }
                });
            } else {
                response.text().then(function (text) {
                    if (text === "1") {
                        if (endpoint.indexOf('stream') >= 0) {
                            setTimeout(function () {
                                API.notifications.create('PiCast', 'Video should now start playing.');
                            }, 1000);
                        }

                    } else if (text === "2") {
                        if (endpoint.indexOf('queue') >= 0) {
                            API.notifications.create('PiCast', 'Video has been added to queue.');
                        }
                    }
                    if (callback) {
                        callback(response.statusText);
                    }
                });
            }

        }).catch(function (e) {
            if (callback) {
                callback({error: true, result: {statusText: e, status: 0}});
            }
        });
    };

    return _API;
}());