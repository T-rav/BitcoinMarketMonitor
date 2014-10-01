'use strict';
(function() {
    // WebHelper plugin shim import
    // uncomment to open links in native browser
    // var webHelper = window.WebHelper;
    // example usage:
    // webHelper.openUrl("http://www.google.com")

    // User Preferences plugin shim import
    // uncomment to use preferences
    
    // example prefs usage:
    // prefs.store(noop, noop, "key", "value");
    // prefs.fetch(function (storedValue) {
    // }, function (retrieveError) {
    // }, "key");
    var app = {
        init: function() {
            this._target = $("main");
            this.restorePreferences();
            this.fixBottomMenuItemsForSmallerScreens();
            this.show();
			// register routing engine ;)
			var self = this;
			document.addEventListener('click', function(){self.routingEngine(event);}, false);
        },
        show: function() {
            // define splash and content -id elements for this functionality
			$('#main').show();
			//$('#load').collapse('show');
			//setTimeout(function(){$('#load').collapse('hide'); setTimeout(function(){$('#main').show();},500);},4500);
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
		routingEngine:function(event){
			// now we just need to handle routes and inject html fragments; )
			var target = event.target;
			//#/path/to/resource.html
			if(!(target === undefined) && target.tagName.toLowerCase() === "a"){
				console.log("TARGET->"+target.href);
			}
		}
    };

    document.addEventListener('deviceready', function() {
       app.init();
    }, false);
})();
