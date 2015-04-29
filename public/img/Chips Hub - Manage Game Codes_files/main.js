var app = angular.module('clipApp', ['clip-two']);
app.run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal',
    function ($rootScope, $state, $stateParams, authorization, principal) {

        // Attach Fastclick for eliminating the 300ms delay between a physical tap and the firing of a click event on mobile browsers
        FastClick.attach(document.body);

        // Set some reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // GLOBAL APP SCOPE
        // set below basic information
        $rootScope.app = {
            name: 'Chips Hub', // name of your project
            author: 'ConneXeek LLC', // author's name or company name
            description: 'Manage virtual currency for games', // brief description
            version: '1.0', // current version
            year: ((new Date()).getFullYear()), // automatic current year (for copyright information)
            isMobile: (function () {// true if the browser is a mobile device
                var check = false;
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    check = true;
                }
                ;
                return check;
            })(),
            layout: {
                isNavbarFixed: true, //true if you want to initialize the template with fixed header
                isSidebarFixed: true, // true if you want to initialize the template with fixed sidebar
                isSidebarClosed: false, // true if you want to initialize the template with closed sidebar
                isFooterFixed: false, // true if you want to initialize the template with fixed footer
                theme: 'theme-1', // indicate the theme chosen for your project
                logo: 'assets/images/logo.png' // relative path of the project logo
            }
        };


        principal.identity().then(function (user) {
            console.log(user);

            var avatar = principal.getAvatar();
            avatar.$bindTo($rootScope, "avatar");

            $rootScope.user = {
                name: user.firstName + ' ' + user.lastName,
                job: user.role
            }
        });

        $rootScope.CryptoJS = {
            AESkey: '101112131415161718191a1b1c1d1e1f'
        }

        $rootScope.isInRole = function (role) {
            return principal.isInRole(role);
        };


        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromParams) {
            // track the state the user wants to go to; authorization service needs this
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            $rootScope.fromState = fromState;
            $rootScope.fromStateParams = fromParams;
            console.log(fromState.name + ' -> ' + toState.name);
            // if the principal is resolved, do an authorization check immediately. otherwise,
            // it'll be done when the state it resolved.
            if (toState.name == fromState.name)
                return;
            if (principal.isIdentityResolved()) authorization.authorize();
        });

    }]);
// translate config
app.config(['$translateProvider',
    function ($translateProvider) {

        // prefix and suffix information  is required to specify a pattern
        // You can simply use the static-files loader with this pattern:
        $translateProvider.useStaticFilesLoader({
            prefix: 'assets/i18n/',
            suffix: '.json'
        });

        // Since you've now registered more then one translation table, angular-translate has to know which one to use.
        // This is where preferredLanguage(langKey) comes in.
        $translateProvider.preferredLanguage('en');

        // Store the language in the local storage
        $translateProvider.useLocalStorage();

    }]);
// Angular-Loading-Bar
// configuration
app.config(['cfpLoadingBarProvider',
    function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;

    }]);
