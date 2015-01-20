function NewsService(){
	var self = this;
	
	self.fetchData = function(newsViewModel){
		$.ajax({
			url : "http://stoneagetechnologies.com/bitcoincharts/news/?jsoncallback=?",
			dataType : "jsonp",
			crossDomain : true,
			async: false,
			success : function(data){
				// TODO : Load view model with data ;)
				// TODO : Set last sync time
				$.each(data, function(k,v){
					// TODO : Populate into repository
					//self.fiatCurrency.push({name : currency});
					// TODO : Abstract out to event that is triggered
					//alert(v.description);
					//newsViewModel.addHeadline({title : "Title 7 - Magic", summary: "Summary 2", link : "Link 2"});
					//newsViewModel.addHeadline({title : "Title 100 - DEV", summary: "Summary 2000 BYTES UNDER THE TSQL", link : "Link 1"});
					newsViewModel.addHeadline(v);

					// TODO : Push down into the DB ;)
				});

				// force refresh ;)
				newsViewModel.headline.valueHasMutated();
			},
			error : function(){
				newsViewModel.addHeadline({title : "Title 100 - ERROR", summary: "ERROR SYNCING", link : "NOP"});
			}
		});	
	};

	self.fetchPersistedData = function(newsViewModel){

		// TODO : Fetch latest from DB and return ;)

		// ADD 
		// newsViewModel.addHeadline(v);
	}
}