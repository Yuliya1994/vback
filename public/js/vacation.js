app.controller('NewVacationController', ['$scope', 'VacationService', 'ngDialog', function($scope, VacationService, ngDialog) {
    $scope.range = {
        start: null,
        end: null
    };

    $scope.vacation = {};

    $scope.submitBtn = true;
    $scope.errors = [];

    //Datepicker validation
    $scope.$watchCollection('range', function() {
        $scope.submitBtn = $scope.range.end > $scope.range.start
            ? isRangeCorrect($scope.range.start, $scope.range.end)
                ? false
                : true
            : true;

        if(!isRangeCorrect($scope.range.start, $scope.range.end)) {
            $scope.errors.push('Промежуток не должен превышать 14 дней!');
        } else {
            $scope.errors.shift();
        }

    });


    function isRangeCorrect(start, end) {
        var oToday = start;
        var oDeadLineDate = end;

        var days = oDeadLineDate > oToday ? Math.ceil((oDeadLineDate - oToday) / (1000 * 60 * 60 * 24)) : null;

        return days < 14;
    }

    //defines array with year, months, days
    function makeRange() {
        var result = {}
            /*
             year: 2015,
             month: [3, 4],
             days: [[30, 31], [1,2,3,4,5,6]],
            */
        ;

        var startDate = new Date($scope.range.start);
        var endDate = new Date($scope.range.end);

        var yearNum = startDate.getFullYear();

        var startDay = startDate.getDate();
        var endDay = endDate.getDate();

        var startMonthNum = (startDate.getMonth() + 1);
        var endMonthNum = (endDate.getMonth() + 1);

        var daysInStartDate = new Date(yearNum, startMonthNum, 0).getDate();

        //define month array
        console.log(startMonthNum + ' - ' + endMonthNum);
        if(startMonthNum === endMonthNum) {
            month = [startMonthNum, null];
        } else {
            month = [startMonthNum, endMonthNum];
        }

        //define days array
        var days = [[],[]];

        if(month[1] === null) {
            for(var i = startDay; i <= endDay; i++) {
                days[0].push(i);
            }

            days[1] = null;
        } else {
            for(var i = startDay; i <= daysInStartDate; i++) {
                days[0].push(i);
            }

            for(var j = 1; j <= endDay; j++){
                days[1].push(j);
            }
        }

        result.year = yearNum;
        result.month = month;
        result.days = days;

        return result;
    }

    $scope.showResult = function() {
        var range = makeRange();

        $scope.vacation.year = range.year;
        $scope.vacation.month = range.month;
        $scope.vacation.days = range.days;

        VacationService.addVacation($scope.vacation).success(function(data, status) {
            ngDialog.open({
                template: '<p>Заявка отправлена!</p>',
                plain: true
            });
        });
        console.log($scope.vacation);
        console.log('test');
    }
}]);