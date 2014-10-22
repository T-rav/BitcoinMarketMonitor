	function NewsViewModel(){
		var self = this;
		self.data = [];
		self.headline = ko.observableArray([]);

		// TODO : Add source attribute ;)
		self.addHeadline = function(story){
			try{
				console.log(story.title);
				self.headline().push({title : story.title, summary: story.description, link : story.guid, pupDate : story.pupDate});	
			}catch(e){
				console.log(e);
			}
		};
		
		
		self.init = function(newsService){
			
			self.headline().push(newsService.moqData());
			
			/*
			self.headline().push({title : "Title 1", summary: "Summary 1", link : "Link 1"});
			self.headline().push({title : "Title 2 - More", summary: "Summary 2", link : "Link 2"});
			self.headline().push({title : "Title 3 - More", summary: "Summary 2", link : "Link 2"});
			self.headline().push({title : "Title 4 - More", summary: "Summary 2", link : "Link 2"});
			self.headline().push({title : "Title 5 - More", summary: "Summary 2", link : "Link 2"});
			self.headline().push({title : "Title 6 - More", summary: "Summary 2", link : "Link 2"});
			*/
		};
		
		
		self.isOddRow = function(index){
		
			if(index % 2 === 0){
				return false;
			}
		
			return true;
		};
	
	}
	
	function NewsService(){
		var self = this;
		
		self.moqData = function(newsViewModel){
			return {title : "Title 99 - MOQ", summary: "Summary 199190292", link : "Link 1"};
		};
		
		self.fetchData = function(newsViewModel){
			$.ajax({
				url : "http://stoneagetechnologies.com/bitcoincharts/news/?jsoncallback=?",
				dataType : "jsonp",
				crossDomain : true,
				async: false,
				success : function(data){
					// TODO : Load view model with data ;)
					// TODO : Set last sync time
					//$.each(data, function(k,v){
						// TODO : Populate into repository
						//self.fiatCurrency.push({name : currency});
						// TODO : Abstract out to event that is triggered
						//alert(v.description);
						//newsViewModel.addHeadline({title : "Title 7 - Magic", summary: "Summary 2", link : "Link 2"});
						newsViewModel.addHeadline({title : "Title 100 - DEV", summary: "Summary 2000 BYTES UNDER THE TSQL", link : "Link 1"});
						//newsViewModel.addHeadline(v);
					//});
				},
				error : function(){
					
				}
			});	
			
			return {title : "Title 100 - DEV", summary: "Summary 2000 BYTES UNDER THE TSQL", link : "Link 1"};
			
		};
	}