var socketApp = angular.module('socketApp', ['ngRoute']);

socketApp.config([
    "$httpProvider", function($httpProvider) {
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    }
]);

socketApp.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/index.html',
            controller: 'employeeCtrl'
        })
        .when('/new_employee', {
            templateUrl: '/templates/new_employee.html',
            controller: 'newEmployeeCtrl'
        });
    });

socketApp.controller('employeeCtrl', function($scope, $http, $log){ // socketio object passed here
    $scope.title = "Employees";
    $scope.employees = [];

    $http.get('/employees.json').then(function(response){
        $scope.employees = response.data;
    }, function(){
        $log.log(response);
    });
});
socketApp.controller('newEmployeeCtrl', function($scope, $http, $log){
    $scope.name = null;
    $scope.age = null;
    $scope.createNewEmployee = function(name, age) {
        $http({
            url: '/employees.json',
            method: 'POST',
            data: {
                name: $scope.name,
                age: $scope.age
            }
        }).then(function(response){
            $log.log(response.data);
        }, function(response){
            $log.log(response);
        });
    }
});