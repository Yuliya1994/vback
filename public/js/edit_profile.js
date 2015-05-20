app.controller('EditProfileController', ['$scope', '$rootScope', 'UserService', 'ngDialog', function($scope, $rootScope, UserService, ngDialog) {
    $scope.user = $scope.$parent.user;
    $scope.Username = $scope.$parent.user.common.profile.username.split(' ');
    $scope.newEmail = $scope.$parent.user.common.profile.email;
    $scope.newsurname=$scope.Username[0];
    $scope.newname=$scope.Username[1];
    $scope.updateUser = function(data) {
        $scope.newUsername = $scope.newsurname+' '+$scope.newname;
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