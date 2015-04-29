'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        // LAZY MODULES

        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        // APPLICATION ROUTES
        // -----------------------------------
        // For any unmatched url, redirect to /app/dashboard
        $urlRouterProvider.otherwise("/app/dashboard");
        //
        // Set up the states
        $stateProvider.state('app', {
            url: "/app",
            templateUrl: "assets/views/app.html",
            resolve: loadSequence('cryptojs', 'modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'perfect_scrollbar', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'chatCtrl', 'loginCtrl'),
            data: {
                roles: ['user', 'admin']
            },
            abstract: true
        })
            .state('login', {
                url: "/login",
                template: '<div ui-view class="fade-in-up"></div>',
                resolve: loadSequence('cryptojs', 'modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'perfect_scrollbar', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'autoFill', 'oitozero.ngSweetAlert'),
                abstract: true
            })
            .state('login.signin', {
                url: "/signin",
                templateUrl: "assets/views/login_login.html",
                resolve: loadSequence('loginCtrl')
            })
            .state('login.accept', {
                url: "/accept",
                templateUrl: "chips/views/users/acceptTerms.html",
                resolve: loadSequence('loginCtrl')
            })
            .state('login.restore', {
                url: "/restore",
                templateUrl: "chips/views/users/restore.html",
                resolve: loadSequence('loginCtrl')
            })
            .state('login.temporary', {
                url: "/temporary",
                templateUrl: "chips/views/users/temporary.html",
                resolve: loadSequence('loginCtrl'),
                data: {
                    roles: ['agent', 'member', 'admin']
                }
            })
            .state('login.lock', {
                url: "/lock",
                templateUrl: "assets/views/login_lock_screen.html",
                resolve: loadSequence('loginCtrl'),
                data: {
                    roles: ['agent', 'member', 'admin']
                }
            })

            .state('registration', {
                url: "/registration",
                templateUrl: "chips/views/users/register.html",
                resolve: loadSequence('cryptojs', 'modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'perfect_scrollbar', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'usersCtrl')

            })
            .state('app.profile', {
                url: "/profile",
                templateUrl: "chips/views/users/profile.html",
                resolve: loadSequence('flow', 'userCtrl'),
                title: 'Profile',
                ncyBreadcrumb: {
                    label: 'Profile'
                },
                data: {
                    roles: ['user', 'admin', 'agent']
                }
            })

            .state('app.profile.edit', {
                url: "/edit/{userId}",
                templateUrl: "chips/views/admins/editUser.html",
                resolve: loadSequence('flow', 'userCtrl'),
                title: 'Profile',
                ncyBreadcrumb: {
                    label: 'Profile'
                },
                data: {
                    roles: ['user', 'admin', 'agent']
                }
            })

            .state('app.dashboard', {
                url: "/dashboard",
                templateUrl: "chips/views/dashboard.html",
                resolve: loadSequence(
                    'jquery-sparkline', 'sparkline', 'dashboardCtrl'),
                title: 'Dashboard',
                ncyBreadcrumb: {
                    label: 'Dashboard'
                },
                data: {
                    roles: ['user', 'admin', 'agent']
                }

            }).state('app.gamecodes', {
                url: "/managecodes",
                templateUrl: "chips/views/managecodes.html",
                title: 'Manage Game Codes',
                resolve: loadSequence('cnxGamecodes', 'flow', 'userCtrl'),
                ncyBreadcrumb: {
                    label: 'Manage Game Codes'
                },
                data: {
                    roles: ['admin']
                }
            })
            .state('app.bookers', {
                url: '/bookers',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Bookers',
                ncyBreadcrumb: {
                    label: 'Bookers'
                }
            })
            .state('app.bookers.profile', {
                url: "/agent-profile",
                templateUrl: "chips/views/agentProfile.html",
                title: 'Agent Profile',
                resolve: loadSequence('flow', 'userCtrl', 'cnxGamecodes'),
                ncyBreadcrumb: {
                    label: 'Agent Profile'
                }
            })

            .state('app.bookers.manage', {
                url: "/manage-agents",
                templateUrl: "chips/views/agents.html",
                title: 'Manage Agents',
                resolve: loadSequence('agentCtrl', 'ngDialog', 'BookersCtrl', 'cnxUser'
                    , 'ngTable', 'ngTableCtrl'
                ),
                ncyBreadcrumb: {
                    label: 'Manage Agents'
                }
            })
            .state('app.bookers.register', {
                url: "/register",
                //templateUrl: "chips/views/addAgent.html",
                templateUrl: "chips/views/agents/createAgent.html",
                title: 'Manage Agents',
                resolve: loadSequence('agentCtrl', 'cnxUser'),
                ncyBreadcrumb: {
                    label: 'Register'
                }
            })

            .state('app.membership', {
                url: '/membership',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Membership',
                ncyBreadcrumb: {
                    label: 'Membership'
                }
            })
            .state('app.membership.roles', {
                url: "/roles",
                templateUrl: "chips/views/roles.html",
                title: 'Security Roles',
                resolve: loadSequence('ngTable', 'TableCtrl'),
                ncyBreadcrumb: {
                    label: 'Security Roles'
                }
            })


            .state('app.reports', {
                url: '/reports',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Reports',
                ncyBreadcrumb: {
                    label: 'Reports'
                }
            }).state('app.reports.sales', {
                url: '/sales',
                templateUrl: "chips/reports/sales.html",
                title: 'Sales',
                icon: 'ti-layout-media-left-alt',
                ncyBreadcrumb: {
                    label: 'Sales'
                }
            }).state('app.reports.currentInvoice', {
                url: '/crinvoice',
                templateUrl: "chips/reports/currentInvoice.html",
                title: 'Current Invoice',
                icon: 'ti-layout-media-left-alt',
                resolve: loadSequence('ngTable', 'ngTableCtrl', 'cnxInvoice'),
                ncyBreadcrumb: {
                    label: 'Current Invoice'
                }
            })

            .state('app.reports.invoices', {
                url: '/invoices',
                templateUrl: "chips/reports/invoices.html",
                title: 'Invoices',
                icon: 'ti-layout-media-left-alt',
                resolve: loadSequence('invoicesCtrl', 'ngTable', 'ngTableCtrl', 'cnxInvoice'),
                ncyBreadcrumb: {
                    label: 'Invoices'
                }
            })
            .state('app.gameSettings', {
                url: '/gmsettings',
                template: '<div ui-view class="fade-in-up"></div>',
                title: 'Game Settings',
                ncyBreadcrumb: {
                    label: 'Game Settings'
                }
            })
            .state('app.gameSettings.game1', {
                url: '/gmsts1',
                templateUrl: "chips/gmSettings/gmsts1.html",
                title: 'Elements',
                icon: 'ti-layout-media-left-alt',
                ncyBreadcrumb: {
                    label: 'Elements'
                },
                resolve: loadSequence('ui.select', 'ui.mask',
                    'monospaced.elastic', 'touchspin-plugin',
                    'angular-bootstrap-touchspin', 'selectCtrl')
            })

//Template states
            .state('app.gameSettings.game2', {
                url: '/gmsts2',
                templateUrl: "chips/gmSettings/gmsts2.html",
                title: 'Buttons',
                resolve: loadSequence('spin', 'ladda', 'angular-ladda', 'laddaCtrl'),
                ncyBreadcrumb: {
                    label: 'Buttons'
                }
            }).state('app.gameSettings.game3', {
                url: '/gmsts3',
                templateUrl: "chips/gmSettings/gmsts1.html",
                title: 'Link Effects',
                ncyBreadcrumb: {
                    label: 'Link Effects'
                }
            }).state('app.gameSettings.game4', {
                url: '/gmsts4',
                templateUrl: "chips/gmSettings/gmsts1.html",
                title: 'Font Awesome Icons',
                ncyBreadcrumb: {
                    label: 'Font Awesome Icons'
                },
                resolve: loadSequence('iconsCtrl')
            });

        // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }],

                authorize: [
                    'authorization', function (authorization) {
                        return authorization.authorize();
                    }
                ]
            };
        }
    }]);
