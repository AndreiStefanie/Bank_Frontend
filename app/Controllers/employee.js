/**
 * Created by Stefa on 30-Mar-16.
 */

'use strict';

angular.module('bankApp.employee', [])
    .controller('EmployeeCtrl', function ($scope, $q, bankFactory, $rootScope, $location, AuthenticationService)
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
            if(validCNP($scope.selectedClient.cnp)) {
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
                        function () {
                            alert("Duplicate CNP: " + status);
                        });
            } else {
                alert("Invalid CNP: " + status);
            }
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
                        $scope.clearAccount();
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
            if($scope.transferAmount > $scope.selectedAccount.balance) {
                alert("Not enough funds");
            }
            else if($scope.transferAmount < 1){
                alert("Amount cannot be negative");
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
        };

        /**
         * Validate CNP ( valid for 1800-2099 )
         *
         * @return boolean
         * @param p_cnp
         */
        function validCNP( p_cnp ) {
            var i, year, hashResult = 0, cnp = [], hashTable = [2,7,9,1,4,6,3,5,8,2,7,9];

            if( p_cnp.length !== 13 ) {
                return false;
            }

            for( i=0 ; i<13 ; i++ ) {
                cnp[i] = parseInt( p_cnp.charAt(i) , 10 );
                if( isNaN( cnp[i] ) ) {
                    return false;
                }
                if( i < 12 ) {
                    hashResult = hashResult + ( cnp[i] * hashTable[i] );
                }
            }
            hashResult = hashResult % 11;
            if( hashResult === 10 ) {
                hashResult = 1;
            }
            year = (cnp[1]*10) + cnp[2];
            switch( cnp[0] ) {
                case 1  : case 2 : { year += 1900; } break;
                case 3  : case 4 : { year += 1800; } break;
                case 5  : case 6 : { year += 2000; } break;
                case 7  : case 8 : case 9 : { year += 2000; if( year > ( parseInt( new Date().getYear() , 10 ) - 14 ) ) { year -= 100; } } break;
                default : { return false; }
            }

            if( year < 1800 || year > 2099 ) {
                return false;
            }
            return ( cnp[12] === hashResult );
        }

        $scope.logout = function () {
            $location.path('/');
            AuthenticationService.ClearCredentials();
        }
    });