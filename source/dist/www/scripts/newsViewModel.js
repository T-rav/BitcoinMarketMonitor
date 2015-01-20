	function NewsViewModel(){
		var self = this;
		self.data = [];
		self.socialTrigger=false;
		self.headline = ko.observableArray([]);


		// TODO : Add source attribute ;)
		self.addHeadline = function(story){
			try{
				var summary = story.description + " ...";
				self.headline().push({title : story.title, summary: summary, link : story.guid, pubDate : story.pupDate, sourceIcon: story.sourceIcon});	
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

			if(!self.socialTrigger){
				self.openInAppLink(item.link);
				//webHelper.openUrl(item.link);	
			}else{
				self.socialTrigger = false;
			}
			
		};
	
		self.social = function(platform, data, event){
			//alert("social " + platform + " ->"+data.link);
			self.socialTrigger = true;	
			
			if(platform === 'gplus'){
				var gplusbase = "https://plus.google.com/share?url=";
				var shareLink = gplusbase+data.link;
				self.openInAppLink(shareLink);
			}else if(platform === "linkedin"){
				var linkedinbase = "https://www.linkedin.com/cws/share?url=";
				var shareLink = linkedinbase + data.link;
				self.openInAppLink(shareLink);
			}else if(platform === "twitter"){
				var base = "https://twitter.com/intent/tweet?url=";
				var shareLink = base + data.link;
				self.openInAppLink(shareLink);
			}else if(platform === "facebook"){
				var base = "http://www.facebook.com/sharer/sharer.php?u=";
				var shareLink = base + data.link;
				self.openInAppLink(shareLink);	
			}
		};

		self.openInAppLink = function(link){
			webHelper.openUrl(link)
			/*
			window.plugins.webintent.startActivity({
			    action: window.plugins.webintent.ACTION_VIEW,
			    url: link},
			    function() {},
			    function() {alert("Failed to open URL [ " + link + " ]")}
			);
			*/
		};

		self.sourceIcon = function(link){

			var value = link.toLowerCase();
			// cryptocoinsnews
			// CoinDesk
			// BitcoinMagazine
			// Generic

			var img = "images/";

			if(value.indexOf("cryptocoinsnews") > 0){
				return img+"icon-cryptocoin-newsletter.png";
			}else if(value.indexOf("coindesk") > 0){
				return img+"icon-coindesk-square.png";
			}else if(value.indexOf("bitcoinmagazine") > 0){
				return img+"icon-bitcoin-magazine.png";
			}else{
				return img+"icon-generic.png";
			}
		};
	}
