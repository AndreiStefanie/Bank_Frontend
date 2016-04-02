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
        });
    }])
    .factory('bankFactory', function ($http)
    {
        var factory = {};

        factory.getAllClients = function (employeeID)
        {
            return $http.get("http://localhost:8080/api/client/all?employeeID=" + employeeID);
        };

        return factory;
    });
