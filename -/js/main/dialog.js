// head {
var __nodeId__ = "std_ui_dialogs__main_dialog";
var __nodeNs__ = "std_ui_dialogs";
// }

window["std_ui_dialogs__main_dialog"] = {

    vectors: {

        create: function (x, y) {
            var node = window["std_ui_dialogs__main_dialog"];

            return {
                x: x,
                y: y,

                getLength: function () {
                    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
                },

                getAxis: function () {
                    return Math.abs(this.h) < Math.abs(this.v) ? 'y' : 'x';
                },

                getDirection: function () {
                    if (Math.abs(this.x) < Math.abs(this.y)) {
                        return this.y > 0 ? 's' : 'n';
                    } else {
                        return this.x > 0 ? 'e' : 'w';
                    }
                },

                getReverseDirection: function () {
                    if (Math.abs(this.x) < Math.abs(this.y)) {
                        return this.y > 0 ? 'n' : 's';
                    } else {
                        return this.x > 0 ? 'w' : 'e';
                    }
                },

                multiple: function (k) {
                    return node.vectors.create(this.x * k, this.y * k);
                },

                add: function (vector) {
                    return node.vectors.create(this.x + vector.x, this.y + vector.y);
                },

                sub: function (vector) {
                    return node.vectors.create(this.x - vector.x, this.y - vector.y);
                },

                invert: function () {
                    return node.vectors.create(-this.x, -this.y);
                }
            };
        },

        get: function (a, b) {
            var node = window["std_ui_dialogs__main_dialog"];

            return node.vectors.create(b[0] - a[0], b[1] - a[1]);
        }
    },

    rects: {

        get: function (left, top, width, height) {
            var node = window["std_ui_dialogs__main_dialog"];

            return {
                left:   left,
                top:    top,
                width:  width,
                height: height,

                getCenter: function () {
                    return [left + width / 2, top + height / 2];
                },

                getCenterVector: function () {
                    return node.vectors.create(this.width / 2, this.height / 2);
                },

                getEnclosingCircleRadius: function () {
                    return this.getCenterVector().getLength();
                }
            };
        }
    },
};

(function (__nodeNs__, __nodeId__) {
    $.widget(__nodeNs__ + "." + __nodeId__, $.ewma.node, {

        options: {

            offsets: {
                normal:  [],
                stashed: []
            },

            pluginOptions: {
                position:      {my: "center", at: "center", of: window},
                blinkOnRender: true
            }
        },

        vectors: {},

        rects: {},

        __create: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            w.vectors = window[__nodeId__].vectors;
            w.rects = window[__nodeId__].rects;

            w.render();
        },

        getDialogOptions: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            return {
                minimized: o.minimized,
                width:     'auto',
                height:    'auto',

                create: function () {
                    w.w('dispatcher').options.focusBlock = true;

                    setTimeout(function () {
                        w.w('dispatcher').options.focusBlock = false;
                    }, 0);

                    if (o.pluginOptions.blinkOnRender) {
                        var $dialog = $w.closest(".ui-dialog");

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
                        var inFocus = o.fullName === w.w('dispatcher').options.inFocus;

                        var focusBlock = w.w('dispatcher').options.focusBlock;

                        if (!inFocus && !focusBlock) {
                            w.w('dispatcher').options.focusBlock = o.fullName;

                            setTimeout(function () {
                                var dragStarted = w.w('dispatcher').options.dragStarted;

                                if (!dragStarted) {
                                    w.touch();
                                }
                            }, 200);
                        }

                        // todo убрать (проследить чтоб коммандер отдавал фокус)
                        w.mr('focus', {
                            container: o.container,
                            name:      o.name
                        });
                    }
                },

                dragStart: function (e, ui) {
                    w.w('dispatcher').options.dragStarted = true;

                    if (o.offset === false) {
                        var left = ui.position.left;
                        var top = ui.position.top;

                        o.offset = [left, top];
                        o.offset_normal = [left, top];
                    }
                },

                dragStop: function (e, ui) {
                    w.w('dispatcher').options.dragStarted = false;

                    var left = ui.position.left;
                    var top = ui.position.top;

                    var ww = $(window).width();
                    var wh = $(window).height();

                    if (e.clientX <= 30 || e.clientX >= ww - 30 || e.clientY <= 0 || e.clientY >= wh - 30) {
                        w._stash();
                    } else {
                        o.state = 'normal';
                        o.offset = [left, top];
                        o.offset_normal = [left, top];

                        o.autofit = false;

                        w.updateOffset();
                    }
                },

                resize: function () { // https://stackoverflow.com/a/35912702
                    var heightPadding = parseInt($(this).css('padding-top'), 10) + parseInt($(this).css('padding-bottom'), 10),
                        widthPadding = parseInt($(this).css('padding-left'), 10) + parseInt($(this).css('padding-right'), 10),
                        titlebarMargin = parseInt($(this).prev('.ui-dialog-titlebar').css('margin-bottom'), 10);

                    $(this).height($(this).parent().height() - $(this).prev('.ui-dialog-titlebar').outerHeight(true) - heightPadding - titlebarMargin);
                    $(this).width($(this).prev('.ui-dialog-titlebar').outerWidth(true) - widthPadding);
                },

                resizeStop: function (e, ui) {
                    o.autofit = false;

                    var left = ui.position.left;
                    var top = ui.position.top;

                    o.offset = [left, top];
                    o.offset_normal = [left, top];

                    w.updateSize();
                },

                close: function () {
                    w.w('dispatcher').options.dragStarted = true;

                    w.r('close', {
                        container: o.container,
                        name:      o.name
                    });

                    w.w('dispatcher').options.dragStarted = false;

                    $(window).unbind("resize." + __nodeId__ + "." + o.name);
                },

                fit: function (e, ui) {
                    var $dialog = ui.element.closest(".ui-dialog");
                    var $contentDiv = $dialog.find(".ui-dialog-content > div");

                    var wh = $(window).height();
                    var ww = $(window).width();

                    var position = $dialog.position();

                    var top = position.top;
                    var left = position.left;
                    var width = $contentDiv.outerWidth();
                    var height = $contentDiv.outerHeight();

                    var setL = left < 20 ? 20 : left;
                    var setT = top < 20 ? 20 : top;

                    var setW = width + setL > ww - 20 ? ww - setL : "auto";
                    var setH = height + setT > wh - 20 ? wh - setT - 20 : "auto";

                    $dialog.css({
                        left:   setL,
                        top:    setT,
                        width:  setW,
                        height: setH
                    });

                    var dialogHeight = $dialog.height();
                    var dialogWidth = $dialog.width();
                    var barHeight = $(".ui-dialog-titlebar", $dialog).height();
                    var contentHeight = dialogHeight - barHeight;

                    $(".ui-dialog-content", $dialog).outerWidth(dialogWidth).outerHeight(contentHeight);

                    o.autofit = true;

                    w.updateSize();
                },


                /*minimize: function (e, ui) {
                    w.r('minimize', {
                        container: o.container,
                        name:      o.name,
                        minimized: ui.options.minimized
                    });
                },*/

                stash: function (e, ui) {
                    w._stash();
                },

                resetSize: function (e, ui) {
                    w.r('resetSize', {
                        container: o.container,
                        name:      o.name
                    });
                }
            };
        },

        render: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            // p(o);

            var $dialog = $w.closest(".ui-dialog");

            if (!$dialog.length) {
                var dispatcher = w.w('dispatcher');

                $dialog = w.renderDialog();

                if (dispatcher.options.tmpStash) {
                    $dialog.hide();
                } else {

                }
            }
        },

        renderDialog: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var dialogOptions = w.getDialogOptions();

            $.extend(dialogOptions, o.pluginOptions);

            $w.ewmaDialog(dialogOptions);

            $w.scrollLeft(o.pluginOptions.scrollLeft).scrollTop(o.pluginOptions.scrollTop);

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

            $dialog = $w.closest(".ui-dialog");

            $dialog.rebind("click." + __nodeId__, function (e) {
                e.stopPropagation();
            });

            if (o.offset) {
                w.renderOffset(o.offset);
            } else {
                $w.ewmaDialog("option", "position", {my: "center", at: "center", of: window});

                $dialog.height("auto").find(".ui-dialog-content").height("auto");
                $dialog.width("auto");

                setTimeout(function () {
                    $w.ewmaDialog("fit");
                });

                setTimeout(function () {
                    var left = $dialog.position().left;
                    var top = $dialog.position().top;

                    o.offset = [left, top];
                    o.offset_normal = [left, top];

                    w.updateOffset();
                });
            }

            if (o.autofit) {
                setTimeout(function () {
                    $w.ewmaDialog("fit");
                });
            }

            if (o.hidden) {
                $dialog.hide();
            }

            /*if (o.minimized) {
                $dialog.addClass("minimized");

                $(".ui-dialog-content", $dialog).hide();
            }*/

            $dialog.addClass(o.class);

            return $dialog;
        },

        get$dialog: function () {
            return this.element.closest(".ui-dialog");
        },

        //

        tmpStashStart: function (duration) {
            var w = this;
            var o = w.options;
            var $w = w.element;

            p('s start');

            if (o.state === 'normal') {
                var positionVector = w.getStashPositionVector();

                // o.state = 'stashed';
                // o.offset = [positionVector.x, positionVector.y];

                w.renderOffset([positionVector.x, positionVector.y], duration === 0 ? 0 : duration || 151);
            }
        },

        tmpStashStop: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            if (o.state === 'normal') {
                w.get$dialog().show();

                w.renderOffset(o.offset_normal, 151);
            }
        },

        revealStart: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            if (o.state === 'stashed') {
                w.renderOffset(o.offset_normal, 151);

                var $dialog = w.get$dialog();

                $dialog.bind("mouseenter." + __nodeId__ + ".reveal", function () {
                    w.w('dispatcher').hoveredDialog = w;
                });

                $dialog.bind("mouseleave." + __nodeId__ + ".reveal", function () {
                    w.w('dispatcher').hoveredDialog = false;
                });
            }
        },

        revealStop: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            if (o.state === 'stashed') {
                var hoveredDialog = w.w('dispatcher').hoveredDialog;

                if (hoveredDialog.uuid === w.uuid) {
                    o.state = 'normal';
                    o.offset = [o.offset_normal[0], o.offset_normal[1]];

                    w.renderOffset(o.offset_normal);
                    w.updateOffset();
                } else {
                    w.renderOffset(o.offset, 151);
                }
            }
        },

        _stash: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            if (o.state === 'normal') {
                var positionVector = w.getStashPositionVector();

                o.state = 'stashed';
                o.offset = [positionVector.x, positionVector.y];

                w.renderOffset(o.offset, 151);

                w.updateOffset();
            }
        },

        getStashPositionVector: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var $window = $(window);
            var $dialog = $w.closest(".ui-dialog");

            var left = $dialog.position().left;
            var top = $dialog.position().top;

            var screenRect = w.rects.get(0, 0, $window.width(), $window.height());
            var dialogRect = w.rects.get(left, top, $dialog.width(), $dialog.height());

            var dialogVector = w.vectors.get(screenRect.getCenter(), dialogRect.getCenter());

            var stashRadius = screenRect.getEnclosingCircleRadius();
            var dialogRadius = dialogRect.getEnclosingCircleRadius();

            var k = (stashRadius + dialogRadius) / dialogVector.getLength();

            var stashVector = dialogVector.multiple(k);

            return screenRect.getCenterVector().add(stashVector).sub(dialogRect.getCenterVector());
        },

        //

        remove: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            $w.ewmaDialog("destroyOverlay");

            var $rendered = w.get$dialog();
            $rendered.remove();

            var $notRendered = $("#dialog__" + o.fullName);
            $notRendered.remove();

            $(window).unbind("resize." + __nodeId__ + "." + o.name);
        },

        //
        //
        //

        updateOffset: function () {
            var w = this;
            var o = w.options;

            w.mr('updateOffset', {
                container:   o.container,
                name:        o.name,
                update_data: {
                    autofit:       o.autofit,
                    state:         o.state,
                    offset:        o.offset,
                    offset_normal: o.offset_normal
                }
            });
        },

        updateSize: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var $dialog = $w.closest(".ui-dialog");

            var heightPadding = parseInt($w.css('padding-top'), 10) + parseInt($w.css('padding-bottom'), 10);

            w.mr('updateSize', {
                container:   o.container,
                name:        o.name,
                update_data: {
                    autofit:       o.autofit,
                    offset:        o.offset,
                    offset_normal: o.offset_normal,
                    width:         Math.ceil($dialog.width()),
                    height:        Math.ceil($dialog.innerHeight() - heightPadding)
                }
            });
        },

        renderOffset: function (position, duration) {
            var w = this;
            var o = w.options;
            var $w = w.element;

            duration = duration || 0;

            var $dialog = $w.closest(".ui-dialog");

            $dialog.stop().animate({
                left: position[0],
                top:  position[1]
            }, duration);
        },

        updateScrollsPositions: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            w.mr('update', {
                container:  o.container,
                name:       o.name,
                updateData: {
                    scrollTop:  $w.scrollTop(),
                    scrollLeft: $w.scrollLeft()
                }
            });
        },

        touch: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            w.mr('update', {
                container: o.container,
                name:      o.name
            });
        }
    });
})(__nodeNs__, __nodeId__);
