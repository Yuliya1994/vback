app.controller('MailController', ['$scope', '$rootScope', 'MailService', function($scope, $rootScope, MailService) {
    $scope.subscriber = {};
    $scope.mailList = {};


    $scope.$on('anyChanges', function(event, data) {
        MailService.getMailList()
            .success(function (data, status) {
                $scope.mailList = data;
                console.log($scope.mailList);
            })
            .error(function (err, status) {
                throw err;
            });
    });

    //Init
    $scope.$emit('anyChanges');


    $scope.addNewMail = function() {
        MailService.addNewMail($scope.subscriber)
            .success(function(data, status) {
                console.log(data);
                $scope.$emit('anyChanges');
            })
            .error(function(error, status) {
                throw err;
            });
    };

    $scope.deleteMail = function(id) {
        MailService.deleteMail(id)
            .success(function(data, status) {
                console.log(data);
                $scope.$emit('anyChanges');
            })
            .error(function(err, status) {
                throw err;
            });
    };

    $scope.changeState = function(id) {
        MailService.updateMail(id, this.mail.state)
            .success(function(data, status) {
                console.log(data);
               // $scope.$emit('anyChanges');
            })
            .error(function(err) {
                throw err;
            });
    };
}]);