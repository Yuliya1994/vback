app.service("VacationService", ['$http', function($http) {
    this.addVacation = function(vacation) {
        return $http.post('/api/vacation', vacation);
    };

    this.getVacations = function() {
        return $http.get('/api/vacation');
    };

    this.getVacation = function(id) {
        return $http.get('/api/vacation/id/' + id);
    };

    this.getVacationsByUser = function(user_id) {
        return $http.get('/api/vacation/' + user_id);
    };

    this.changeState = function(id, setState) {
        return $http.put('/api/vacation/id/'+id, {state: setState});
    };

    this.addComment = function(id, comment) {
        return $http.put('/api/vacation/id/'+id, {adminComment: comment});
    };


    this.defineRangeFromData = function(days, month, year) {
        var range = '';
        var tempDays = [];

        tempDays[0] = [];
        tempDays[1] = [];

        days[0].map(function(day) {
            if(days[0][day] < 10) {
                tempDays[0][day] = '0' + day + '';
                console.log(days[0][day]);
            }
        });

        if(month[1] === null) {
            range = '' + days[0][0] + '.' + month[0] + ' - ' + days[0][days[0].length-1] + '.' + month[0] + '.' + year;
        } else {
            range = '' + days[0][0] + '.' + month[0] + ' - ' + days[1][days[1].length-1] + '.' + month[1] + '.' + year;
        }

        return range;
    };
}]);

