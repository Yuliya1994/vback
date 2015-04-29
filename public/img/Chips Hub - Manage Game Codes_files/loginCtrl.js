'use strict';
/**
 * Login controller
 */
app.controller('LoginCtrl', ['$scope', 'SweetAlert', 'toaster', "principal", '$rootScope', '$state', function ($scope, SweetAlert, toaster, principal, $rootScope, $state) {
    //principal.logout();

    $scope.form = {
        submit: function (form) {
            if (!(form.$valid && $scope.fields))
                return;
            var data = $scope.fields;

            $scope.$broadcast("autofill:update");

            principal.logout();
            principal.identity(data.name, data.password)
                .then(function (obj) {
                    console.log(obj);
                    if ($rootScope.returnToState && $rootScope.returnToState.name) {
                        $state.go($rootScope.returnToState.name);
                    } else {
                        $state.go('app.dashboard');
                    }


                }).catch(function (error) {
                    toaster.pop('error', 'Authentication failed', error.message);
                });
        }
    }

    $scope.restore = {
        submit: function (form) {
            if (!(form.$valid && $scope.restoreFields))
                return;
            var data = $scope.restoreFields;
            var user = {
                email: data.email,
                //stuffedAnimal: data.stuffedAnimal,
                //grandfatherName: data.grandfatherName,
                //grandmotherCity: data.grandmotherCity
            }
            principal.restore(user)
                .then(function (obj) {
                    $state.go('login.signin');
                }).catch(function (error) {
                    toaster.pop('error', 'Failed!', error.message);
                });
        }
    }

    $scope.temporary = {
        submit: function (form) {
            if (!(form.$valid && $scope.restoreFields))
                return;
            var data = $scope.restoreFields;
            var user = {
                password: data.password,
            }
            principal.setPassword(user)
                .then(function () {
                    $state.go('app.dashboard');
                }).catch(function (error) {
                    $state.go('login.signin');
                });
        }
    }

    $scope.terms = {
        accept: function () {
            principal.acceptTerms();
            $state.go('app.dashboard');
        }
    }

    $scope.lock = {
        lock: function () {
            console.log('lock');
            principal.lockUser();
            $state.go('login.lock')
        },
        unlock: function (password) {
            console.log('unlock: ' + password);
            principal.unlockUser(password)
                .then(function (state) {
                    $state.go(state);
                })
                .catch(function (error) {
                    toaster.pop('error', 'Authentication failed', error.message);
                })
        }
    }

}]);
