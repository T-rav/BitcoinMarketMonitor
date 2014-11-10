function SettingsViewModel(){
	var self = this;
	
	self.fiatCurrency = ko.observableArray([]);
	self.defaultFiatCurrency = ko.observableArray([]);
	self.editHistory = ko.observableArray([]);
	
	self.syncInterval = ko.observable(1);
	self.isDefaultSelected = ko.observable(false);
	self.defaultCurrency = ko.observable("USD");
	
	self.addCurrency = function(currency, isSelected){
		self.fiatCurrency.push({name : currency, selected : ko.observable(isSelected)});
		self.defaultFiatCurrency.push({name : currency, selected : ko.observable(false)});
	};
	
	self.setDefaultCurrency = function(currency){
		self.defaultCurrency(currency);
		
		// TODO : Loop all existing options and deselect them ;)
		for(var i = 0; i < self.defaultFiatCurrency().length; i++){
			var item = self.defaultFiatCurrency()[i];
			if(item.name === currency){
				item.selected(true);
			}else{
				item.selected(false);
			}
		}
	};
	
	self.save = function(){
		var result = [];
		
		for(var i = 0; i < self.fiatCurrency().length; i++){
			var entry = self.fiatCurrency()[i];
			var selected = entry.selected();
			result[i] = {"name" : entry.name, "selected" : selected};
		}
		
		var syncInterval = self.syncInterval();
		if(isNaN(syncInterval) || syncInterval < 1){
			syncInterval = 5;
			self.syncInterval(syncInterval);
		}
		
		prefs.store(noop, noop, "fiatCurrencies", JSON.stringify(result));
		prefs.store(noop, noop, "defaultCurrency", self.defaultCurrency());
		prefs.store(noop, noop, "syncInterval", syncInterval);
		
		self.clearEditHistory();
	};
	
	self.clearEditHistory = function(){
	
		// clear the edit history ;)
		while(self.editHistory().length > 0){
			self.editHistory().pop();
		}
	
		// reset the default curreny menu option
		self.isDefaultSelected(false);
	};
	
	self.cancel = function(){
	
		while(self.editHistory().length > 0){
			var item = self.editHistory().pop();
			var currentIndex = self.findEditItemIndex(item.name);
			if(currentIndex != -1){
				var selected = item.selected;
				self.fiatCurrency()[currentIndex].selected(selected);
			}
		}
		self.clearEditHistory();
	};
	
	self.findEditItemIndex = function(itemName){

		for(var i = 0; i < self.fiatCurrency().length; i++){
			var item = self.fiatCurrency()[i];
			if(item.name === itemName){
				return i;
			}
		}
		
		return -1;
	};
	
	self.toggle = function(item){
		self.editHistory.push({name : item.name, selected : item.selected()});
		if(item.selected()){
			item.selected(false);
		}else{
			item.selected(true);
		}
	};
	
	self.toggleDefault = function(item){
		self.setDefaultCurrency(item.name);
	};
	
	self.settingStatus = ko.pureComputed(function(object){
		return "selectedBadge";
	}, this);

	self.toggleLoadCurrency = function(){
		$("#mainDefaults").toggle();
		$("#loadDefaults").toggle();
		
		if(self.isDefaultSelected()){
			self.isDefaultSelected(false);
		}else{
			self.isDefaultSelected(true);
		}
	};
};