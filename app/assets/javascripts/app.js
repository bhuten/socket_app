var socketApp = angular.module('socketApp', ['ngRoute','btford.socket-io']);

// This module requires a socket.io client lib which is loaded before the load using CDN
socketApp.factory('mySocket', function (socketFactory) {

    // address of the node server
    var myIoSocket = io.connect('localhost:8100');

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });
    return mySocket;
});

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

socketApp.controller('employeeCtrl', function($scope, $http, $log, mySocket){ // socketio object passed here
    var employeeData = [];
    mySocket.on('user:created:update', function(data) {
        console.log('update', data);

        // push into the data and update the table
        employeeData.push(data);
        $scope.employees = employeeData;
    });

    $scope.title = "Employees";
    $scope.employees = employeeData;

    $http.get('/employees.json').then(function(response){

        employeeData = response.data;
        $scope.employees = employeeData;

    }, function(){
        $log.log(response);
    });
});
socketApp.controller('newEmployeeCtrl', function($scope, $http, $log, mySocket){
    $scope.name = null;
    $scope.age = null;
    $scope.createNewEmployee = function(name, age) {
        newEmployee = {
            name: $scope.name,
            age: $scope.age
        };
        $http({
            url: '/employees.json',
            method: 'POST',
            data: newEmployee
        }).then(function(response){
            // success
            if(response.status == 201){
                // emit to socket
                mySocket.emit('user:created', newEmployee);
            }
            $log.info(response.data);
        }, function(response){
            // error
            $log.error(response);
        });
    }
});