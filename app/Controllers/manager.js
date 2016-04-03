/**
 * Created by Stefa on 30-Mar-16.
 */

angular.module('bankApp.manager', [])
    .controller('ManagerCtrl', function ($scope, $q, bankFactory)
    {
        $scope.employees = [];
        $scope.selectedEmployee = {};
        $scope.inputType = "password";
        $scope.logEmployee = [];
        $scope.since = "";
        $scope.till = "";
        $scope.sinceYear = "";
        $scope.sinceMonth = "";
        $scope.sinceDay = "";
        $scope.tillYear = "";
        $scope.tillMonth = "";
        $scope.tillDay = "";
        $scope.options = { 'height' : '500'};
        var config = {headers: {'Content-Type': 'application/json'}};
        
        $scope.getEmployees = function () {
            bankFactory.getEmployees()
                .then(
                    function (response) {
                        $scope.employees = response.data;
                    },
                    function(errResponse, status){
                        alert("Error while retrieving employees: " + status);
                        return $q.reject(errResponse);
                    }
                )
        };

        $scope.getEmployees();

        $scope.showEmployee = function (employee) {
            $scope.selectedEmployee = employee;
        };

        $scope.clearForm = function () {
            $scope.selectedEmployee = {};
            $scope.logEmployee = [];
        };

        $scope.convertToDate = function (timestamp) {
            return moment(timestamp).format("DD-MM-YYYY");
        };

        $scope.getLog = function () {
            $scope.since = $scope.sinceYear + "-" + $scope.sinceMonth + "-" + $scope.sinceDay;
            $scope.till = $scope.tillYear + "-" + $scope.tillMonth + "-" + $scope.tillDay;
            bankFactory.getLogOfEmployee($scope.selectedEmployee.idemployee, $scope.since, $scope.till)
                .then(
                    function (response) {
                        $scope.logEmployee = response.data;
                    }
                )
        };

        $scope.insertEmployee = function () {
            var employee = {};
            employee['name'] = $scope.selectedEmployee.name;
            employee['username'] = $scope.selectedEmployee.username;
            employee['password'] = $scope.selectedEmployee.password;

            bankFactory.createEmployee(employee, config)
                .then(
                    function () {
                        $scope.getEmployees();
                        $scope.clearForm();
                    },
                    function ()
                    {
                        alert("Duplicate username: " + status);
                    });
        };

        $scope.updateEmployee = function () {
            var employee = {};
            employee['name'] = $scope.selectedEmployee.name;
            employee['username'] = $scope.selectedEmployee.username;
            employee['password'] = $scope.selectedEmployee.password;

            bankFactory.updateEmployee(employee, config)
                .then(
                    function () {
                        $scope.getEmployees();
                        $scope.clearForm();
                    },
                    function ()
                    {
                        alert("Duplicate username: " + status);
                    });
        };

        $scope.deleteEmployee = function () {
            bankFactory.deleteEmployee($scope.selectedEmployee.idemployee)
                .then(
                    function () {
                        $scope.getEmployees();
                        $scope.clearForm();
                    }
                )
        };

        $scope.hideShowPassword = function(){
            if ($scope.inputType == 'password')
                $scope.inputType = 'text';
            else
                $scope.inputType = 'password';
        };
    });