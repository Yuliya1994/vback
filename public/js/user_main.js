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
        .when('/edit',{
            templateUrl:"../templates/profile_edit.html",
            animation: 'first'
        })
        .when('/history', {
            templateUrl: "../templates/history.html",
            animation: 'first'
        })
        .otherwise({
            templateUrl: "../templates/welcome.html",
            animation: 'first'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('UserMainController', ['$scope', '$rootScope', 'ngDialog', 'UserService', 'CalendarService', function($scope, $rootScope, ngDialog, UserService, CalendarService) {
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
                $scope.photo = user.common.profile.photo;
            })
            .error(function (err, status) {
                throw new Error(err);
            });
    }


    updateData();

    $scope.$on('updateUser', function(event, data){
        updateData();
    });

    $scope.$on('getHistory', function(event, data) {
        updateData();
    });

    $scope.redirect = function(path) {
        document.location.href = '/'+path;
    };

    $scope.prettyDate = function(day, year, month) {
        return CalendarService.getPrettyDate(day, year, month-1);
    };

}]);