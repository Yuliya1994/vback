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

app.controller('CalendarController', ['$scope', '$rootScope', 'ngDialog', 'CalendarService', 'VacationService', 'UserService', function($scope, $rootScope, ngDialog, CalendarService, VacationService, UserService){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.searchName = "";
    $scope.baseConfig = CalendarService;
    $scope.vacations = null;
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
                console.log($scope.vacations);
            })
            .error(function (err, status) {
                throw new Error(err)
            });
    };

    run();

    var icons = {
        start : "start",
        end : "end"
    };

    $scope.rangeClasses = {
        active: "rangeActive",
        refused: "rangeRefused",
        empty: "rangeEmpty",
        accepted: "rangeAccepted"
    };

    //Range of months (1-12) and years (unlimited)
    $scope.changeVisibleRange = function(part, sign) {
        if(part === 'year') {
            sign === 'plus' ? $scope.baseConfig.year++ : $scope.baseConfig.year--;
        } else if (part === 'month') {
            if(sign === 'plus') {
                if ($scope.baseConfig.month === 12) {
                    $scope.baseConfig.month = 1;
                } else {
                    $scope.baseConfig.month++
                }
            } else if (sign === 'minus') {
                if($scope.baseConfig.month === 1) {
                    $scope.baseConfig.month = 12;
                } else {
                    $scope.baseConfig.month--;
                }
            }
        }
    };

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

        var getIcon = function (curDay, days, isSplitted) {
            if(!isSplitted) {
                days = days[0];
                if(curDay === days[0]) {
                    return 'start';
                } else if(curDay === days[days.length-1]) {
                    return 'end';
                }

                return '';
            } else {
                if(curDay === days[0][0]){
                    if(month[1] !== $scope.baseConfig.month)
                        return 'start';
                } else if (curDay === days[1][days[1].length-1]) {
                    //Checking last month
                    if(month[1] === $scope.baseConfig.month) {
                        return 'end';
                    }
                }

                return '';
            }
        };


        if(month[1] === null) {
            return getState(days[0], curDay, acceptionState) + ' ' + getIcon(curDay, days, false);
        } else {
            if(month[1] === $scope.baseConfig.month) {
                return getState(days[1], curDay, acceptionState) + ' ' + getIcon(curDay, days, true);
            } else {
                return getState(days[0], curDay, acceptionState) + ' ' + getIcon(curDay, days, true);
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

    $scope.toggleTooltip = function(par) {
        par.tooltip = par
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

    $scope.prettyDate = function(day, year, month) {
        return CalendarService.getPrettyDate(day, year, month);
    };

}]);
