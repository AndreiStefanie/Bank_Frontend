/**
 * Created by Stefa on 30-Mar-16.
 */

'use strict';

angular.module('bankApp.login', [])
    .controller('LoginAdminCtrl', function($scope, $location, AuthenticationService)
    {
        $scope.username = "";
        $scope.password = "";
        $scope.dataLoading = false;
        $scope.userType = "Manager";

        AuthenticationService.ClearCredentials();

        $scope.login = function ()
        {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, "admin", function (response)
            {
                if (response)
                {
                    AuthenticationService.SetCredentials($scope.username, $scope.password, "admin");
                    $location.path('/manager');
                } else {
                    $scope.dataLoading = false;
                }
            });
        }
    })
    .controller('LoginEmployeeCtrl', function($scope, $location, AuthenticationService, $rootScope)
    {
        $scope.username = "";
        $scope.password = "";
        $scope.dataLoading = false;
        $scope.userType = "Employee";

        if(!$rootScope.globals.currentUser){
            AuthenticationService.ClearCredentials();
        }

        $scope.login = function ()
        {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, "employee", function (response)
            {
                if (response)
                {
                    AuthenticationService.SetCredentials($scope.username, $scope.password, "employee", response);
                    $location.path('/employee');
                } else {
                    $scope.dataLoading = false;
                }
            });
        }
    });