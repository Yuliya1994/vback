app.controller('AdminPanelController', ['$scope', '$rootScope', 'UserService', function($scope, $rootScope, UserService) {
    $scope.userList = null;
    $scope.predicate = 'common.profile.username';
    function getUserList() {
        UserService.getUsers()
            .success(function(data) {
                $scope.userList = data;
                for(var i = 0; i<=$scope.userList.length;i++){
                    $scope.userList[i].common.profile.username = $scope.userList[i].common.profile.username.split(' ')[1] + ' ' +$scope.userList[i].common.profile.username.split(' ')[0];
                }
            })
            .error(function(err) {
                throw new Error(err);
            });
    }

    getUserList();

    $scope.deleteUser = function(id) {
        UserService.deleteUser(id)
            .success(function(data) {
                getUserList();
            })
            .error(function(err) {
                throw err;
            });
    };

}]);