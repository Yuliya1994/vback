app.directive('confirm', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $elm.on('click', function() {
                var elm = $('div[data-vac="'+atrs.confirm+'"]');
                var td = null;
                elm.each(function() {
                    td = $(this).parents().eq(3);

                    if($(td).is('span')){
                        td = $(this).parents().eq(4);
                    }

                    if(!atrs.manager) {
                        $(td).attr('class', 'rangeAccepted');
                    } else {
                        $(td).attr('class', 'rangeApproved');
                    }
                });
            });

        }
    };
});

app.directive('refuse', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $elm.on('click', function() {
                var elm = $('div[data-vac="'+atrs.refuse+'"]');
                var td = null;
                elm.each(function() {
                    td = $(this).parents().eq(3);

                    if($(td).is('span')){
                        td = $(this).parents().eq(4);
                    }

                    if(!atrs.manager) {
                        $(td).attr('class', 'rangeRefused');
                    } else {
                        $(td).attr('class', 'rangeDeclined');
                    }
                });
            });

        }
    };
});

app.directive('scrollOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $elm.on('click', function() {
                var target = $('.table-calendar');
                var shift = 0;
                var prevPos = atrs.target-1 < 0 ? 0 : atrs.target-1;

                for(var i = 0; i < (prevPos); i++) {
                    shift += target[i].clientWidth;
                    if(i > 3) shift+=20;
                }

                $(".swipe-area").animate({scrollLeft: shift}, "slow");


            });
        }
    }
});


app.directive('startPosition', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $(document).ready(function() {
                setTimeout(function() {
                    var target = $('.table-calendar');
                    var shift = 0;


                    for(var i = 0; i < (atrs['startPosition'] - 1); i++) {
                        console.log(i);
                        shift += target[i].clientWidth;
                        if(i > 3) shift+=20;
                    }

                    $(".swipe-area").animate({scrollLeft: shift}, "slow");

                }, 2000)

            });
        }
    };
});

app.directive('fillWithColor', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            var td = $($elm).parents().eq(3);

            if($(td).is('span')){
                td = $($elm).parents().eq(4);
            }

            var tdClass = null;

            var states = {
                active: "rangeActive",
                refused: "rangeRefused",
                empty: "rangeEmpty",
                accepted: "rangeAccepted",

                approved: "rangeApproved",
                declined: "rangeDeclined"
            };

            switch (atrs.td) {
                case '0':
                    tdClass = states.active;
                    break;

                case '1':
                    tdClass = states.accepted;
                    break;

                case '2':
                    tdClass = states.refused;
                    break;

                case '10':
                    tdClass = states.approved;
                    break;

                case '11':
                    tdClass = states.declined;
                    break;
            }

            td.attr('class', tdClass);
            td.css({
                'border-right': 'none',
                'border-left': 'none'
            });

            td.on('click', function() {
                $elm.triggerHandler("click");
            });
        }
    };
});

app.directive('horizontalScroll', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, atrs) {
            $(".swipe-area").mousewheel(function(event, delta) {
                this.scrollLeft -= (delta * 30);
                event.preventDefault();

            });

        }
    };
});



