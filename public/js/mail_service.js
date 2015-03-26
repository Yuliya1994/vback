app.service('MailService', ['$http', function($http) {
    this.getMailList = function() {
        return $http.get('/api/mail');
    };

    this.addNewMail = function(mail) {
        return $http.post('/api/mail', mail);
    };

    this.updateMail = function(id, mail) {
        return $http.put('/api/mail/'+id, {state: mail});
    };

    this.deleteMail = function(id) {
        return $http.delete('/api/mail/'+id);
    };
}]);