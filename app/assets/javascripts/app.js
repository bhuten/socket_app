var socketApp = angular.module('socketApp', ['ngRoute']);

socketApp.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/index.html',
            controller: 'mainCtrl'
        });
    });

socketApp.controller('mainCtrl', function($scope, $http, $log){
    $scope.title = "Employee List";
    $scope.employees = [];
    $http.get('public/employees').then(function(response){
        $log.log(response.data);
        $scope.employees = response.data;
    }, function(){
        $log.log(response);
    });
});