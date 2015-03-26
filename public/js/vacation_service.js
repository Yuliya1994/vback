app.service("VacationService", ['$http', function($http) {
    this.addVacation = function(vacation) {
        return $http.post('/api/vacation', vacation);
    };

    this.getVacations = function() {
        return $http.get('/api/vacation');
    };

    this.getVacationsByUser = function(user_id) {
        return $http.get('/api/vacation/' + user_id);
    };

    this.changeState = function(id, setState) {
        return $http.put('/api/vacation/'+id, {state: setState});
    };



    this.defineRangeFromData = function(days, month, year) {
        var range = '';

        if(month[1] === null) {
            range = '' + days[0][0] + '.' + month[0] + ' - ' + days[0][days[0].length-1] + '.' + month[0] + '.' + year;
        } else {
            range = '' + days[0][0] + '.' + month[0] + ' - ' + days[1][days[1].length-1] + '.' + month[1] + '.' + year;
        }

        return range;
    };
}]);

