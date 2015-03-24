app.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/vacation',{
            templateUrl: "../templates/new_vacation.html",
            animation: 'first'
        })

        .when('/profile',{
            templateUrl: "../templates/edit_profile.html",
            animation: 'first'
        })
        .otherwise({
            templateUrl: "../templates/history.html",
            animation: 'first'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('UserMainController', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog) {
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });
    $scope.title = 'Профиль';

    $scope.redirect = function(path) {
        document.location.href = '/'+path;
    };


}]);