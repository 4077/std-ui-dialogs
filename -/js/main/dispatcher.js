// head {
var __nodeId__ = "std_ui_dialogs__main_dispatcher";
var __nodeNs__ = "std_ui_dialogs";
// }

(function (__nodeNs__, __nodeId__) {
    $.widget(__nodeNs__ + "." + __nodeId__, {
        options: {},

        _create: function () {

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
