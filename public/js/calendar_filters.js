app.filter('monthName', [function() {
    return function (monthNumber) {
        var monthNames = [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ];
        return monthNames[monthNumber-1];
    }
}]);

app.filter('dayName', [function() {
    return function (monthNumber) {
        var monthNames = [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ];

        return monthNames[monthNumber];
    }
}]);

app.filter('addZeroToMontNum', [function(){
    return function(monthNumber){
        if(monthNumber < 10) {
            return 0 + '' + monthNumber;
        }

        return monthNumber;
    }
}]);