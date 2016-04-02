/**
 * Created by Stefa on 30-Mar-16.
 */

'use strict';

angular.module('bankApp.employee', [])
    .controller('EmployeeCtrl', function ($scope, $q, bankFactory, $rootScope)
    {
        $scope.clients = [];
        $scope.selectedClient = {};
        $scope.accounts = [];
        $scope.selectedAccount = {};

        bankFactory.getAllClients($rootScope.globals.currentUser.userID)
            .then(
                function (response) {
                    $scope.clients = response.data;
                },
                function(errResponse, status){
                    alert("Error while retrieving clients: " + status);
                    return $q.reject(errResponse);
                }
            );
        
        $scope.showClient = function (client) {
            $scope.selectedClient = client;
        };
        
        $scope.clearForm = function () {
            $scope.selectedClient = {};
            $scope.accounts = [];
        };
        
        $scope.getAccounts = function (cnp) {
            bankFactory.getAccounts(cnp)
                .then(
                    function (response) {
                        $scope.accounts = response.data;
                    },
                    function(errResponse, status){
                        alert("Error while retrieving client accounts: " + status);
                        return $q.reject(errResponse);
                    }
                );
        };

        $scope.convertToDate = function (timestamp) {
            return moment(timestamp).format("DD-MM-YYYY");
        };
        
        $scope.showAccount = function (account) {
            $scope.selectedAccount = account;
            $scope.selectedAccount.formatedDate = moment($scope.selectedAccount.creationDate).format("DD-MM-YYYY");
        };

        $scope.clearAccount = function () {
            $scope.selectedAccount = {};
        };
    });