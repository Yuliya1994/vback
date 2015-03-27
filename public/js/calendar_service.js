app.factory("CalendarService", function() {
    var date = new Date();

    return {
        year: date.getFullYear(),                                   //selected year
        month: date.getMonth() + 1,                                 //selected month
        searchName: "",
        days: function (year, month) {                              //count of days in selected month
            if(year === undefined || year === null)
                return new Date(this.year, this.month, 0).getDate();
            else {
                return new Date(year, month, 0).getDate();
            }
        },
        daysRange: function (days) {                                    //days-range array
            var result = [];

            if(!days) {
                days = this.days();
            } else {
                days = days;
            }

            for (var i = 1, a = days; i <= a; i++) result.push(i);


            return result;
        },
        getDay: function(day) {
            return new Date(this.year, this.month-1, day-1).getDay();
        },

        getPrettyDate: function(day, year, month) {
            var date = new Date(year, month, day);
            return date;
        }
    };
});
