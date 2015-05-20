app.controller('UserHistoryController', ['$scope', '$rootScope', 'UserService', 'VacationService', function($scope, $rootScope, UserService, VacationService) {
    $scope.user = $scope.$parent.user;
    $scope.userHistory = null;

    function getHistory() {
        $scope.$emit('getHistory');

        VacationService.getVacationsByUser($scope.user.common.id)
            .success(function(data, status) {
                console.log(data);

                $scope.userHistory = angular.fromJson(data);
                console.log($scope.userHistory)
            })
            .error(function(err, status) {
                throw new Error(err);
            });
    }

    getHistory();

    $scope.defineRangeFromData = function(days, month, year) {
        return VacationService.defineRangeFromData(days, month, year);
    };

    $scope.showState = function(num) {
        var states = ['Рассматривается', 'Подтверждена', 'Отказ']

        return states[num];
    };
}]);