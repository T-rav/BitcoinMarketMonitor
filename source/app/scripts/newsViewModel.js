	function NewsViewModel(){
		var self = this;
		self.data = [];
		self.headline = ko.observableArray([]);

		// TODO : Add source attribute ;)
		self.addHeadline = function(story){
			try{
				var summary = story.description + " ...";
				self.headline().push({title : story.title, summary: summary, link : story.guid, pubDate : story.pupDate});	
			}catch(e){
				console.log(e);
			}
		};
		
		self.isOddRow = function(index){
		
			if(index % 2 === 0){
				return false;
			}
		
			return true;
		};
	
	}
