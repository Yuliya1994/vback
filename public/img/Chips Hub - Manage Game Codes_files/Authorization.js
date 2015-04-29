//﻿// source: http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
//example: http://plnkr.co/edit/UkHDqFD8P7tTEqSaCOcc?p=preview

app.factory('principal', ['$rootScope',
    '$q', '$http', '$timeout', '$firebaseAuth', "$firebaseObject", '$filter', '$firebaseArray', '$state',
    function ($rootScope, $q, $http, $timeout, $firebaseAuth, $firebaseObject, $filter, $firebaseArray, $state) {
        var _identity = undefined;
        var _authenticated = false;
        var _login = undefined;
        var _loginInfo = undefined;

        var ref = new Firebase("https://havana.firebaseio.com/");
        var auth = $firebaseAuth(ref);

        var usersRef = new Firebase("https://havana.firebaseio.com/Users");
        var users = $firebaseArray(usersRef);

        return {
            getId: function () {
                if (angular.isDefined(_identity) && _identity != null) {
                    return _identity.$id;
                }
                return '';
            },
            getRole: function () {
                return _identity.role;
            },
            getUserInfo: function (id) {
                if (!id)
                    id = this.getId();

                var usr = new Firebase("https://havana.firebaseio.com/Users/" + id);
                var obj = $firebaseObject(usr);

                return obj;
            },


            getLock: function () {
                return _identity.lock;
            },
            isIdentityResolved: function () {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            isInRole: function (role) {
                if (!_authenticated || !_identity.role) return false;
                return _identity.role == role;
            },
            isInAnyRole: function (roles) {
                if (!_authenticated || !_identity.role) return false;

                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) return true;
                }

                return false;
            },
            _authenticate: function (data, deferred, unlock) {
                var usr = new Firebase("https://havana.firebaseio.com/Users/" + data.uid);
                var obj = $firebaseObject(usr);
                obj.$loaded().then(function (data) {
                    if (data.email == null) {
                        deferred.reject({message: 'Account is missing!'});
                        self.logout();
                    } else if (!data.isApproved) {
                        self.logout();
                        deferred.reject({message: 'Account is not approved!'});
                    } else {
                        if (unlock) {
                            data.lock = {
                                isLocked: false,
                                lastScreen: ''
                            };
                            obj = data;
                            obj.$save();
                        }


                        _identity = obj;
                        _authenticated = true;
                        _login = obj;
                        deferred.resolve(obj);
                    }
                });

            },
            identity: function (email, pass) {
                var deferred = $q.defer();
                var self = this;

                var authData = auth.$getAuth();
                _login = authData;

                if (angular.isDefined(_identity) && _identity != null) {
                    deferred.resolve(_identity);
                } else if (authData) {
                    self._authenticate(authData, deferred);
                } else if (email && pass) {
                    _loginInfo = {
                        email: email,
                        password: pass
                        //TODO: I dont know why.
                        //remember: remember ? 'none' : 'sessionOnly'
                    };
                    auth.$authWithPassword(_loginInfo)
                        .then(function (data) {
                            self._authenticate(data, deferred, true);
                        })
                        .catch(function (error) {
                            _identity = undefined;
                            _authenticated = false;
                            deferred.reject(error);
                        });
                } else {
                    deferred.reject({message: 'empty'});
                }
                return deferred.promise;
            },
            logout: function () {
                this.unlockUser();
                _identity = undefined;
                _authenticated = false;
                _login = undefined;
                _loginInfo = undefined;
                auth.$unauth();
            },

            register: function (role, data) {
                var deferred = $q.defer();
                var self = this;

                auth.$createUser({
                    email: data.email,
                    password: data.password
                }).then(function (authData) {
                    var usr = new Firebase("https://havana.firebaseio.com/Users/" + authData.uid);
                    try {
                        var obj = self._getUserEntity(data, role);
                        usr.set(obj);
                        deferred.resolve(usr);
                    } catch (e) {
                        auth.$removeUser({
                            email: data.email,
                            password: data.password
                        }).then(function () {
                            //console.log("User removed successfully!");
                        }).catch(function (removeError) {
                            //console.error("Error: ", removeError);
                        });
                    }
                }).catch(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            },
            restore: function (user) {
                var deferred = $q.defer();
                var self = this;
                var ref = new Firebase("https://havana.firebaseio.com/Users");
                var syncArray = $firebaseArray(ref);
                syncArray.$loaded()
                    .then(function (x) {
                        var list = x;
                        var entity = $filter('filter')(list, {
                            email: user.email
                            //stuffedAnimal: user.stuffedAnimal,
                            //grandfatherName: user.grandfatherName,
                            //grandmotherCity: user.grandmotherCity
                        })[0];
                        console.log(entity);
                        if (angular.isDefined(entity)) {
                            auth.$resetPassword({
                                email: entity.email
                            }).then(function () {
                                deferred.resolve(entity);
                            }).catch(function (error) {
                                deferred.reject({message: 'Account is missing!'});
                            });
                            deferred.resolve(entity);
                        } else {
                            deferred.reject({message: 'Account is missing!'});
                        }
                    })
                    .catch(function (error) {
                        deferred.reject({message: 'Account is missing!'});
                    });


                return deferred.promise;
            },

            acceptTerms: function () {
                var usr = new Firebase("https://havana.firebaseio.com/Users/" + this.getId());
                var obj = $firebaseObject(usr)
                    .$loaded()
                    .then(function (data) {
                        data.isAgreed = true;
                        obj = data;
                        obj.$save();
                    })
                    .catch(function (error) {
                        console.error("Error:", error);
                    });
                _identity.isAgreed = true;
            },

            setPassword: function (data) {
                var deferred = $q.defer();
                var self = this;
                var email;
                var oldPass;
                var newPass;
                var passEncoded;
                try {
                    email = _login.password.email;
                    oldPass = _loginInfo.password;
                    newPass = data.password;
                    passEncoded = this._encodeData(newPass);
                } catch (e) {
                    deferred.reject({message: e});
                    return deferred.promise;
                }
                auth.$changePassword({
                    email: email,
                    oldPassword: oldPass,
                    newPassword: newPass
                }).then(function () {
                    self.logout();
                    self.identity(email, newPass).then(function (data) {
                        var usr = new Firebase("https://havana.firebaseio.com/Users/" + data.$id);
                        var obj = $firebaseObject(usr)
                            .$loaded()
                            .then(function (data) {
                                data.password = passEncoded;
                                obj = data;
                                obj.$save();
                            })
                            .catch(function (error) {
                                console.error("Error:", error);
                            });

                        deferred.resolve('');
                    }).catch(function () {
                        deferred.reject({message: 'Error updating password'});
                    });
                }).catch(function (error) {
                    deferred.reject({message: error});
                    console.error("Error: ", error);
                });
                return deferred.promise;
            },

            isAgreed: function () {
                return _identity ? _identity.isAgreed : true;
            },

            isTemporary: function () {
                return _login ? _login.password.isTemporaryPassword : false;
            },

            removeUser: function (userId) {
                var deferred = $q.defer();

                var usr = new Firebase("https://havana.firebaseio.com/Users/" + userId);
                var self = this;
                var objToRemove = $firebaseObject(usr);
                var obj = $firebaseObject(usr)
                    .$loaded()
                    .then(function (data) {
                        var email = data.email;
                        var pass = self._decodeData(data.password);
                        //objToRemove.$remove();
                        auth.$removeUser({
                            email: email,
                            password: pass
                        }).then(function () {
                            deferred.resolve({id : userId});
                            //objToRemove.$remove();
                            console.log("User removed successfully!");
                        }).catch(function (error) {
                            deferred.reject(error);
                            console.error("Error: ", error);
                        });


                    })
                    .catch(function (error) {
                        deferred.reject(error);
                        console.error("Error:", error);
                    });

                return deferred.promise;
            },

            lockUser: function () {
                var self = this;
                var usr = new Firebase("https://havana.firebaseio.com/Users/" + this.getId());
                var obj = $firebaseObject(usr);
                obj.$loaded().then(function (data) {
                    var state = $rootScope.fromState.name;
                    //if ($rootScope.fromStateParams)
                    //    state += '/' + $rootScope.fromStateParams;
                    data.lock = {
                        isLocked: true,
                        lastScreen: state
                    };
                    obj = data;
                    obj.$save();
                });

            },

            unlockUser: function (password) {
                var deferred = $q.defer();
                var self = this;
                var usr = new Firebase("https://havana.firebaseio.com/Users/" + this.getId());
                var obj = $firebaseObject(usr);
                obj.$loaded().then(function (data) {
                    if (self._decodeData(data.password) == password) {
                        var state = 'app.dashboard';
                        if (data.lock && data.lock.lastScreen && data.lock.lastScreen != '') {
                            state = data.lock.lastScreen;
                        }
                        data.lock = {
                            isLocked: false,
                            lastScreen: ''
                        };
                        obj = data;
                        obj.$save();
                        deferred.resolve(state);
                    } else {
                        deferred.reject({message: 'Wrong password!'});
                    }

                });
                return deferred.promise;
            },

            getUsersTotal: function () {
                var deferred = $q.defer();
                users.$loaded()
                    .then(function (list) {
                        deferred.resolve(list);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    })

                return deferred.promise;
            },

            updateAvatar: function (base64, userId) {
                var self = this;
                var uid = userId ? userId : this.getId();
                var img = new Firebase("https://havana.firebaseio.com/Avatars/" + uid);
                var obj = $firebaseObject(img);
                obj.$value = base64;
                obj.$save();
            },

            getAvatar: function (id) {
                if (!id)
                    id = this.getId();
                var avatarRef = new Firebase("https://havana.firebaseio.com/Avatars/" + id);
                var avatar = $firebaseObject(avatarRef);
                return avatar;
            },

            _getUserEntity: function (model, role) {
                var self = this;
                return {
                    userName: model.userName ? model.userName : '',
                    firstName: model.firstName ? model.firstName : '',
                    lastName: model.lastName ? model.lastName : '',
                    street: model.street ? model.street : '',
                    city: model.city ? model.city : '',
                    region: model.region ? model.region : '',
                    postalCode: model.postCode ? model.postCode : '',
                    account: {
                        creditLine: model.account && model.account.creditLine ? model.account.creditLine : '',
                        comission: model.account && model.account.comission ? model.account.comission : '',
                        billingCycle: model.account && model.account.billingCycle ? model.account.billingCycle : ''
                    },
                    email: model.email ? model.email : '',
                    password: model.password ? self._encodeData(model.password) : '',
                    grandfatherName: model.grandfatherName ? model.grandfatherName : '',
                    grandmotherCity: model.grandmotherCity ? model.grandmotherCity : '',
                    stuffedAnimal: model.stuffedAnimal ? model.stuffedAnimal : '',
                    isAgreed: model.isAgreed != undefined ? model.isAgreed : true,
                    isApproved: false,
                    role: role ? role : '',
                    addedBy: self.getId(),
                    gender: model.gender ? model.gender : '',
                    lock: {
                        isLocked: false,
                        lastScreen: ''
                    }
                }
            },

            _encodeData: function (data) {
                return CryptoJS.AES.encrypt(data, $rootScope.CryptoJS.AESkey).toString();
            },
            _decodeData: function (data) {
                return CryptoJS.AES.decrypt(data, $rootScope.CryptoJS.AESkey).toString(CryptoJS.enc.Utf8);
            }

        };
    }
]);

app.factory('authorization', ['$rootScope', '$state', 'principal',
    function ($rootScope, $state, principal) {
        return {
            authorize: function () {
                return principal.identity()
                    .then(function () {
                        var isAuthenticated = principal.isAuthenticated();
                        if ($rootScope.toState == $rootScope.fromState)
                            return;
                        //return;
                        if (($rootScope.toState.data && $rootScope.toState.data.roles && $rootScope.toState.data.roles.length < 0)
                            || (!$rootScope.toState.data) || (!$rootScope.toState.data.roles))
                            return;

                        if (!principal.isAgreed()) {
                            console.log('->isAgreed');
                            $state.go('login.accept');
                        }

                        if (principal.isTemporary() && $rootScope.toState.name != 'login.temporary') {
                            console.log('->isTemporary');
                            $state.go('login.temporary');
                        }

                        if (principal.getLock().isLocked && $rootScope.toState.name != 'login.lock') {
                            $state.go('login.lock');
                        }


                        if ($rootScope.toState.data && $rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                            console.log('not aunthenticated to view this page');
                            if (isAuthenticated) {
                                console.log('->app.dashboard');
                                $state.go('app.dashboard');

                            }
                            else {
                                $rootScope.returnToState = $rootScope.toState;
                                $rootScope.returnToStateParams = $rootScope.toStateParams;
                                console.log('->login.signin');

                                $state.go('login.signin');
                            }
                        }
                    }).catch(function (data) {
                        if (($rootScope.toState.data && $rootScope.toState.data.roles && $rootScope.toState.data.roles.length < 0)
                            || (!$rootScope.toState.data) || (!$rootScope.toState.data.roles))
                            return;
                        //if ($rootScope.toState.name == 'login.signin')
                        //    return;
                        console.log('->login.signin');
                        $state.go('login.signin');
                    });
            }
        };
    }
])
