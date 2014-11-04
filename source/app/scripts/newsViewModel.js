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
