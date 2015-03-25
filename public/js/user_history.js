app.controller('UserHistoryController', ['$scope', 'UserService', 'VacationService', function($scope, UserService, VacationService) {
    $scope.user = null;
    $scope.userHistory = null;

    UserService.getCurrentUser()
        .success(function(data, status){
            $scope.user = angular.fromJson(data);

            VacationService.getVacationsByUser($scope.user.common.id)
                .success(function(data, status) {
                    console.log(data);

                    $scope.userHistory = angular.fromJson(data);
                    console.log($scope.userHistory)
                })
                .error(function(err, status) {
                    throw new Error(err);
                });
        })
        .error(function (error, status) {
            throw new Error(error);
        });


    $scope.defineRangeFromData = function(days, month, year) {
        return VacationService.defineRangeFromData(days, month, year);
    };

    $scope.showState = function(num) {
        var states = ['Рассматривается', 'Подтверждена', 'Отказ']

        return states[num];
    };
}]);
