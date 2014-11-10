function NewsService(){
	var self = this;
	
	self.moqData = function(newsViewModel){
		newsViewModel.addHeadline({title : "Title 999 - MOQ", summary: "Summary 2000 BYTES UNDER THE TSQL", link : "Link 1"});
		//return {title : "Title 99 - MOQ", summary: "Summary 199190292", link : "Link 1"};
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
				newsViewModel.addHeadline({title : "Title 100 - ERROR", summary: "ERROR SYNCING", link : "NOP"});
			}
		});	
	};
}