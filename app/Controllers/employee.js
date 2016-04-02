/**
 * Created by Stefa on 30-Mar-16.
 */

'use strict';

angular.module('bankApp.employee', [])
    .controller('EmployeeCtrl', function ($scope, $q, bankFactory)
    {
        $scope.clients = [];

        bankFactory.getAllClients(2)
            .then(
                function (response) {
                    $scope.clients = response.data;
                },
                function(errResponse, status){
                    alert("Error while retrieving clients: " + status);
                    return $q.reject(errResponse);
                }
            );
    });