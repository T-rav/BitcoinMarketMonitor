function ViewService(){
	var self = this;
	
	self.currentData = [];
	self.previousData = [];
	self.fiatCurrency = [];

	// TODO : Create scheduling service instead ;)
	self.init = function(viewModel, settingsViewModel){
		setTimeout(function(){self.timedFetch(viewModel, settingsViewModel);}, 10);
		//setTimeout(function(){self.displayNotification("BTC is on the move...");}, 10000);
	};

	// TODO : Abstract to a data repository
	self.setRawData = function(data){
		self.previousData = self.currentData;
		self.currentData = data;
	};
	
	// TODO : Abstract to a data repository
	self.getRawData = function(){
		return self.currentData;
	};
	
	self.getFiatCurrency = function(){
		return self.fiatCurrency;
	};
	
	self.renderSyncMessage = function(isError){
		var currentdate = new Date(); 
		var hours = currentdate.getHours();
		var mins = currentdate.getMinutes();
		var secs = currentdate.getSeconds();
		
		if(hours < 10){
			hours = "0" + hours;
		}
		
		if(mins < 10){
			mins = "0" + mins;
		}
		
		if(secs < 10){
			secs = "0" + secs;
		}	
		
		var result = hours + ":" + mins + ":" + secs;
						
		if(isError){
			result = "Error at "+result;
		}
		
		return result;
	};
	
	self.timedFetch = function(viewModel, settingsViewModel){
		viewModel.lastSync("In Progress...");
		var interval = (settingsViewModel.syncInterval()*60) * 1000;
		self.fetchData(false, viewModel, settingsViewModel);
		setTimeout(function(){self.timedFetch(viewModel, settingsViewModel)}, interval);
	};
	
	self.displayNotification = function(message){
		var payload = "{message : '" + message + "'}";
		if(window.plugin === undefined){
			console.log("**BUZZ** **BUZZ** -> " + message);
		}else{
			window.plugin.notification.local.add(payload);
		}
	};

	self.initState = function(){
		self.close("error",0);
		self.close("info", 0);
	};
				
	self.close = function(divID, duration){
		$("#"+divID).hide(duration);
	};

	self.fetchData = function(init, viewModel, settingsViewModel){
		$.ajax({
			url : "http://stoneagetechnologies.com/bitcoincharts/?jsoncallback=?",
			dataType : "jsonp",
			crossDomain : true,
			async: true,
			success : function(data){
				self.setRawData(data);
				viewModel.data = data;

				if(init || viewModel.fiatCurrency().length === 0){
					var currencyList = self.fetchCurrencyList();
					var loadCurrency = self.fetchDefaultCurrency();
					self.initModel(data, currencyList, loadCurrency, settingsViewModel, viewModel);
					
				}else{
					// TODO : Abstract to event that is triggered 
					viewModel.setExchangeData(viewModel.currency());
				}
				
				// set the ordering back ;)
				viewModel.reloadSort();
				
				// set the sync time ;)
				viewModel.setLastSync(false);
			},
			error : function(){
				viewModel.setLastSync(true);
			}
		});	
	};
	
	self.fetchCurrencyList = function(){
		var currencyList = "";
		prefs.fetch(function (value) {
			currencyList = JSON.parse(value);
		}, function (error) {}, "fiatCurrencies");
		return currencyList;
	};
	
	self.fetchDefaultCurrency = function(){
		var result = "";
		prefs.fetch(function (value) {
			result = value;
		}, function (error) {}, "defaultCurrency");
		if(result === undefined){
			result = "USD";
		}
		return result;
	};
	
	self.fetchSyncInterval = function(){
		var result = "";
		prefs.fetch(function (value) {
			result = value;
		}, function (error) {}, "syncInterval");
		if(result === undefined || result < 1){
			result = 5;
		}
		return result;
	
	};
	
	self.initModel = function(data, currencyList, defaultCurrency, settingsViewModel, viewModel){

		$.each(data, function(k,v){
			// TODO : Populate into repository
			//self.fiatCurrency.push({name : currency});
			// TODO : Abstract out to event that is triggered
			var isSelected = self.isCurrencySelected(k,currencyList);
			settingsViewModel.addCurrency(k, isSelected);
		});
		
		// TODO : Abstract to view init
		settingsViewModel.setDefaultCurrency(defaultCurrency);
		settingsViewModel.syncInterval(self.fetchSyncInterval());
		viewModel.setExchangeData(defaultCurrency);
	};
	
	self.isCurrencySelected = function(itemName,currencyList){
		// TODO : Abstract out of there 
		var isSelected = true;
		var idx = self.findCurrencyIndex(itemName, currencyList);
		if(idx >= 0){
			isSelected = currencyList[idx].selected;
		}
		return isSelected;
	};
	
	self.findCurrencyIndex = function(itemName, currencyList){

		for(var i = 0; i < currencyList.length; i++){
			var item = currencyList[i];
			if(item.name === itemName){
				return i;
			}
		}
		
		return -1;
	};
	
};