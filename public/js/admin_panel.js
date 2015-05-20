app.controller('AdminPanelController', ['$scope', '$rootScope', 'UserService', function($scope, $rootScope, UserService) {
    $scope.userList = null;

    function getUserList() {
        UserService.getUsers()
            .success(function(data) {
                $scope.userList = data;

                console.log($scope.userList);
            })
            .error(function(err) {
                throw new Error(err);
            });
    }

    getUserList();

    $scope.deleteUser = function(id) {
        $scope.$emit('deleteUser');

        UserService.deleteUser(id)
            .success(function(data) {
                getUserList();
            })
            .error(function(err) {
                throw err;
            });
    };

}]);