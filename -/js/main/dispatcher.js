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

            w.render();
            w.bindKeyboard();
        },

        hoveredDialog: false,

        render: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            /*setTimeout(function () {
                if (o.tmpStash) {
                    w.each(function ($dialog) {
                        $dialog.tmpStashStart(0);
                    });
                }
            });*/
        },

        bindKeyboard: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

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

                    if (e.which === 68) { // d
                        w._setTmpStash(!o.tmpStash);

                        w.each(function ($dialog) {
                            if (o.tmpStash) {
                                $dialog.tmpStashStart();
                            } else {
                                $dialog.tmpStashStop();
                            }
                        });
                    }
                }
            });

            $body.bind("keyup." + __nodeId__, function (e) {
                if (e.which === 87) { // w
                    w.each(function ($dialog) {
                        $dialog.revealStop();
                    });
                }

                if (e.which === 83) { // s
                    // w.fitStop();
                }

                if (e.which === 68) { // d
                    if (Date.now() - keydownTime > 250) {
                        w.each(function ($dialog) {
                            $dialog.tmpStashStop();
                        });

                        w._setTmpStash(false);
                    } else {
                        w.r('updateTmpStash', {
                            enabled: o.tmpStash
                        });
                    }
                }

                keydownTime = false;
            });
        },

        tmpStashToggle: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            w._setTmpStash(!o.tmpStash);

            w.each(function ($dialog) {
                if (o.tmpStash) {
                    $dialog.tmpStashStart();
                } else {
                    $dialog.tmpStashStop();
                }
            });

            w.r('updateTmpStash', {
                enabled: o.tmpStash
            });

            return o.tmpStash;
        },

        _setTmpStash: function (value) {
            var w = this;
            var o = w.options;
            var $w = w.element;

            o.tmpStash = value;

            ewma.trigger('std/ui/dialogs/tmpStashToggle', {
                enabled: o.tmpStash
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
