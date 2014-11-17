function ViewModel(viewService, settingsViewModel, marketViewModel, newsViewModel){
	var self = this;
	// set the service to use ;)
	self.viewService = viewService;
	self.settingsViewModel = settingsViewModel;
	self.marketViewModel = marketViewModel;
	self.newsViewModel = newsViewModel;
	
	self.data = []; // Raw data
	self.isAboutOpen = ko.observable(false);
	self.sortKey = ko.observable("");
	self.sortAsc = ko.observable(false);
	self.message = ko.observable("");
	self.currency = ko.observable(""); // Initially blank
	self.lastSync = ko.observable("In Progress...");
	self.headers = [
						{title:"Symbol",sortKey:"symbol"},
						{title:"Latest",sortKey:"latest"},
						{title:"Time",sortKey:"bid"},
						{title:"Average",sortKey:"avg"},
						{title:"Volume",sortKey:"vol"}
				   ];				
	self.exchangeState = ko.observableArray([]);

	self.headline = ko.computed(function(){
		var result = self.newsViewModel.headline();
		return result;
	}, self);

	self.fiatCurrency = ko.computed(function(){
		var result = ko.utils.arrayFilter(self.settingsViewModel.fiatCurrency(), function(item) {
			return item.selected();
		});
		return result;
	}, self);

	self.addCurrency = function(currency){
		self.settingsViewModel.fiatCurrency().push({name : currency});
	};
			
	self.setExchangeData = function(key){
		self.exchangeState(self.data[key]);
		self.currency(key);
	};
	
	self.setData = function(data, event){
		// set currency
		var fiat = data.name;
		self.currency(fiat);
		self.setExchangeData(fiat);
	};

	self.setLastSync = function(isError){
		var msg = viewService.renderSyncMessage(isError);
		self.lastSync(msg);	
		if(isError){
			self.showError();
		}else{
			self.hideError();
		}
	};
	
	self.sort = function(header, event){
		self.sortKey(header.sortKey);
		self.sortImpl(true);
	};
	
	self.reloadSort = function(){
		self.sortImpl(false);
	};
	
	self.sortImpl = function(isUserAction){
		var sortKey = self.sortKey();
		switch(sortKey){
			case "symbol":
				if(self.sortAsc()){
					self.exchangeState.sort(function(a,b){
						return a.symbol > b.symbol ? -1 : a.symbol < b.symbol ? 1 : a.symbol === b.symbol ? 0 : 0;
					});
				}else{
					self.exchangeState.sort(function(a,b){
						return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : a.symbol === b.symbol ? 0 : 0;
					});
				}
			break;
			case "latest":
				if(self.sortAsc()){
					self.exchangeState.sort(function(a,b){
						return a.close > b.close ? -1 : a.close < b.close ? 1 : a.close === b.close ? 0 : 0;
					});
				}else{
					self.exchangeState.sort(function(a,b){
						return a.close < b.close ? -1 : a.close > b.close ? 1 : a.close === b.close ? 0 : 0;
					});
				}
			break;
			case "bid":
				if(self.sortAsc()){
					self.exchangeState.sort(function(a,b){
						return a.bid > b.bid ? -1 : a.bid < b.bid ? 1 : a.bid === b.bid ? 0 : 0;
					});
				}else{
					self.exchangeState.sort(function(a,b){
						return a.bid < b.bid ? -1 : a.bid > b.bid ? 1 : a.bid === b.bid ? 0 : 0;
					});
				}
			break;
			case "avg":
				if(self.sortAsc()){
					self.exchangeState.sort(function(a,b){
						return a.avg > b.avg ? -1 : a.avg < b.avg ? 1 : a.avg === b.avg ? 0 : 0;
					});
				}else{
					self.exchangeState.sort(function(a,b){
						return a.avg < b.avg ? -1 : a.avg > b.avg ? 1 : a.avg === b.avg ? 0 : 0;
					});
				}
			break;
			case "vol":
				if(self.sortAsc()){
					self.exchangeState.sort(function(a,b){
						return a.volume > b.volume ? -1 : a.volume < b.volume ? 1 : a.volume === b.volume ? 0 : 0;
					});
				}else{
					self.exchangeState.sort(function(a,b){
						return a.volume < b.volume ? -1 : a.volume > b.volume ? 1 : a.volume === b.volume ? 0 : 0;
					});
				}
			break;
		}
		
		if(isUserAction){
			if(self.sortAsc()){
				self.sortAsc(false);
			}else{
				self.sortAsc(true);
			}
		}
	
	};
	
	self.showError = function(){
		$("#error").show("slow");
		setTimeout(function(){viewService.close("error",3500);}, 7000);
	};

	self.hideError = function(){
		$("#error").hide();
	};
	
	self.marketView = function(item){
		$("#main").toggle();
		$("#market").toggle();	
		self.marketViewModel.setViewData(item);
	};

	self.marketDirectionCSS = function(item){
		
		if(item.direction == "up"){
			return "fa fa-caret-up marketUp";
		}else if(item.direction == "flat"){
			return "fa fa-caret-right marketFlat";
		}else{
			return "fa fa-caret-down marketDown";
		}

		return false;
	};

	self.imgSrc = function(index){

		if(index % 2 === 0){
			return "images/small_bar_chart-even.svg";
		}else{
			return "images/small_bar_chart-odd.svg";
		}

	};

	self.isFakeHeader = function(index){

		if(index === 0){
			return "fakeHeader";
		}else{
			return "";
		}
	};
};