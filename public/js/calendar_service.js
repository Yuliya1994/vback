app.factory("CalendarService", function() {
    var date = new Date();

    return {
        year: date.getFullYear(),                                   //selected year
        month: date.getMonth() + 1,                                 //selected month
        searchName: "",
        days: function daysInMonth(month, year) {                   //count of days in selected month
            return new Date(this.year, this.month, 0).getDate();
        },
        daysRange: function () {                                    //days-range array
            var result = [];
            for (var i = 1; i <= this.days(); i++) result.push(i);
            return result;
        },
        getDay: function(day) {
            return new Date(this.year, this.month-1, day-1).getDay();
        }
    };
});
