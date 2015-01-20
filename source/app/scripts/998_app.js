'use strict';
(function() {
    
    // example usage:
    // webHelper.openUrl("http://www.google.com")

    var app = {
        init: function() {

            // swap to false to show splash screen
            var isDevEnv = false;
            var loadScreenTTL = 5500;
            var loadScreenInterval = 500;

            this.fixBottomMenuItemsForSmallerScreens();
            this.slashScreen(isDevEnv,loadScreenTTL, loadScreenInterval);
		    this.bootstrap();	
            // register routing engine ;)
			//var self = this;
			//document.addEventListener('click', function(){self.routingEngine(event);}, false);
            self.handleBackButton();
        },
        bootstrap : function(){

            var viewService = new ViewService();
            var settingsViewModel = new SettingsViewModel();
            var marketViewModel = new MarketViewModel();
            var newsViewModel = new NewsViewModel();
            var newsService = new NewsService();
            
            var viewModel = new ViewModel(viewService, settingsViewModel, marketViewModel, newsViewModel, newsService);
            var message = new MessageModel();
            var loadViewModel = new UpdateProgress(10, 8);
    
            // -- load screen
            this.bindLoader(message, loadViewModel);

            // fetch data
            newsService.fetchData(newsViewModel);
            viewService.init(viewModel, settingsViewModel);
    
            // bind the ui
            this.bindApp(settingsViewModel, marketViewModel, newsViewModel, viewModel);

        },
        bindLoader:function(message, loadViewModel){
            setInterval(function(){loadViewModel.update(message);}, 400);
            ko.applyBindings(message, document.getElementById("load"));
        },
        bindApp:function(settingsViewModel, marketViewModel, newsViewModel, viewModel){
            // settings
            ko.applyBindings(settingsViewModel, document.getElementById("defaults"));
    
            // -- main
            viewModel.currency("USD"); // Text appears
            ko.applyBindings(viewModel, document.getElementById("main"));
            
            // -- market 
            ko.applyBindings(marketViewModel, document.getElementById("market"));
            
            // -- news
            ko.applyBindings(newsViewModel, document.getElementById("newsRegion"));
        },
        slashScreen: function(isDevEnv, loadScreenTTL, loadScreenInterval) {
            // define splash and content -id elements for this functionality
            if(isDevEnv){
			    $('#main').show();
            }else{
                $('#load').collapse('show');
                setTimeout(function(){$('#load').collapse('hide'); setTimeout(function(){$('#main').show();},loadScreenInterval);},loadScreenTTL);    
            }
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
        handleBackButton : function(){
            document.addEventListener("backbutton", function(e){
               //if($.mobile.activePage.is('#market')){
                   // exit if home page
                   //e.preventDefault();
                   //navigator.app.exitApp();
               //}
               //else {
                   e.preventDefault();
                   navigator.app.backHistory()
               //}
            }, false);
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
