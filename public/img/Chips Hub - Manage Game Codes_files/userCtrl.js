'use strict';
/**
 * controller for User Profile Example
 */
app.controller('UserCtrl', ['$scope', 'flowFactory', 'principal', '$state', '$stateParams', '$firebaseAuth', "$firebaseObject", "$firebaseArray",
    function ($scope, flowFactory, principal, $state, $stateParams, $firebaseAuth, $firebaseObject, $firebaseArray) {
        console.log($stateParams.userId);


        $scope.removeImage = function () {
            $scope.noImage = true;
        };
        $scope.obj = new Flow();

        $scope.$watch('obj.flow.files.length', function () {
            console.log($scope.obj);
            //getActiveCodes(scope.rangeObj);

        });

        var user = principal.getUserInfo($stateParams.userId);
        user.$bindTo($scope, "userInfo");

        var avatar = principal.getAvatar($stateParams.userId);
        avatar.$bindTo($scope, "avatar");


        $scope.userId = principal.getId();

        $scope.uploadPhoto = function () {
            var img = $scope.obj.flow.files[0];
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var uri = event.target.result;
                principal.updateAvatar(uri, $stateParams.userId);
            };
            fileReader.readAsDataURL(img.file);
        };

    }]);
