module.exports = function() {
    this.author = '';
    this.state = '';
    this.comment = '';
    this.subject = '';

    var self = this;

    return {
        setAuthor: function(author) {
            self.author = author;
        },

        setState: function(state) {
            self.state = state;
        },

        setComment: function(comment) {
            self.comment = comment;
        },

        setSubject: function(subject) {
            self.subject = subject;
        },

        getAuthor: function() {
            return self.author;
        },

        getState: function() {s
            return self.state;
        },

        getComment: function() {
            return self.comment;
        },

        getSubject: function() {
            return self.subject;
        },

        renderStateLetter: function() {
            return "Ваша заявка была " + self.state + " " + self.author + "ом.";
        },

        renderCommentLetter: function() {
            return "Вашу заявку прокомментировал администратор:" + self.comment;
        }
    }
};

//test