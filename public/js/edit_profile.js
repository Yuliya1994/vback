app.controller('EditProfileController', ['$scope', '$rootScope', 'UserService', 'ngDialog', function($scope, $rootScope, UserService, ngDialog) {
    $scope.user = $scope.$parent.user;
    $scope.newUsername = $scope.$parent.user.common.profile.username;
    $scope.newEmail = $scope.$parent.user.common.profile.email;

    $scope.updateUser = function(data) {
        UserService.updateUser($scope.user.common.id, {username: $scope.newUsername, email: $scope.newEmail})
            .success(function(data, status) {
                $scope.$emit('updateUser');

                console.log();

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