<?php
	ini_set('display_errors', true);
	error_reporting(E_ALL);

	// set timezone ;)
	date_default_timezone_set("GMT");

	$jqueryFormat = isset($_GET['jsoncallback']);

	// TODO : Fetch and persist to DB, every 4 hours pull via cron
	// TODO : Trim the bitcoin mag linking out
	// TODO : Persist to fs in js
	// TODO : Add news section and story count and notifications defaults

	// http://feeds.feedburner.com/BitcoinMagazine
	// https://www.cryptocoinsnews.com/category/news/feed/
	
	$result = array();
	// "http://bitcoinexaminer.org/feed/", 
	$feed = array("http://feeds.feedburner.com/BitcoinMagazine" ,"https://www.cryptocoinsnews.com/category/news/feed/", "http://feeds.feedburner.com/CoinDesk");
	
	foreach ($feed as &$value) {
		$data = fetchData($value);
		$result = processRSS($data, $result);
	}
	
	// Now sort it all by pub date ;)
	uasort(&$result, 'sortByPubDate');

	$returnData = convertToJson($result);
	
	if($jqueryFormat){
		header('Content-Type:application/x-javascript');
		$fnName = $_GET['jsoncallback'];
		echo $fnName." (".$returnData.")";
	}else{
		header('Content-Type:text/json');
		echo $returnData;
	}	
	
	function convertToJson($dataToDump){
	
		return json_encode($dataToDump, true);
	}
	
	function sortByPubDate($a, $b){
	
		if($a["sortDate"] == $b["sortDate"]){
			return 0;
		}
	
		return ($a["sortDate"] < $b["sortDate"]) ? 1 : -1;
	}
	
	function fetchData($url){
	
		$data = file_get_contents($url);

		return $data;
	}
	
	function processRSS($data, $result){
		
		$data = str_replace("content:encoded","content",$data);
		
		$xml = simplexml_load_string($data, null, LIBXML_NOCDATA);
		$pos = 0;
		foreach($xml->channel->item as $item){
		
			$title = (string)$item->title;
			$link = (string)$item->link;
			$guid = (string)$item->guid;
			$pubDate = (string)str_replace(" +0000", " GMT",$item->pubDate);
			$description = pruneDescription((string)$item->description);
			$description = buildDescription($description);

			if(strlen($title) <= 90){
				$story = array();
				$story["title"] = $title;
				$story["guid"] = $link;
				$story["pupDate"] = $pubDate;
				$story["sortDate"] = strtotime($item->pubDate);
				$story["description"] = $description;
				$result[] = $story;
			}	
		}
		
		return $result;
	}
	
	function pruneDescription($description){
		$result = str_replace("[&#8230;]", "", $description);
		//$result = pruneSection($result, "<p>The post <a rel=\"nofollow" , "</p>");
		$result = str_replace("<p>","", $result);
		$result = str_replace("</p>","", $result);

		$result = $description;
		
		return trim($result);
	}

	function buildDescription($content){
	
		$description = substr($content, 0, 350);
		$lastSpace = strrpos($description, " ");
		$result = substr($description, 0, $lastSpace);
		
		$result = str_replace("<p>","", $result);
		$result = str_replace("</p>","", $result);
		$result = str_replace("<br/>","", $result);
		$result = str_replace("<b>","", $result);
		$result = str_replace("<b/>","", $result);
		$result = str_replace("<i>","", $result);
		$result = str_replace("<i/>","", $result);

		// " replace
		$result = str_replace("&#8220;", "\"", $result);
		$result = str_replace("&#8221;", "\"", $result);
		$result = str_replace("\\u00a0", "\"", $result);
		$result = str_replace("\\u201c", "\"", $result);

		// - replace
		$result = str_replace("&#8211;", "-", $result);
		$result = str_replace("\u2013", "-", $result);

		// ' replace
		$result = str_replace("&#8217;", "'", $result);
		$result = str_replace("\\u2019", "'", $result);

		// [space] replace
		$result = str_replace("&#160;", " ", $result);
		$result = str_replace("\\u00a0", " ", $result);

		// ... replace &#8230;
		$result = str_replace("&#8230;", " ", $result);		

		// u replace
		$result = str_replace("\u00fc", "u", $result);

		return trim($result);
	}
	
	function pruneRubish($content){
	
		$content = str_replace("<p>&nbsp;</p>", "",  $content);
		$content = preg_replace("/<img[^>]+\>/i", "", $content); 
		$token = "<a class=\"featured_image_link\"";
		$content = pruneSection($content, $token, "</a>");
		$token = "<p class=\"wp-caption-text\"";
		$content = pruneAllPTokens($content, $token);
		$token = "<p>Image Credit";
		$content = pruneAllPTokens($content, $token);
		
		return trim($content);
	}
	
	function pruneAllPTokens($content, $token){
		$tokenPos = strpos($content, $token);
		
		while(($tokenPos > 0 && $tokenPos !== false)){
			$content = pruneSection($content, $token, "</p>");
			$tokenPos = strpos($content, $token);
		}
		
		return $content;
	}
	
	function pruneSection($data, $startToken, $endToken){
	
		$start = strpos($data,$startToken);

		if($start >= 0){
			$startFrag = substr($data, 0, $start);
			$endFrag = "";
			$end = strpos($data, $endToken, $start);
			if($end >= 0){
				$end = $end + strlen($endToken);
				$endFrag = substr($data, $end);
			}
			return ($startFrag.$endFrag);
		}
		
		return $data;
		
	}
	
?>
