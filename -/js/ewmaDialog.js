$.widget("ewma.ewmaDialog", $.ui.dialog, {
    options: {
        minWidth:  0,
        minHeight: 0
    },

    _create: function () {
        $.ui.dialog.prototype._create.call(this);
    },

    _setOption: function () {
        $.ui.dialog.prototype._setOption.apply(this, arguments);
    },

    _moveToTop: function (event) {
        var moved = false,
            zIndices = $(".ui-dialog").map(function () {
                return +$(this).css("z-index");
            }).get(),
            zIndexMax = Math.max.apply(null, zIndices);

        if (zIndexMax >= +this.uiDialog.css("z-index")) {
            this.uiDialog.css("z-index", zIndexMax + 2);

            var overlay = $(".ui-widget-overlay[uuid='" + this.uuid + "']");

            overlay.css("z-index", zIndexMax + 1);

            moved = true;
        }

        this._trigger("focus", event);

        return moved;
    },

    _makeDraggable: function () {
        var that = this,
            options = this.options;

        function filteredUi(ui) {
            return {
                position: ui.position,
                offset:   ui.offset
            };
        }

        this.uiDialog.draggable({
            // containment: "document",
            handle: ".ui-dialog-titlebar",
            start:  function (event, ui) {
                that._addClass($(this), "ui-dialog-dragging");
                that._blockFrames();
                that._trigger("dragStart", event, filteredUi(ui));
            },
            drag:   function (event, ui) {
                that._trigger("drag", event, filteredUi(ui));
            },
            stop:   function (event, ui) {
                var left = ui.offset.left - that.document.scrollLeft(),
                    top = ui.offset.top - that.document.scrollTop();

                options.position = {
                    my: "left top",
                    at: "left" + (left >= 0 ? "+" : "") + left + " " +
                            "top" + (top >= 0 ? "+" : "") + top,
                    of: that.window
                };
                that._removeClass($(this), "ui-dialog-dragging");
                that._unblockFrames();
                that._trigger("dragStop", event, filteredUi(ui));
            }
        });
    },

    _createTitlebar: function () {
        var $titlebar = $("<div>").addClass("ui-dialog-titlebar ui-widget-header");

        var $buttons = $("<div>").addClass("buttons").appendTo($titlebar);

        var $minimizeButton = $("<div>").addClass("button minimize")
            .append($("<div>").addClass("icon fa fa-window-minimize"))
            .appendTo($buttons);

        var $sizeResetButton = $("<div>").addClass("button size_reset")
            .append($("<div>").addClass("icon fa fa-circle"))
            .appendTo($buttons);

        var $closeButton = $("<div>").addClass("button close")
            .append($("<div>").addClass("icon fa fa-close"))
            .appendTo($buttons);

        var dialog = this;

        $minimizeButton.click(function () {
            dialog._trigger("stash", event, this);
        });

        $titlebar.on("dblclick", function () {
            dialog.fit();
        });

        $sizeResetButton.click(function () {
            dialog.fit();
        });

        $closeButton.click(function () {
            dialog.close();
        });

        $titlebar.prependTo(this.uiDialog);

        var $title = $("<div>").addClass("title").uniqueId().prependTo($titlebar);

        var $titleContent = $('#' + $(".ui-dialog-content", dialog.uiDialog).attr("id") + '__title');

        $titleContent.appendTo($title);

        this.uiDialog.attr({
            "aria-labelledby": $title.attr("id")
        });
    },

    _title: function (title) {
        if (this.options.title) {
            title.html(this.options.title);
        } else {
            title.html("&#160;");
        }
    },

    /*minimize: function () {
        this.uiDialog.toggleClass("minimized");

        var dialog = this;
        var $dialog = $(dialog.uiDialog);

        dialog.options.minimized = !dialog.options.minimized;

        $minimizeButton = $(".ui-dialog-titlebar .button.minimize .icon", dialog.uiDialog);

        $dialog.height("auto");

        if (dialog.options.minimized) {
            $(".ui-dialog-content", dialog.uiDialog).hide();
        } else {
            $(".ui-dialog-content", dialog.uiDialog).show();
        }

        // dialog._trigger("minimize", event, this);
    },*/

    fit: function () {
        var dialog = this;
        var $dialog = $(dialog.uiDialog);

        $dialog.height("auto").find(".ui-dialog-content").height("auto");
        $dialog.width("auto");

        dialog._trigger("fit", event, this);
    },

    _focusTabbable: $.noop,

    _createOverlay: function () {
        if (!this.options.modal) {
            return;
        }

        var isOpening = true;
        this._delay(function () {
            isOpening = false;
        });

        if (!this.document.data("ui-dialog-overlays")) {
            this._on(this.document, {
                focusin: function (event) {
                    if (isOpening) {
                        return;
                    }

                    if (!this._allowInteraction(event)) {
                        event.preventDefault();
                        this._trackingInstances()[0]._focusTabbable();
                    }
                }
            });
        }

        this.overlay = $("<div>").appendTo(this._appendTo());

        this._addClass(this.overlay, null, "ui-widget-overlay ui-front");
        this.overlay.attr("uuid", this.uuid);

        this._on(this.overlay, {
            mousedown: "_keepFocus"
        });

        this.document.data("ui-dialog-overlays", (this.document.data("ui-dialog-overlays") || 0) + 1);
    },

    _destroyOverlay: function () {
        if (!this.options.modal) {
            return;
        }

        if (this.overlay) {
            var overlays = this.document.data("ui-dialog-overlays") - 1;

            if (!overlays) {
                this._off(this.document, "focusin");
                this.document.removeData("ui-dialog-overlays");
            } else {
                this.document.data("ui-dialog-overlays", overlays);
            }

            $(".ui-widget-overlay[uuid='" + this.uuid + "']").remove();

            this.overlay = null;
        }
    },

    destroyOverlay: function () {
        this._destroyOverlay();
    }
});
