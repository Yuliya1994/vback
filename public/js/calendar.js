app.controller('CalendarController', ['$scope', '$rootScope', 'ngDialog', 'CalendarService', 'VacationService', 'UserService', function($scope, $rootScope, ngDialog, CalendarService, VacationService, UserService){
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });

    $scope.loaded = false;

    $scope.baseConfig = CalendarService;
    $scope.vacations = null;
    $scope.vacationsByUser = null;
    $scope.userHistory = null;
    $scope.vac = null;

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
                $scope.loaded = true;
            })
            .error(function (err, status) {
                throw new Error(err)
            });
    };

    run();

    //Create array sorting vacations by user [user_id] => [{vac...},{vac...},{vac...}]
    function diffByUsers(vacations) {
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
    }


    $scope.openVacationParameters = function(vac) {
        $scope.vac = null;
        var access = null;

        UserService.getCurrentUser()
            .success(function(user) {
                access = user.common.access;

                var _template = access === 0 ? 'vacation' : 'manager_vacation';

                VacationService.getVacation(vac._id)
                    .success(function(data) {
                        $scope.vac = data[0];


                        ngDialog.open({
                            template: '../templates/'+_template+'.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                    })
                    .error(function(err) {
                        throw err;
                    });


            })
            .error(function(err) {
                throw err;
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


    $scope.changeState = function(id, setState, cb) {
        VacationService.changeState(id, setState)
            .success(function(data, status) {

                setTimeout(cb, 300);
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
            })
            .error(function(error) {
                throw error;
            });
    };

    $scope.showState = function(num) {
        var states = ['Рассматривается', 'Подтверждена', 'Отказ'];

        states[10] = 'Одобрена';
        states[11] = 'Отклонена';

        return states[num];
    };




}]);
