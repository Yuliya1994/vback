app.factory("CalendarService", function() {
    var date = new Date();

    return {
        year: date.getFullYear(),                                   //selected year
        month: date.getMonth() + 1,                                 //selected month
        searchName: "",
        days: function (year, month) {                              //count of days in selected month
            if(!year)
                return new Date(this.year, this.month, 0).getDate();
            else {
                return new Date(year, month, 0).getDate();
            }
        },
        daysRange: function () {                                    //days-range array
            var result = [];

            for (var i = 1, a = this.days(); i <= a; i++) result.push(i);


            return result;
        },
        getDay: function(day) {
            console.log('1');
            return new Date(this.year, this.month-1, day-1).getDay();
        }
    };
});
