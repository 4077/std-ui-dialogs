// head {
var __nodeId__ = "std_ui_dialogs__main_dialog";
var __nodeNs__ = "std_ui_dialogs";
// }

(function (__nodeNs__, __nodeId__) {
    $.widget(__nodeNs__ + "." + __nodeId__, {
        options: {

            pluginOptions: {
                position: {my: "center", at: "center", of: window},

                blinkOnRender: true
            }
        },

        _create: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            w.render();
        },

        _getRendered: function () {
            return $(".ui-dialog[aria-describedby='dialog_" + this.options.fullName + "']");
        },

        render: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var $rendered = w._getRendered();
            var $dispatcher = $(".std_ui_dialogs__main_dispatcher");

            var pluginOptions = o.pluginOptions;

            if (!$rendered.length) {
                var dialogOptions = {
                    minimized: o.minimized,
                    width:     'auto',
                    height:    'auto',

                    create: function () {
                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock", true);

                        setTimeout(function () {
                            $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock", false);
                        }, 0);

                        if (pluginOptions.blinkOnRender) {
                            var $dialog = w._getRendered();

                            var blinks = 2;

                            var blinkIntervalIteration = 0;
                            var blinkInterval = setInterval(function () {
                                blinkIntervalIteration++;

                                $dialog.toggleClass("highlight");

                                if (blinkIntervalIteration > blinks * 2 - 1) {
                                    clearInterval(blinkInterval);
                                }
                            }, 50);
                        }
                    },

                    focus: function () {
                        if (!ewma.cancelFollow) {
                            var inFocus = o.fullName === $dispatcher.std_ui_dialogs__main_dispatcher("option", "inFocus");

                            // p(inFocus);

                            var focusBlock = $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock");

                            if (!inFocus && !focusBlock) {
                                $dispatcher.std_ui_dialogs__main_dispatcher("option", "inFocus", o.fullName);

                                setTimeout(function () {
                                    var dragStarted = $dispatcher.std_ui_dialogs__main_dispatcher("option", "dragStarted");

                                    if (!dragStarted) {
                                        w.touch();
                                    }
                                }, 200);
                            }

                            // todo убрать (проследить чтоб коммандер отдавал фокус)
                            ewma.multirequest.add(o.paths.focus, {
                                container: o.container,
                                name:      o.name
                            });
                        }
                    },

                    dragStart: function (e, ui) {
                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "dragStarted", true);
                    },

                    dragStop: function () {
                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "dragStarted", false);

                        w.updateOffset();
                    },

                    resize: function () { // https://stackoverflow.com/a/35912702
                        var heightPadding = parseInt($(this).css('padding-top'), 10) + parseInt($(this).css('padding-bottom'), 10),
                            widthPadding = parseInt($(this).css('padding-left'), 10) + parseInt($(this).css('padding-right'), 10),
                            titlebarMargin = parseInt($(this).prev('.ui-dialog-titlebar').css('margin-bottom'), 10);

                        $(this).height($(this).parent().height() - $(this).prev('.ui-dialog-titlebar').outerHeight(true) - heightPadding - titlebarMargin);
                        $(this).width($(this).prev('.ui-dialog-titlebar').outerWidth(true) - widthPadding);
                    },

                    resizeStop: function () {
                        w.updateSize();
                    },

                    close: function () {
                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock", true);

                        request(o.paths.close, {
                            container: o.container,
                            name:      o.name
                        });

                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock", false);

                        $(window).unbind("resize." + __nodeId__ + "." + o.name);
                    },

                    minimize: function (e, ui) {
                        request(o.paths.minimize, {
                            container: o.container,
                            name:      o.name,
                            minimized: ui.options.minimized
                        });
                    },

                    resetSize: function (e, ui) {
                        request(o.paths.resetSize, {
                            container: o.container,
                            name:      o.name
                        });
                    }
                };

                $.extend(dialogOptions, pluginOptions);

                $w.ewmaDialog(dialogOptions);

                var $dialog = $w.closest(".ui-dialog");

                $w.scrollLeft(pluginOptions.scrollLeft).scrollTop(pluginOptions.scrollTop);

                setTimeout(function () {
                    var scrollTimeout;

                    $w.unbind("scroll");
                    $w.rebind("scroll." + __nodeId__, function () {
                        if (scrollTimeout) {
                            clearTimeout(scrollTimeout);
                        }

                        scrollTimeout = setTimeout(function () {
                            w.updateScrollsPositions();
                        }, 400);
                    });
                });

                $dialog.rebind("click." + __nodeId__, function (e) {
                    e.stopPropagation();
                });

                if (pluginOptions.center) {
                    $(window).rebind("resize." + __nodeId__ + "." + o.name, function () {
                        $w.ewmaDialog("option", "position", {my: "center", at: "center", of: window});
                    });
                } else {
                    if (pluginOptions.offset) {
                        $dialog.css({
                            left: pluginOptions.offset[0] + $(window).scrollLeft(),
                            top:  pluginOptions.offset[1] + $(window).scrollTop()
                        });
                    }
                }

                if (o.hidden) {
                    $dialog.hide();
                }

                if (o.minimized) {
                    $dialog.addClass("minimized");

                    $(".ui-dialog-content", $dialog).hide();
                }

                $dialog.addClass(o.class);
            }
        },

        setPosition: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var $dialog = $w.closest(".ui-dialog");
            var pluginOptions = o.pluginOptions;

            if (pluginOptions.center) {
                $(window).rebind("resize." + __nodeId__ + "." + o.name, function () {
                    $w.ewmaDialog("option", "position", {my: "center", at: "center", of: window});
                });
            } else {
                if (pluginOptions.offset) {
                    $dialog.css({
                        left: pluginOptions.offset[0] + $(window).scrollLeft(),
                        top:  pluginOptions.offset[1] + $(window).scrollTop()
                    });
                }
            }
        },

        remove: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            $w.ewmaDialog("destroyOverlay");

            var $rendered = this._getRendered();
            $rendered.remove();

            var $notRendered = $("#dialog__" + o.fullName);
            $notRendered.remove();

            $(window).unbind("resize." + __nodeId__ + "." + o.name);
        },

        updateOffset: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var $wrapper = $w.closest(".ui-dialog");
            var offset = $wrapper.offset();

            request(this.options.paths.update, {
                container:  o.container,
                name:       o.name,
                updateData: {
                    offset: [
                        Math.round(offset.left - $(window).scrollLeft()),
                        Math.round(offset.top - $(window).scrollTop())
                    ]
                }
            }, null, true);
        },

        updateSize: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var $wrapper = $w.closest(".ui-dialog");

            var heightPadding = parseInt($w.css('padding-top'), 10) + parseInt($w.css('padding-bottom'), 10);

            request(this.options.paths.update, {
                container:  o.container,
                name:       o.name,
                updateData: {
                    width:  Math.ceil($wrapper.width()),
                    height: Math.ceil($wrapper.innerHeight() - heightPadding) // почему только вертикальный
                }
            }, null, true);
        },

        updateScrollsPositions: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            request(this.options.paths.update, {
                container:  o.container,
                name:       o.name,
                updateData: {
                    scrollTop:  $w.scrollTop(),
                    scrollLeft: $w.scrollLeft()
                }
            }, null, true);
        },

        touch: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            request(this.options.paths.update, {
                container: o.container,
                name:      o.name
            }, null, true);
        }
    });
})(__nodeNs__, __nodeId__);
