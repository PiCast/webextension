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

(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name PiCastExtension.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the PiCastExtension
     */
    angular.module('PiCastExtension')
        .controller('MainCtrl', ['$scope', 'Settings', '$location', '$rootScope', function ($scope, Settings, $window, $rootScope) {
            $scope.app = 'passman';
            var port = API.runtime.connect(null, {
                name: "PiCastComm"
            });
            var pauseCB = function () {
                console.log('paused!');
            };
            $scope.doAction = function (action) {
                API.runtime.sendMessage(API.runtime.id, {
                    'method': 'doAction',
                    'args': action
                }).then(function (settings) {

                });
            };

            API.runtime.sendMessage(API.runtime.id, {'method': 'getRuntimeSettings'}).then(function (settings) {
                console.log(settings);
                $rootScope.app_settings = settings;
                if (!settings || Object.keys(settings).length === 0) {
                    window.location = '#!/setup';
                }
            });


            $scope.goto_settings = function () {
                window.location = '#!/settings';
            };


        }]);
}());

