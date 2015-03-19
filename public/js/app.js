var app = angular.module('VacationApp', ['ngDialog']);


app.controller('CalendarController', ['$scope', 'ngDialog', 'CalendarService', function($scope, ngDialog, CalendarService){
    $scope.searchName = "";

    $scope.baseConfig = CalendarService;

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
                        break

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


    $scope.getInfo = function(){
        console.info(this);
    };

    $scope.openVacationParameters = function(vac){
        $scope.vac = vac;
        ngDialog.open({
            template: './vacation.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.checkClass = function(callback, parameters) {
       var curClass = this.$$watchers[0].last;

        if(curClass.indexOf($scope.rangeClasses.empty)) {
            callback(parameters);
        }
    };

    $scope.vacations = [
        {
            id: 0,
            user: "Ivanov P.P.",
            rank: "Dev.",
            year: 2015,
            month: [3, 4],
            days: [[30, 31], [1,2,3,4,5,6]],
            comment: "Gonna go Turkey",
            acceptionState: 1
        },
        {
            id: 1,
            user: "Neivanov P.P.",
            rank: "Dev.",
            year: 2015,
            month: [3, 4],
            days: [[28, 29, 30, 31], [1,2,3]],
            comment: "Gonna go Turkey",
            acceptionState: 2
        },
        {
            id: 2,
            user: "Another P.P.",
            rank: "Dev.",
            year: 2015,
            month: [3, null],
            days: [[3,4,5,6,7,8,9], null],
            comment: "Gonna go Turkey",
            acceptionState: 2
        },
        {   id: 5,
            user: "Onemore P.P.",
            rank: "Man.",
            year: 2015,
            month: [3, null],
            days: [[12,13,14,15,16,17], null],
            comment: "Gonna go Turkey",
            acceptionState: 1
        },
        {
            id: 3,
            user: "Verynew P.P.",
            rank: "Dev.",
            year: 2015,
            month: [2, null],
            days: [[14,15,16,17,18,19], null],
            comment: "Gonna go Turkey",
            acceptionState: 1
        },
        {
            id: 4,
            user: "VeryVerynew P.P.",
            rank: "Dev.",
            year: 2015,
            month: [2, null],
            days: [[25,26,27,28,29,30,31], null],
            comment: "Gonna go Turkey",
            acceptionState: 1
        }
    ];
}]);
