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
        var endDate = null;
        var startDate = new Date(year, month[0], days[0][0]);
        //Check if this month Aug
        if (month[0]==8) {
            startDate = new Date(year, month[0]+1, days[0][0]);
        }

        if(month[1] === null) {
            endDate = new Date(year, month[0], days[0][days[0].length - 1]);
        } else {
            endDate = new Date(year, month[1], days[1][days[1].length - 1]);
        }

        startDate = ('0' + (startDate.getDate())).slice(-2)+'.'+ ('0' + (startDate.getMonth())).slice(-2) +'.'+startDate.getFullYear();
        endDate = ('0' + (endDate.getDate())).slice(-2)+'.'+ ('0' + (endDate.getMonth())).slice(-2) +'.'+endDate.getFullYear();

        range  =  startDate + ' - ' + endDate;
        return range;
    };
}]);
