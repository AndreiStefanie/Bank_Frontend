/**
 * Created by Stefa on 30-Mar-16.
 */

'use strict';

angular.module('bankApp.homepage', [])
    .controller('HomepageCtrl', function ($scope, $q, $location)
    {
        $scope.go = function ( path )
        {
            $location.path( path );
        };
    });