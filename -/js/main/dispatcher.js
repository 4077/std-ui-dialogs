// head {
var __nodeId__ = "std_ui_dialogs__main_dispatcher";
var __nodeNs__ = "std_ui_dialogs";
// }

(function (__nodeNs__, __nodeId__) {
    $.widget(__nodeNs__ + "." + __nodeId__, $.ewma.node, {
        options: {},

        __create: function () {
            var w = this;

            $("input, textarea").bind("keydown." + __nodeId__ + " keyup." + __nodeId__, function (e) {
                e.stopPropagation();
            });

            w.bindKeyboard();
        },

        showOutsideDialogsMode: false,

        hoveredDialog: false,

        bindKeyboard: function () {
            var w = this;

            var $body = $("body");

            var keydownTime;

            $body.bind("keydown." + __nodeId__, function (e) {
                if (!keydownTime) {
                    keydownTime = Date.now();

                    if (e.which === 87) { // w
                        w.each(function ($dialog) {
                            $dialog.revealStart();
                        });
                    }

                    if (e.which === 83) { // s
                        // w.fitStart();
                    }
                }
            });

            $body.bind("keyup." + __nodeId__, function (e) {
                // if (Date.now() - keydownTime > 250) {
                if (e.which === 87) { // w
                    w.each(function ($dialog) {
                        $dialog.revealStop();
                    });
                }

                if (e.which === 83) { // s
                    // w.fitStop();
                }

                keydownTime = false;
                /*} else {
                    if (e.which === 87) { // w
                        w.each(function ($dialog) {
                            $dialog.stash(true);
                        });
                    }
                }*/
            });
        },

        fitStart: function () {
            var left, top, right, bottom;
            var lefts = [], tops = [], rights = [], bottoms = [];

            $(".std_ui_dialogs__main_dialog").each(function () {
                var wDialog = $(this).std_ui_dialogs__main_dialog("instance");

                lefts.push(wDialog.options.offset[0]);
                tops.push(wDialog.options.offset[1]);
                rights.push(wDialog.options.offset[0] + wDialog.element.width());
                bottoms.push(wDialog.options.offset[1] + wDialog.element.height());
            });

            left = Math.min.apply(Math, lefts);
            top = Math.min.apply(Math, tops);
            right = Math.max.apply(Math, rights);
            bottom = Math.max.apply(Math, bottoms);

            var stashWidth = right - left;
            var stashHeight = bottom - top;

            var stashMax = Math.max(stashWidth, stashHeight);
            var screenMin = Math.min($(window).width(), $(window).height());

            var scale = screenMin / stashMax;

            $(".std_ui_dialogs__main__container").css({
                transform: "scale(" + scale + ")"
            });
        },

        fitStop: function () {
            $(".std_ui_dialogs__main__container").css({transform: "scale(1)"});
        },

        each: function (handler) {
            $(".std_ui_dialogs__main_dialog").each(function () {
                handler($(this).std_ui_dialogs__main_dialog("instance"));
            });
        },

        arrange: function () {
            var touches = [];

            $(".std_ui_dialogs__main_dialog").each(function () {
                touches.push($(this).attr("touch"));
            });

            var sortedTouches = touches.sort();

            for (var i in sortedTouches) {
                var touch = sortedTouches[i];

                $(".std_ui_dialogs__main_dialog[touch='" + touch + "']").ewmaDialog("moveToTop");
            }
        },

        renderPositions: function () {
            $(".std_ui_dialogs__main_dialog").each(function () {
                $(this).std_ui_dialogs__main_dialog("setPosition");
            });
        }
    });
})(__nodeNs__, __nodeId__);
