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
            var widget = this;

            widget.render();
        },

        _getRendered: function () {
            return $(".ui-dialog[aria-describedby='dialog_" + this.options.fullName + "']");
        },

        render: function () {
            var widget = this;
            var $widget = this.element;

            var $rendered = widget._getRendered();
            var $dispatcher = $(".std_ui_dialogs__main_dispatcher");

            var pluginOptions = widget.options.pluginOptions;

            if (!$rendered.length) {
                // $widget.attr("title", widget.options.title || pluginOptions.title);

                var dialogOptions = {
                    minimized: widget.options.minimized,
                    width:     'auto',
                    height:    'auto',

                    create: function () {
                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock", true);

                        setTimeout(function () {
                            $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock", false);
                        }, 0);

                        if (pluginOptions.blinkOnRender) {
                            var $dialog = widget._getRendered();

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
                            var inFocus = widget.options.fullName == $dispatcher.std_ui_dialogs__main_dispatcher("option", "inFocus");
                            var focusBlock = $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock");

                            if (!inFocus && !focusBlock) {
                                $dispatcher.std_ui_dialogs__main_dispatcher("option", "inFocus", widget.options.fullName);

                                setTimeout(function () {
                                    var dragStarted = $dispatcher.std_ui_dialogs__main_dispatcher("option", "dragStarted");

                                    if (!dragStarted) {
                                        widget.touch();
                                    }
                                }, 200);
                            }

                            ewma.multirequest.add(widget.options.paths.focus, {
                                container: widget.options.container,
                                name:      widget.options.name
                            });
                        }
                    },

                    dragStart: function (e, ui) {
                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "dragStarted", true);

                        // $widget.parent().css({opacity: 0.8});
                    },

                    dragStop: function () {
                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "dragStarted", false);

                        widget.updateOffset();
                        // $widget.parent().css({opacity: 1});
                    },

                    resize: function () { // https://stackoverflow.com/a/35912702
                        var heightPadding = parseInt($(this).css('padding-top'), 10) + parseInt($(this).css('padding-bottom'), 10),
                            widthPadding = parseInt($(this).css('padding-left'), 10) + parseInt($(this).css('padding-right'), 10),
                            titlebarMargin = parseInt($(this).prev('.ui-dialog-titlebar').css('margin-bottom'), 10);

                        $(this).height($(this).parent().height() - $(this).prev('.ui-dialog-titlebar').outerHeight(true) - heightPadding - titlebarMargin);
                        $(this).width($(this).prev('.ui-dialog-titlebar').outerWidth(true) - widthPadding);
                    },

                    resizeStop: function () {
                        widget.updateSize();
                    },

                    close: function () {
                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock", true);

                        request(widget.options.paths.close, {
                            container: widget.options.container,
                            name:      widget.options.name
                        });

                        $dispatcher.std_ui_dialogs__main_dispatcher("option", "focusBlock", false);

                        $(window).unbind("resize." + __nodeId__ + "." + widget.options.name);
                    },

                    minimize: function (e, ui) {
                        request(widget.options.paths.minimize, {
                            container: widget.options.container,
                            name:      widget.options.name,
                            minimized: ui.options.minimized
                        });
                    },

                    resetSize: function (e, ui) {
                        request(widget.options.paths.resetSize, {
                            container: widget.options.container,
                            name:      widget.options.name
                        });
                    }
                };

                $.extend(dialogOptions, pluginOptions);

                $widget.ewmaDialog(dialogOptions);

                var $dialog = $widget.closest(".ui-dialog");

                $widget.scrollLeft(pluginOptions.scrollLeft).scrollTop(pluginOptions.scrollTop);

                setTimeout(function () {
                    var scrollTimeout;

                    $widget.unbind("scroll");
                    $widget.rebind("scroll." + __nodeId__, function () {
                        if (scrollTimeout) {
                            clearTimeout(scrollTimeout);
                        }

                        scrollTimeout = setTimeout(function () {
                            widget.updateScrollsPositions();
                        }, 400);
                    });
                });

                $dialog.rebind("click." + __nodeId__, function (e) {
                    e.stopPropagation();
                });

                if (pluginOptions.center) {
                    $(window).rebind("resize." + __nodeId__ + "." + widget.options.name, function () {
                        $widget.ewmaDialog("option", "position", {my: "center", at: "center", of: window});
                    });
                } else {
                    if (pluginOptions.offset) {
                        // ewma.console('scrollLeft: ' + $(window).scrollLeft());
                        // ewma.console('scrollTop: ' + $(window).scrollTop());

                        $dialog.css({
                            left: pluginOptions.offset[0] + $(window).scrollLeft(),
                            top:  pluginOptions.offset[1] + $(window).scrollTop()
                        });
                    }
                }

                if (widget.options.hidden) {
                    $dialog.hide();
                }

                if (widget.options.minimized) {
                    $dialog.addClass("minimized");

                    $(".ui-dialog-content", $dialog).hide();
                }

                $dialog.addClass(widget.options.class);
            }
        },

        setPosition: function () {
            var widget = this;
            var $widget = widget.element;
            var $dialog = $widget.closest(".ui-dialog");
            var pluginOptions = widget.options.pluginOptions;

            if (pluginOptions.center) {
                $(window).rebind("resize." + __nodeId__ + "." + widget.options.name, function () {
                    $widget.ewmaDialog("option", "position", {my: "center", at: "center", of: window});
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
            var widget = this;

            widget.element.ewmaDialog("destroyOverlay");

            var $rendered = this._getRendered();

            $rendered.remove();

            var $notRendered = $("#dialog__" + this.options.fullName);

            $notRendered.remove();

            $(window).unbind("resize." + __nodeId__ + "." + this.options.name);
        },

        updateOffset: function () {
            var widget = this;

            var $wrapper = widget.element.closest(".ui-dialog");
            var offset = $wrapper.offset();

            request(this.options.paths.update, {
                container:  widget.options.container,
                name:       widget.options.name,
                updateData: {
                    offset: [
                        Math.round(offset.left - $(window).scrollLeft()),
                        Math.round(offset.top - $(window).scrollTop())
                    ]
                }
            }, null, true);
        },

        updateSize: function () {
            var widget = this;

            var $wrapper = widget.element.closest(".ui-dialog");
            var offset = $wrapper.offset();

            var heightPadding = parseInt($(widget.element).css('padding-top'), 10) + parseInt($(widget.element).css('padding-bottom'), 10);

            request(this.options.paths.update, {
                container:  widget.options.container,
                name:       widget.options.name,
                updateData: {
                    // offset: [
                    //     Math.round(offset.left - $(window).scrollLeft()),
                    //     Math.round(offset.top - $(window).scrollTop())
                    // ],
                    width:  Math.ceil($wrapper.width()),
                    height: Math.ceil($wrapper.innerHeight() - heightPadding) // почему только вертикальный
                }
            }, null, true);
        },

        updateScrollsPositions: function () {
            var widget = this;

            request(this.options.paths.update, {
                container:  widget.options.container,
                name:       widget.options.name,
                updateData: {
                    scrollTop:  $(widget.element).scrollTop(),
                    scrollLeft: $(widget.element).scrollLeft()
                }
            }, null, true);
        },

        touch: function () {
            var widget = this;

            request(this.options.paths.update, {
                container: widget.options.container,
                name:      widget.options.name
            }, null, true);
        }
    });
})(__nodeNs__, __nodeId__);
