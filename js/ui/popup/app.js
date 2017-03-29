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
     * @ngdoc overview
     * @name PiCastExtension
     * @description
     * # PiCastExtension
     *
     * Main module of the application.
     */
    angular
        .module('PiCastExtension', [
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'angular-steps'
        ])
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/settings', {
                    templateUrl: 'views/settings.html',
                    controller: 'SettingsCtrl'
                })
                .when('/setup', {
                    templateUrl: 'views/setup.html',
                    controller: 'SetupCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
            $locationProvider.hashPrefix('!');
        }).config(function ($httpProvider) {
        $httpProvider.useApplyAsync(true);
    }).config( [
        '$compileProvider',
        function( $compileProvider )
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
        }
    ]);

}());
