app.factory('gamecodes', ['$rootScope',
    '$q', '$http', '$timeout', '$firebaseAuth', "$firebaseObject", '$filter', '$firebaseArray', 'principal',
    function ($rootScope, $q, $http, $timeout, $firebaseAuth, $firebaseObject, $filter, $firebaseArray, principal) {
        var ref = new Firebase("https://havana.firebaseio.com/");
        var gamecodeRef = new Firebase("https://havana.firebaseio.com/Gamecodes");
        var gamecodes = $firebaseArray(gamecodeRef);

        var timeFormat = '';

        var currency = {
            'usd': 100
            // ...
        };

        return {
            loadedCodes: function () {
                var deferred = $q.defer();
                var self = this;
                return gamecodes.$loaded();


                if (angular.isDefined(_identity) && _identity != null) {
                    deferred.resolve(_identity);
                } else if (authData) {
                    var usr = new Firebase("https://havana.firebaseio.com/Users/" + authData.uid);
                    var obj = $firebaseObject(usr);
                    obj.$loaded().then(function () {
                        if (obj.email == null) {
                            deferred.reject({message: 'Account is missing!'});
                            self.logout();
                        } else if (_login && _login.password && _login.password.isTemporaryPassword) {
                            deferred.reject({message: 'Password is temporary! Relogin is required!'});
                            self.logout();
                        }
                        else if (!obj.isApproved) {
                            deferred.reject({message: 'Account is not approved!'});
                            self.logout();
                        } else {
                            _identity = obj;
                            _authenticated = true;
                            _login = authData;
                            deferred.resolve(obj);
                        }
                    });
                } else if (email && pass) {
                    _loginInfo = {
                        email: email,
                        password: pass
                        //TODO: I dont know why.
                        //remember: remember ? 'none' : 'sessionOnly'
                    };
                    auth.$authWithPassword(_loginInfo)
                        .then(function (data) {
                            console.log(data);
                            var usr = new Firebase("https://havana.firebaseio.com/Users/" + data.uid);
                            var obj = $firebaseObject(usr);
                            obj.$loaded().then(function () {
                                if (obj.email == null) {
                                    deferred.reject({message: 'Account is missing!'});
                                    self.logout();
                                } else if (!obj.isApproved) {
                                    self.logout();
                                    deferred.reject({message: 'Account is not approved!'});
                                } else {
                                    _identity = obj;
                                    _authenticated = true;
                                    _login = data;
                                    deferred.resolve(obj);
                                }
                            });
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
            getGamecodes: function () {
                return gamecodes;
            },

            useCode: function (codeId, password, gameId) {
                var deferred = $q.defer();
                var self = this;

                var ref = new Firebase("https://havana.firebaseio.com/Gamecodes/" + codeId);
                var obj = $firebaseObject(ref);
                obj.$loaded().then(function (data) {
                    if (self._decodeData(data.password) == password) {

                        if (data.IsDisabled || (data.currentValue <= 0)) {
                            self.disableCode(data);
                            deferred.reject({message: 'Code is disabled!'})
                        } else if (data.usedById && data.usedById != '') {
                            deferred.reject({message: 'Code is already in use!'})
                        } else {
                            data.usedById = principal.getId();
                            data.usedByGame = gameId ? gameId : '';
                            data.$save();
                            deferred.resolve(data);
                        }
                    } else {
                        deferred.reject({message: 'Wrong password!'});
                    }
                });
                return deferred.promise;
            },

            releaseCode: function (code) {
                var deferred = $q.defer();
                var self = this;

                var ref = new Firebase("https://havana.firebaseio.com/Gamecodes/" + codeId);
                var obj = $firebaseObject(ref);
                obj.$loaded().then(function (data) {
                    if (data.usedById && data.usedById == principal.getId()) {
                        data.usedById = '';
                        data.usedByGame = '';
                        if (data.currentValue <= 0) {
                            data.IsDisabled = true;
                        }
                        data.$save();
                        deferred.resolve(data);
                    } else {
                        deferred.reject({message: 'Used by another user!'});
                    }
                });


                return deferred.promise;
            },

            //alias for getGameCodes(). Now filtering is in chips/directives/templates/gameCodes.html, line 17
            //VCM-8
            getActiveGamecodes: function () {
                return gamecodes.$loaded();
            },

            convertToCredits: function (amount, curr) {
                var multiplier = currency[curr];
                var credits = amount;
                if (multiplier)
                    credits *= multiplier;

                return credits;
            },

            createCode: function (amount, currency, password) {
                var deferred = $q.defer();
                var id = Math.uuid(7)
                var code = new Firebase("https://havana.firebaseio.com/Gamecodes/" + id);
                var obj = $firebaseObject(code);
                var credits = this.convertToCredits(amount, currency);
                var x = this._getEntity({credits: credits, password: password});
                obj.$loaded()
                    .then(function (data) {
                        if (data && data.agentId) {
                            //if record exists
                            deferred.reject({message: 'Try again later'});
                        } else {
                            code.set(x)
                            deferred.resolve(code);
                        }
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    })

                //return code.set(x);
                //return gamecodes.$add(x);

                return deferred.promise;
            },

            getCodesByMonths: function () {
                var deferred = $q.defer();
                var now = new Date();
                var self = this;
                this.getActiveGamecodes()
                    .then(function (codes) {
                        var years = [];
                        var month = [];
                        for (var i = 0; i < 12; i++) {
                            month.push([]);
                        }
                        codes.forEach(function (code) {
                            if (self._getTimeFromStamp(code.createdOn).getFullYear() == now.getFullYear()) {
                                years.push(code);
                            }
                        });

                        years.forEach(function (code) {
                            var m = self._getTimeFromStamp(code.createdOn).getMonth();
                            month[m].push(code);
                        });

                        deferred.resolve(month);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            getValuesByMonths: function () {
                var deferred = $q.defer();

                this.getCodesByMonths()
                    .then(function (arr) {
                        var data = [];

                        for (var i = 0; i < arr.length; i++) {
                            var m = arr[i];
                            var div = m.length;
                            if (div == 0) {
                                data.push({
                                    curr: 0,
                                    origin: 0
                                });
                                continue;
                            }
                            var origin = 0;
                            var current = 0;
                            m.forEach(function (code) {
                                current += code.currentValue;
                                origin += code.originalValue;
                            });
                            data.push({
                                //curr: current / div,
                                //origin: origin / div

                                curr: current,
                                origin: origin
                            });
                        }
                        deferred.resolve(data);

                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    })

                return deferred.promise;
            },

            disableCode: function (code) {
                code.IsDisabled = true;
                if (code.currentValue == 0) {
                    code.IsDisabled = true;
                }
                code.usedById = code.usedByGame = '';

                gamecodes.$save(code).then(function (gc) {
                    console.log(gc);
                });
            },

            _getEntity: function (model) {
                var self = this;
                var passEncoded = model.password;
                if (passEncoded && passEncoded != '') {
                    passEncoded = this._encodeData(passEncoded);
                }
                return {
                    agentId: principal.getId(),
                    password: passEncoded,
                    originalValue: model.credits ? model.credits : 0,
                    currentValue: model.credits ? model.credits : 0,

                    IsDisabled: false,
                    LastUsed: self._getCurrentStamp(),
                    createdOn: self._getCurrentStamp(),
                    Status: "Ready",
                    //PhoneNum: "9-(883)921-3851",
                    Sessions: [
                        {
                            //    amount: "+810",
                            //    gameid: "5512171c4d6f6314fa109500",
                            //    geoLocation: [
                            //        {
                            //            lat: "40.4344",
                            //            long: "-80.0248"
                            //        },
                            //        {
                            //            lat: "54.61935",
                            //            long: "17.3723"
                            //        }
                            //    ],
                            //    ip: self._getIpAddress(),
                            //    length: 0,
                            //    results: '',
                            //    timeStamp : self._getCurrentStamp()
                        }
                    ],
                    usedById: '',
                    usedByGame: ''

                };
            },

            _getTimeFromStamp: function (stamp) {
                //probably is wrong
                return new Date(stamp);
            },

            _getStampFromTime: function (time) {
                return time;
            },

            _getCurrentTime: function () {
                return Date.now();
            },

            _getCurrentStamp: function () {
                return this._getStampFromTime(Date.now());
            },

            _getIpAddress: function () {
                var ip = '';
                $.ajax({
                    url: "http://jsonip.com?callback=?",
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        try {
                            ip = data.ip;
                        } catch (e) {
                            ip = '';
                        }
                    }
                });
                return ip;
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

app.filter('toLocale', function () {
    return function (item) {
        return new Date(item).toLocaleString()
    };
});
