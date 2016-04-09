'use strict';

angular.module('bankApp', [
        'ngRoute',
        'ngCookies',
        'bankApp.homepage',
        'bankApp.employee',
        'bankApp.manager',
        'bankApp.login'
    ])
    .config(['$routeProvider', function($routeProvider)
    {
        $routeProvider
            .when('/', {
                templateUrl: 'Views/homepage.html',
                controller: 'HomepageCtrl'
            })
            .when('/manager', {
                templateUrl: 'Views/manager.html',
                controller: 'ManagerCtrl'
            })
            .when('/employee', {
                templateUrl: 'Views/employee.html',
                controller: 'EmployeeCtrl'
            })
            .when('/loginManager', {
                templateUrl: 'Views/login.html',
                controller: 'LoginAdminCtrl'
            })
            .when('/loginEmployee', {
                templateUrl: 'Views/login.html',
                controller: 'LoginEmployeeCtrl'
            })
            .otherwise({redirectTo: '/'});
    }])
    .run(['$rootScope', '$location', '$cookieStore', '$http', function($rootScope, $location, $cookieStore, $http)
    {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser)
        {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current)
        {
            //redirect to homepage if not logged in and trying to access a restricted page

            var restrictedPage = $.inArray($location.path(), ['/loginManager', '/loginEmployee', '/']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if(restrictedPage && !loggedIn)
            {
                $location.path('/');
            }
            //redirect to homepage if employee tries to access manager page
            if(loggedIn && $rootScope.globals.currentUser.userType === "employee" && $location.path() === '/manager')
            {
                $location.path('/');
            }
            //skip login page if already logged in
            if(loggedIn && $rootScope.globals.currentUser.userType === "employee" && $location.path() === '/loginEmployee')
            {
                $location.path('/employee')
            }
            if(loggedIn && $rootScope.globals.currentUser.userType === "admin" && $location.path() === '/loginManager')
            {
                $location.path('/manager')
            }
        });
    }])
    .factory('bankFactory', function ($http)
    {
        var factory = {};

        factory.getAllClients = function (employeeID)
        {
            return $http.get("http://localhost:8080/api/client/all?employeeID=" + employeeID);
        };
        
        factory.getAccounts = function (cnp) {
            return $http.get("http://localhost:8080/api/account/client?cnp=" + cnp);
        };

        factory.createClient = function (client, employeeID, config) {
            return $http.post("http://localhost:8080/api/client/new?employeeID=" + employeeID, client, config);
        };

        factory.updateClient = function (client, employeeID, config) {
            return $http.put("http://localhost:8080/api/client/update?employeeID=" + employeeID, client, config);
        };

        factory.deleteClient = function (cnp, employeeID) {
            return $http.delete("http://localhost:8080/api/client/remove?cnp=" + cnp + "&employeeID=" + employeeID);
        };

        factory.createAccount = function (account, employeeID, config) {
            return $http.post("http://localhost:8080/api/account/new?employeeID=" + employeeID, account, config);
        };

        factory.updateAccount = function (account, employeeID, config) {
            return $http.put("http://localhost:8080/api/account/update?employeeID=" + employeeID, account, config);
        };

        factory.depositAccount = function (account, employeeID, config) {
            return $http.put("http://localhost:8080/api/account/deposit?employeeID=" + employeeID, account, config);
        };

        factory.deleteAccount = function (accountID, employeeID) {
            return $http.delete("http://localhost:8080/api/account/remove?accountID=" + accountID + "&employeeID=" + employeeID);
        };

        factory.getEmployees = function ()
        {
            return $http.get("http://localhost:8080/api/employee/all");
        };

        factory.getLogOfEmployee = function (employeeID, since, till)
        {
            return $http.get("http://localhost:8080/api/log?employeeID=" + employeeID + "&since=" + since + "&till=" + till);
        };

        factory.createEmployee = function (employee, config) {
            return $http.post("http://localhost:8080/api/employee/new", employee, config);
        };

        factory.updateEmployee = function (employee, config) {
            return $http.put("http://localhost:8080/api/employee/update", employee, config);
        };

        factory.deleteEmployee = function (employeeID) {
            return $http.delete("http://localhost:8080/api/employee/remove?employeeID=" + employeeID);
        };

        return factory;
    });
