 function ViewModel(viewService){
			var self = this;
			// set the service to use ;)
			self.viewService = viewService;
			
			self.data = []; // Raw data
			self.isAboutOpen = ko.observable(false);
			self.sortKey = ko.observable("");
			self.sortAsc = ko.observable(false);
			self.message = ko.observable("");
			self.currency = ko.observable(""); // Initially blank
			self.lastSync = ko.observable("In Progress...");
			self.headers = [
								{title:'Symbol',sortKey:'symbol'},
								{title:'Latest',sortKey:'latest'},
								{title:'Time',sortKey:'bid'},
								{title:'Average',sortKey:'avg'},
								{title:'Volume',sortKey:'vol'}
						   ];				
			self.fiatCurrency = ko.observableArray([]);
			self.exchangeState = ko.observableArray([]);
			
			self.init = function(){
				viewService.initState();
				viewService.fetchData(true, self);
			};

			self.addCurrency = function(currency){
				self.fiatCurrency.push({name : currency});
			};
					
			self.setExchangeData = function(key){
				self.exchangeState(self.data[key]);
			};
			
			self.setData = function(data, event){
				// set currency
				var fiat = data["name"];
				self.currency(fiat);
				self.setExchangeData(fiat);
			};

			self.setLastSync = function(isError){
				var msg = viewService.renderSyncMessage(isError);
				viewModel.lastSync(msg);			
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
					case 'symbol':
						if(self.sortAsc()){
							self.exchangeState.sort(function(a,b){
								return a.symbol > b.symbol ? -1 : a.symbol < b.symbol ? 1 : a.symbol == b.symbol ? 0 : 0;
							});
						}else{
							self.exchangeState.sort(function(a,b){
								return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : a.symbol == b.symbol ? 0 : 0;
							});
						}
					break;
					case 'latest':
						if(self.sortAsc()){
							self.exchangeState.sort(function(a,b){
								return a.close > b.close ? -1 : a.close < b.close ? 1 : a.close == b.close ? 0 : 0;
							});
						}else{
							self.exchangeState.sort(function(a,b){
								return a.close < b.close ? -1 : a.close > b.close ? 1 : a.close == b.close ? 0 : 0;
							});
						}
					break;
					case 'bid':
						if(self.sortAsc()){
							self.exchangeState.sort(function(a,b){
								return a.bid > b.bid ? -1 : a.bid < b.bid ? 1 : a.bid == b.bid ? 0 : 0;
							});
						}else{
							self.exchangeState.sort(function(a,b){
								return a.bid < b.bid ? -1 : a.bid > b.bid ? 1 : a.bid == b.bid ? 0 : 0;
							});
						}
					break;
					case 'avg':
						if(self.sortAsc()){
							self.exchangeState.sort(function(a,b){
								return a.avg > b.avg ? -1 : a.avg < b.avg ? 1 : a.avg == b.avg ? 0 : 0;
							});
						}else{
							self.exchangeState.sort(function(a,b){
								return a.avg < b.avg ? -1 : a.avg > b.avg ? 1 : a.avg == b.avg ? 0 : 0;
							});
						}
					break;
					case 'vol':
						if(self.sortAsc()){
							self.exchangeState.sort(function(a,b){
								return a.volume > b.volume ? -1 : a.volume < b.volume ? 1 : a.volume == b.volume ? 0 : 0;
							});
						}else{
							self.exchangeState.sort(function(a,b){
								return a.volume < b.volume ? -1 : a.volume > b.volume ? 1 : a.volume == b.volume ? 0 : 0;
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

			self.displayAbout = function(){
				if(!self.isAboutOpen()){
					self.isAboutOpen(true);
					$("#info").show("slow");
				}else{
					self.isAboutOpen(false);
					viewService.close("info", 1500);
				}
			};
						
			self.showError = function(){
				$("#error").show("slow");
				setTimeout(function(){viewService.close("error",3500);}, 5000);
				//window.plugin.notification.local.add({message : 'An error occurred syncing.'});
			};

		};
		
		
		function ViewService(){
			var self = this;
			
			self.init = function(viewModel){
				setTimeout(function(){self.timedFetch(viewModel)}, 10000);
				setTimeout(function(){self.displayNotification("BTC is on the move...")}, 1000);
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
			
			self.timedFetch = function(viewModel){
				viewModel.lastSync("In Progress...");
				self.fetchData(false, viewModel);
				setInterval(function(){self.timedFetch(viewModel)}, 30000);
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

			self.fetchData = function(init, viewModel){
				$.ajax({
					url : "http://kungfuactiongrip.com/bitcoincharts/?jsoncallback=?",
					dataType : 'jsonp',
					crossDomain : true,
					async: true,
					success : function(data){
						viewModel.data = data;
						// Default to USD
						
						// TODO : Handle where the model has not initialized ;)
						if(init || viewModel.fiatCurrency().length == 0){
							$.each(data, function(k,v){
								viewModel.addCurrency(k);
							});
							viewModel.setExchangeData("USD");
						}else{
							viewModel.setExchangeData(viewModel.currency());
						}
						
						// set the ordering back ;)
						viewModel.reloadSort();
						
						// set the sync time ;)
						viewModel.setLastSync(false);
					},
					error : function(){
						viewModel.setLastSync(true);
						viewModel.showError();
					}
				});	
			
			};
			
		};
