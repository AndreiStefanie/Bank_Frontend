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
        $scope.targetAccount = {};
        $scope.transferAmount = "";
        var employeeID = $rootScope.globals.currentUser.userID;
        var config = {headers: {'Content-Type': 'application/json'}};

        $scope.getClients = function () {
            bankFactory.getAllClients(employeeID)
                .then(
                    function (response) {
                        $scope.clients = response.data;
                    },
                    function(errResponse, status){
                        alert("Error while retrieving clients: " + status);
                        return $q.reject(errResponse);
                    }
                );
        };

        $scope.getClients();
        
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

        $scope.insertClient = function () {
            var client = {};
            client['name'] = $scope.selectedClient.name;
            client['cnp'] = $scope.selectedClient.cnp;
            client['address'] = $scope.selectedClient.address;

            bankFactory.createClient(client, employeeID, config)
                .then(
                    function () {
                        $scope.getClients();
                        $scope.selectedClient = {};
                    },
                    function ()
                    {
                        alert("Duplicate CNP: " + status);
                    });
        };

        $scope.updateClient = function () {
            var client = {};
            client['name'] = $scope.selectedClient.name;
            client['cnp'] = $scope.selectedClient.cnp;
            client['address'] = $scope.selectedClient.address;
            client['clientID'] = $scope.selectedClient.idclient;

            bankFactory.updateClient(client, employeeID, config)
                .then(
                    function () {
                        $scope.getClients();
                        $scope.selectedClient = {};
                    },
                    function ()
                    {
                        alert("Update failed: " + status);
                    });
        };

        $scope.deleteClient = function () {
            bankFactory.deleteClient($scope.selectedClient.cnp, employeeID)
                .then(
                    function () {
                        $scope.selectedClient = {};
                        $scope.getClients();
                    },
                    function () {
                        alert("Failed to remove");
                    }
                )
        };

        $scope.insertAccount = function () {
            var account = {};
            account['ownerID'] = $scope.selectedClient.idclient;
            account['type'] = $scope.selectedAccount.type;
            account['balance'] = 0;

            bankFactory.createAccount(account, employeeID, config)
                .then(
                    function () {
                        $scope.accounts.push(account);
                    },
                    function ()
                    {
                        alert("Operation Failed: " + status);
                    });
        };

        $scope.updateAccount = function () {
            var account = {};
            account['accountID'] = $scope.selectedAccount.idaccount;
            account['balance'] = $scope.selectedAccount.balance;

            bankFactory.updateAccount(account, employeeID, config)
                .then(
                    function () {},
                    function ()
                    {
                        alert("Operation Failed: " + status);
                    });
        };

        $scope.deleteAccount = function () {
            bankFactory.deleteAccount($scope.selectedAccount.idaccount, employeeID)
                .then(
                    function () {
                        $scope.selectedAccount = {};
                        alert("Account removed successfully");
                    },
                    function () {
                        alert("Failed to remove");
                    }
                )
        };

        $scope.transferMoney = function () {
            if($scope.transferAmount > $scope.selectedAccount.balance)
            {
                alert("Not enough funds");
            }
            else {
                var account = {};
                account['accountID'] = $scope.selectedAccount.idaccount;
                account['balance'] = -$scope.transferAmount;
                bankFactory.depositAccount(account, employeeID, config)
                    .then(
                        function () {
                            account['accountID'] = $scope.targetAccount;
                            account['balance'] = $scope.transferAmount;
                            bankFactory.depositAccount(account, employeeID, config)
                                .then(
                                    function () {
                                        $scope.getAccounts($scope.selectedClient.cnp);
                                    },
                                    function () {}
                                )
                        },
                        function () {
                            alert("transfer failed - internal error");
                        }
                    )
            }
        }
    });