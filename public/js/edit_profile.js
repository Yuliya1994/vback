app.controller('EditProfileController', ['$scope', '$rootScope', 'UserService', 'ngDialog', function($scope, $rootScope, UserService, ngDialog) {
    $scope.user = $scope.$parent.user;
    $scope.Username = $scope.$parent.user.common.profile.username;
    $scope.rank = $scope.$parent.user.common.rank;
    $scope.id = $scope.user.common.id;
    console.log($scope.Username);
    if($scope.Username!=null) {
        $scope.Username = $scope.$parent.user.common.profile.username.split(' ');
        $scope.newsurname=$scope.Username[0];
        $scope.newname=$scope.Username[1];
    }

    $scope.newEmail = $scope.$parent.user.common.profile.email;
    $scope.updateUser = function(data) {
        $scope.newUsername = $scope.newsurname+' '+$scope.newname;
        UserService.updateUser($scope.user.common.id, {username: $scope.newUsername, email: $scope.newEmail,rank:$scope.rank,photo:$('#photo').val()})
            .success(function(data, status) {
                $scope.$emit('updateUser');
                ngDialog.open({
                    template: '<p>Данные успешно обновлены</p> ',
                    plain: true
                });
console.log($('#photo').val());
            })
            .error(function(err){
                if(err) {
                    throw new Error(err);
                }
            });
    };

}]);