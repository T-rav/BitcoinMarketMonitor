	function NewsViewModel(){
		var self = this;
		self.data = [];
		self.socialTrigger=false;
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
		
		self.openLink = function(item){

			// <button onclick="window.plugins.socialsharing.share(null, null, null, 'http://www.x-services.nl')">link only</button>
			if(!self.socialTrigger){
				webHelper.openUrl(item.link);	
			}else{
				self.socialTrigger = false;
			}
			
		};
	
		self.social = function(platform, data, event){
			alert("social " + platform + " ->"+data.link);
			self.socialTrigger = true;
			// networks : gplus, linkedin, twitter
			window.plugins.socialsharing.share(null, null, null, data.link)
			

		}
	}
