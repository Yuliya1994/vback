app.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/list',{
            templateUrl: "../templates/list.html",
            animation: 'first'
        })
        .when('/settings',{
            templateUrl: "../templates/settings.html",
            animation: 'first'
        })
        .otherwise({
            templateUrl: "../templates/calendar.html",
            animation: 'first'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.directive('scrollOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $elm.on('click', function() {
                var target = $('.table-calendar');
                var shift = 0;
                var prevPos = atrs.target-1 < 0 ? 0 : atrs.target-1;

                for(var i = 0; i < (prevPos); i++) {
                    shift += target[i].clientWidth;
                    if(i > 3) shift+=20;
                }

                $(".swipe-area").animate({scrollLeft: shift}, "slow");


            });
        }
    }
});

app.controller('CalendarController', ['$scope', '$rootScope', 'ngDialog', 'CalendarService', 'VacationService', 'UserService', function($scope, $rootScope, ngDialog, CalendarService, VacationService, UserService){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.searchName = "";
    $scope.baseConfig = CalendarService;
    $scope.vacations = null;
    $scope.vacationsByUser = null;
    $scope.userHistory = null;

    $scope.comment = false;
    $scope.commented = false;

    var rank_list = [
        'Разработчик',
        'Менеджер',
        'Начальник'
    ];

    //Fill vacations-array with data from db
    var run = function() {
        VacationService.getVacations()
            .success(function (data, status) {
                $scope.vacations = data;

                angular.forEach($scope.vacations, function (el) {
                    UserService.getUser(el.user_id)
                        .success(function (user, status) {
                            el.user = user.common.profile.username || user.common.profile.email; // if name isn't defined - set email as user
                            // set email as username
                            el.rank = rank_list[user.common.rank] || 'Сотрудник';
                        })
                        .error(function (err, status) {
                            throw new Error(err)
                        });
                });

                diffByUsers($scope.vacations);
            })
            .error(function (err, status) {
                throw new Error(err)
            });
    };

    run();

    //Create array sorting vacations by user [user_id] => [{vac...},{vac...},{vac...}]
    function diffByUsers(vacations) {
        console.log(vacations);
        $scope.vacationsByUser = {};

        vacations.forEach(function(vac) {
            if($scope.vacationsByUser[vac.user_id] === undefined) {
                $scope.vacationsByUser[vac.user_id] = [];
            }
        });

        for(var user in $scope.vacationsByUser) {
            vacations.forEach(function(vac) {
                if(vac.user_id === user) {
                    $scope.vacationsByUser[user].push(angular.fromJson(vac));
                }
            });
        }
    };



    $scope.rangeClasses = {
        active: "rangeActive",
        refused: "rangeRefused",
        empty: "rangeEmpty",
        accepted: "rangeAccepted"
    };

    //Range of months (1-12) and years (unlimited)


    $scope.getState = function(acceptionState) {
        switch (acceptionState) {
            case 0:
                return $scope.rangeClasses.active;
                break;

            case 1:
                return $scope.rangeClasses.accepted;
                break;

            case 2:
                return $scope.rangeClasses.refused;
                break;
        }

        return $scope.rangeClasses.empty;
    };
    //main method to draw ranges with color and set start/end icons
    $scope.rangeState = function(curDay, month, days, acceptionState) {

        var getState = function(days, curDay, acceptionState) {
            if (~days.indexOf(curDay)) {
                switch (acceptionState) {
                    case 0:
                        return $scope.rangeClasses.active;
                        break;

                    case 1:
                        return $scope.rangeClasses.accepted;
                        break;

                    case 2:
                        return $scope.rangeClasses.refused;
                        break;
                }
            }

            return $scope.rangeClasses.empty;
        };

        if(month[1] === null) {
            return getState(days[0], curDay, acceptionState);
        } else {
            if(month[1] === $scope.baseConfig.month) {
                return getState(days[1], curDay, acceptionState);
            } else {
                return getState(days[0], curDay, acceptionState);
            }
        }


    };

    $scope.openVacationParameters = function(vac){
        $scope.vac = vac;
        ngDialog.open({
            template: '../templates/vacation.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    $scope.defineRangeFromData = function(days, month, year) {
        return VacationService.defineRangeFromData(days, month, year);
    };

    $scope.showUserHistory = function(user_id) {
        $scope.userHistory = null;

        VacationService.getVacationsByUser(user_id)
            .success(function(data, status) {
                $scope.userHistory = data;

                UserService.getUser(user_id)
                    .success(function(user, status) {
                        $scope.userHistoryName = user.common.profile.username || user.common.profile.email;

                        console.log(data);
                    })
                    .error(function(err) {
                        throw new Error(err);
                    });

                console.log($scope.userHistory);

                ngDialog.open({
                    template: '../templates/user-history.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            }).
            error(function(error, status) {
                throw new Error(error);
            });
    };

    $scope.checkClass = function(callback, parameters) {
        var curClass = this.$$watchers[0].last;

        if(curClass.indexOf) {
            if (curClass.indexOf($scope.rangeClasses.empty)) {
                if (!callback) {
                    return true;
                }
                else {
                    callback(parameters);
                }
            } else {
                return false;
            }
        }
    };

    $scope.changeState = function(id, setState) {
        VacationService.changeState(id, setState)
            .success(function(data, status) {
                $scope.vacations = null;
                run();
            })
            .error(function(err) {
                throw new Error(err);
            });
    };

    $scope.addComment = function(id, comment) {
        console.log(comment);
        VacationService.addComment(id, comment)
            .success(function(data, status) {
                console.log(data);
                run();
            })
            .error(function(error) {
                throw new Error(err);
            });
    };

    $scope.showState = function(num) {
        var states = ['Рассматривается', 'Подтверждена', 'Отказ']

        return states[num];
    };


}]);
