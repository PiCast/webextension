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
        .controller('SettingsCtrl', ['$scope', '$rootScope', 'Settings', '$location', function ($scope, $rootScope, Settings, $location) {
            $scope.settings = {
                server_ip: ''
            };
            $scope.errors = [];

            API.runtime.sendMessage(API.runtime.id, {'method': 'getRuntimeSettings'}).then(function (settings) {
                $scope.errors = [];
                if (settings) {
                    $scope.settings = angular.copy(settings);
                }

                $scope.get_vaults = function () {
                    if (!$scope.settings.hasOwnProperty('nextcloud_host') || !$scope.settings.hasOwnProperty('nextcloud_password') || !$scope.settings.hasOwnProperty('nextcloud_username')) {
                        return;
                    }
                    PAPI.username = $scope.settings.nextcloud_username;
                    PAPI.password = $scope.settings.nextcloud_password;
                    PAPI.host = $scope.settings.nextcloud_host;
                    $scope.extension = API.runtime.getManifest().name + ' extension ' + API.runtime.getManifest().version;
                    PAPI.getVaults(function (vaults) {
                        $scope.errors = [];
                        var save_btn = jQuery('#save'),
                            login_required = jQuery('.login-req');
                        if (vaults.hasOwnProperty('error')) {
                            console.log(vaults);
                            var errors = 'Invalid response from server: [' + vaults.result.status + '] ' + vaults.result.statusText;
                            $scope.errors.push(errors);
                            login_required.hide();
                            save_btn.hide();
                            $scope.$apply();
                            return;

                        }
                        login_required.show();
                        save_btn.show();
                        $scope.vaults = vaults;
                        $scope.$apply();

                    });
                };

                $scope.$watch('[settings.nextcloud_host, settings.nextcloud_username, settings.nextcloud_password]', function () {
                    if ($scope.settings.nextcloud_host && $scope.settings.nextcloud_username && $scope.settings.nextcloud_password) {
                        $scope.get_vaults();
                    }
                }, true);

                if ($scope.settings.nextcloud_host && $scope.settings.nextcloud_username && $scope.settings.nextcloud_password) {
                    $scope.get_vaults();
                }
                $scope.$apply();
            });

            $scope.saving = false;
            $scope.saveSettings = function () {
                $scope.errors = [];
                var settings = angular.copy($scope.settings);
                try {
                    /** global: PAPI */
                    PAPI.decryptString(settings.default_vault.challenge_password, settings.vault_password);
                } catch (e) {
                    $scope.errors.push('Invalid vault key!');
                    return;
                }

                $scope.saving = true;
                API.runtime.sendMessage(API.runtime.id, {method: "saveSettings", args: settings}).then(function () {
                    setTimeout(function () {
                        window.location = '#!/';
                        $scope.saving = false;
                    }, 750);
                });
            };


            $scope.cancel = function () {
                window.location = '#!/';
            };
        }]);
}());

