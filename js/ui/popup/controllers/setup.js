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
        .controller('SetupCtrl', ['$scope', '$timeout', '$location', '$rootScope', 'StepsService', function ($scope, $timeout, $location, $rootScope, StepsService) {
            $scope.settings = {
                host: '',
            };


            $scope.gogo = function (to) {
                StepsService.steps().goTo(to);
            };

            $scope.check = {
                server: function (callback) {
                    //@TODO add check if server is reachable
                    callback(true);
                }
            };
            $scope.saving = false;
            $scope.next = function () {
                $scope.saving = true;
                $scope.errors = [];
                $timeout(function () {
                    var step = StepsService.getCurrent().name;
                    var check = $scope.check[step];
                    if (typeof check === "function") {
                        check(function (result) {
                            $scope.saving = false;
                            if (result) {
                                $scope.errors = [];
                                $scope.$apply();
                                StepsService.steps().next();
                            }
                            $timeout(function () {
                                $scope.errors = [];
                                $scope.$apply();
                            }, 5000);
                        });
                    }
                    else {
                        $scope.saving = false;
                        StepsService.steps().next();
                    }
                }, 10);
            };

            $scope.finished = function () {
                var settings = angular.copy($scope.settings);

                $scope.saving = true;
                API.runtime.sendMessage(API.runtime.id, {
                    method: "saveSettings",
                    args: settings
                }).then(function () {
                    setTimeout(function () {
                        window.location = '#!/';
                        $scope.saving = false;
                    }, 1500);
                });
            };
        }]);
}());

