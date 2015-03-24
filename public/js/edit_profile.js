app.controller('EditProfileController', ['$scope', 'UserService', function($scope, UserService) {
    $scope.title = 'Профиль';

    $scope.user = null;

    UserService.getCurrentUser()
        .success(function(data, status){
        $scope.user = angular.fromJson(data);
    })
        .error(function (error, status) {
            throw error;
        })

}]);