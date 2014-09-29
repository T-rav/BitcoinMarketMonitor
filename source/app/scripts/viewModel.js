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
				//viewService.fetchData(true, self);
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
								return a.symbol > b.symbol ? -1 : a.symbol < b.symbol ? 1 : a.symbol === b.symbol ? 0 : 0;
							});
						}else{
							self.exchangeState.sort(function(a,b){
								return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : a.symbol === b.symbol ? 0 : 0;
							});
						}
					break;
					case 'latest':
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
					case 'bid':
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
					case 'avg':
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
					case 'vol':
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
				setTimeout(function(){viewService.close("error",3500);}, 7000);
			};

		};
		
		function SettingsViewModel(){
			var self = this;
			
			self.fiatCurrency = ko.observableArray([]);
			self.editHistory = ko.observableArray([]);
			
			self.addCurrency = function(currency, isSelected){
				self.fiatCurrency.push({name : currency, selected : ko.observable(isSelected)});
			};
			
			self.save = function(){
				var result = [];
				
				for(var i = 0; i < self.fiatCurrency().length; i++){
					var entry = self.fiatCurrency()[i];
					var selected = false;
					try{
						var foo = self.selectedFiatCurrency()[entry];
						selected = true;
					}catch(e){
						console.log("ERROR -> " + e);
					}
					result[name] = entry.selected;
				}
			
				prefs.store(noop, noop, "defaults", JSON.stringify(result));
				
				self.clearEditHistory();
			};
			
			self.clearEditHistory = function(){
			
				// clear the edit history ;)
				while(self.editHistory().length > 0){
					self.editHistory().pop();
				}
			
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
				self.fiatCurrency.valueHasMutated();
				
			};
			
			self.findEditItemIndex = function(itemName){

				for(var i = 0; i < self.fiatCurrency().length; i++){
					var item = self.fiatCurrency()[i];
					if(item.name == itemName){
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
				self.fiatCurrency.valueHasMutated();
			};
			
			self.settingStatus = ko.pureComputed(function(object){
				return 'selectedBadge';
			}, this);

		};
		
		
		function ViewService(){
			var self = this;
			
			self.currentData = [];
			self.previousData = [];
			self.fiatCurrency = [];
			
			// TODO : Create scheduling service instead ;)
			self.init = function(viewModel, settingsViewModel){
				setTimeout(function(){self.timedFetch(viewModel, settingsViewModel)}, 10);
				//setTimeout(function(){self.displayNotification("BTC is on the move...")}, 1000);
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
				self.fetchData(false, viewModel, settingsViewModel);
				setInterval(function(){self.timedFetch(viewModel, settingsViewModel)}, 30000);
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
					url : "http://kungfuactiongrip.com/bitcoincharts/?jsoncallback=?",
					dataType : 'jsonp',
					crossDomain : true,
					async: true,
					success : function(data){
						self.setRawData(data);
						viewModel.data = data;

						if(init || viewModel.fiatCurrency().length === 0){
							var defaults = "";
							prefs.fetch(function (storedValue) {
											prefsObject = JSON.eval(storedValue);
										}, 
										function (retrieveError) {
										}, 
										"defaults");
						
						
							$.each(data, function(k,v){
								// TODO : Populate into repository
								//self.fiatCurrency.push({name : currency});
								// TODO : Abstract out to event that is triggered
								viewModel.addCurrency(k);
								// TODO : Abstract out of there 
								var isSelected = true;
								try{
									isSelected = defaults[k]["selected"];
								}catch(e){
									isSelected = true;
									console.log("ERROR -> " + e);
								}
								settingsViewModel.addCurrency(k, isSelected);
							});
							
							// TODO : Abstract to view init
							viewModel.setExchangeData("USD");
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
						viewModel.showError();
					}
				});	
			
			};
			
		};
