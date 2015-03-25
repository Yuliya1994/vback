app.controller('EditProfileController', ['$scope', 'UserService', 'ngDialog', function($scope, UserService, ngDialog) {
    $scope.title = 'Профиль';

    $scope.user = null;

    UserService.getCurrentUser()
        .success(function(data, status){
            $scope.user = angular.fromJson(data);

            $scope.newUsername = $scope.user.common.profile.username;
            $scope.newEmail = $scope.user.common.profile.email;
        })
        .error(function (error, status) {
            throw error;
        });

    $scope.updateUser = function(data) {
        UserService.updateUser($scope.user.common.id, {username: $scope.newUsername, email: $scope.newEmail})
            .success(function(data, status) {
                $scope.$emit('updateUser');

                ngDialog.open({
                    template: '<p>Данные успешно обновлены</p> ',
                    plain: true
                });
            })
            .error(function(err){
                if(err) {
                    throw new Error(err);
                }
            });
    };

}]);