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
        .when('/settings',{
            templateUrl: "../templates/settings.html",
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

app.controller('UserMainController', ['$scope', '$rootScope', 'ngDialog', 'UserService', function($scope, $rootScope, ngDialog, UserService) {
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.title = 'Профиль';
    $scope.username = '';

    function updateData() {
        UserService.getCurrentUser()
            .success(function (user, status) {
                $scope.user = user;
                $scope.username = user.common.profile.username || user.common.profile.email;
            })
            .error(function (err, status) {
                throw new Error(err);
            });
    }


    updateData();

    $scope.$on('updateUser', function(event, data){
        updateData();
    });

    $scope.redirect = function(path) {
        document.location.href = '/'+path;
    };


}]);