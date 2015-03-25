app.service("UserService", ['$http', function($http) {
    this.getUsers = function() {
        return $http.get('/api/user');
    };

    this.getCurrentUser = function() {
        return $http.get('/api/user/current');
    };

    this.getUser = function(id) {
        return $http.get('/api/user/'+id);
    };

    this.updateUser = function(id, data) {
        return $http.put('/api/user/'+id, {username: data.username, email: data.email});
    }
}]);
