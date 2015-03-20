app.controller('UserMainController', ['$scope', 'ngDialog', function($scope, ngDialog) {
    $scope.title = 'Профиль';

    $scope.newVacation = function(){
        ngDialog.open({
            template: '../templates/new_vacation.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.editProfile = function(){
        ngDialog.open({
            template: '../templates/edit_profile.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
}]);