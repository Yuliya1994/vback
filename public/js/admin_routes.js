app.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/list',{
            templateUrl: "../templates/list.html",
            animation: 'first'
        })
        .when('/settings',{
            templateUrl: "../templates/settings.html",
            animation: 'first'
        })
        .otherwise({
            templateUrl: "../templates/calendar.html",
            animation: 'first'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});