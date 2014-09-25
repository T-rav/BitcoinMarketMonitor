'use strict';
(function() {
    // WebHelper plugin shim import
    // uncomment to open links in native browser
    // var webHelper = window.WebHelper;
    // example usage:
    // webHelper.openUrl("http://www.google.com")

    // User Preferences plugin shim import
    // uncomment to use preferences
    // var prefs = window.PrefsHelper;
    // var noop = function() {};
    
    // example prefs usage:
    // prefs.store(noop, noop, "key", "value");
    // prefs.fetch(function (storedValue) {
    // }, function (retrieveError) {
    // }, "key");
    var app = {
        init: function() {
            this._target = $("main");
            this.restorePreferences();
            this.bindPullToRefresh();
            this.bindMenuButton();
            this.bindOptions();
            this.fixBottomMenuItemsForSmallerScreens();
            this.show();
        },
        bindPullToRefresh: function() {
            if (this._target.pullToRefresh !== undefined) {
                this._target.pullToRefresh({ color: "#999" });
                this._target.on("pulled", function() {
                    window.Hackendot.AtomLoader.refresh();
                });
            }
        },
        show: function() {
            // define splash and content -id elements for this functionality
            $("#splash").hide();
            $("#content").show();
        },
        fixBottomMenuItemsForSmallerScreens: function() {
            // if you have a ul.bottom, this helps to place it on smaller screens
            var bottomList = $("ul.bottom");
            if (bottomList.length === 0) {
                return;
            }
            var bottomListTop = bottomList.position().top;
            var lastItem = $("ul.top li:last-child()");
            var lastItemBottom = lastItem.position().top + lastItem.height();
            if (bottomListTop <= lastItemBottom) {
                bottomList.css("position", "relative");
            }
        },
        restorePreferences: function() {
            // TODO: restore user preferences here
        },
        bindMenuButton: function() {
            // TODO: decide if you actually want this; it's flaky as all hell
            document.addEventListener("menubutton", function() {
                window.console.log("menubutton pressed");
                window.toggleMenu();
            }, false);
        },
        bindOptions: function() {
            // if you define an options div, this can help you with showing / hiding it:
            // 1) you should have an image with the id 'preferences': tapping it opens
            //      the options pane
            // 2) your options should have a button with id 'done' which this then uses
            //      to close the options pane down again
            // 3) emit 'loading-content' from the body element, ie:
            //          $("body").trigger("loading-content");
            //      to have the options pane automatically dismissed when loading content,
            //      eg from the menu system
            var self = this;
            $("img#preferences").on("click", function() {
                self.showOptions();
            });
            $("#done").on("click", function() {
                self.hideOptions();
            });
            $("body").on("loading-content", function() {
                self.hideOptions();
            });
        },
        showOptions: function() {
            window.closeMenu();
            $("body").scrollTop(0);
            this._target.hide();
            $("div#options").show();
        },
        hideOptions: function() {
            window.closeMenu();
            $("div#options").hide();
            this._target.show();
        },
    };

    document.addEventListener('deviceready', function() {
        app.init();
    }, false);
})();
