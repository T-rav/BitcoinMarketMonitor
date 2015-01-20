	
function MarketViewModel(){
	var self = this;
	
	self.symbol = ko.observable("Exchange Name Here");
	self.volume = ko.observable("");
	self.bid = ko.observable("");
	self.high = ko.observable("");
	self.currency = ko.observable("");
	self.ask = ko.observable("");
	self.close = ko.observable("");
	self.avg = ko.observable("");
	self.low = ko.observable("");
	self.lastTradeTime = ko.observable("");
	
	self.setViewData = function(item){
		self.symbol(item.symbol);
		self.volume(item.volume);
		self.bid(item.bid);
		self.high(item.high);
		self.currency(item.currency);
		self.ask(item.ask);
		self.close(item.close);
		self.avg(item.avg);
		self.low(item.low);
		self.lastTradeTime(item.lastTradeMinutes + " m");
	};
	
	self.closeMarketView = function(item){
		$("#market").toggle();	
		$("#main").toggle();
	};
};