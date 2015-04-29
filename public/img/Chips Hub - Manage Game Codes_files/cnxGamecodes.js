'use strict';
/**

 **/

var app = angular.module("clipApp");


app.directive('cnxGamecodes', function ($firebaseArray, SweetAlert, gamecodes, $filter) {
    function link(scope, element, attributes) {
        var ref = new Firebase("https://incandescent-inferno-2742.firebaseio.com/GemeCodes");
        var syncArray = $firebaseArray(ref);


        var uid = attributes.uid;
        scope.uid = uid;

        var active = attributes.active;
        scope.active = active === '';

        scope.online = attributes.online === '';

        console.log('online', scope.online);

        var noform = attributes.noform;
        scope.noform = noform === '';

        scope.activeCodes = null;
        scope.rangeObj = {startDate: null, endDate: null};

        //Method executes on 60th line to init GameCodes list.
        //Also when agent changes 'Created On' || 'Last Used' input to filter data
        //Later this will be changed
        var getActiveCodes = function (range) {
            var tempCodes = [];
            scope.activeCodes = [];

            //console.log(attributes);

            gamecodes.getActiveGamecodes()
                .then(function (codes) {
                    tempCodes = codes;

                    if (uid && uid != '') {
                        console.log('filter: ' + uid);
                        tempCodes = $filter('filter')(tempCodes, {agentId: uid});
                    }

                    //if (active || active==='') {
                    //    console.log('filter: ' + active);
                    //    tempCodes = $filter('filter')(tempCodes, {IsDisabled: false});
                    //}

                    return codes;
                })
                .then(function (codes) {

                    if (range.startDate !== null || range.endDate !== null) {
                        tempCodes.forEach(function (code) {
                            if (range.startDate !== null && range.endDate === null) {
                                if (code.createdOn >= range.startDate.getTime()) {
                                    scope.activeCodes.push(code);
                                }
                            } else if (range.startDate === null && range.endDate !== null) {
                                if (code.LastUsed <= range.endDate.getTime()) {
                                    scope.activeCodes.push(code);
                                }
                            } else if (range.startDate !== null && range.endDate !== null) {
                                if (code.LastUsed <= range.endDate.getTime() && code.createdOn >= range.startDate.getTime()) {
                                    scope.activeCodes.push(code);
                                }
                            }
                        });

                    } else {
                        scope.activeCodes = tempCodes;
                    }

                });
        };

        //Init
        getActiveCodes(scope.rangeObj);

        //Input watchers
        scope.$watch('rangeObj.startDate', function () {
            //console.log(scope.rangeObj);
            getActiveCodes(scope.rangeObj);
        });

        scope.$watch('rangeObj.endDate', function () {
            //console.log(scope.rangeObj);
            getActiveCodes(scope.rangeObj);
        });


        scope.disableCode = function (code) {
            SweetAlert.swal({
                title: "Are you sure you want to disable code " + code.$id + "?",
                text: "If you disable the code the user will not be able to use it",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, disable it!",
                closeOnConfirm: false
            }, function (isConfirm) {

                if (isConfirm) {
                    gamecodes.disableCode(code);
                    SweetAlert.swal("Code " + code.$id + " has been disabled!");
                }
            });
        };

        scope.createCode = function (amount, password) {
            gamecodes.createCode(amount, 'usd', password)
                .then(function (code) {
                    SweetAlert.swal("Good job!", "You have just created code# " + code.key() + "", "success");
                })
                .catch(function (error) {
                    SweetAlert.swal("Something wrong!", error.message, "error");
                });
        }
    }

    return {
        restrict: 'EA',
        link: link,
        scope: {},
        templateUrl: 'chips/directives/templates/gameCodes.html'
    };
});
