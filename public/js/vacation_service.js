app.service("VacationService", ['$http', function($http) {
    this.addVacation = function(vacation) {
        return $http.post('/api/vacation', vacation);
    };

    this.getVacations = function() {
        return $http.get('/api/vacation');
    };

    this.getVacationByUser = function(user) {
        return $http.get('/api/vacation/' + user);
    };

    this.changeState = function(id, setState) {
        return $http.put('/api/vacation/'+id, {state: setState});
    };
}]);

