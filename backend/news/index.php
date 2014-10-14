<?php
	ini_set('display_errors', true);
	error_reporting(E_ALL);

	// TODO : Fetch and persist to DB, every 4 hours pull via cron
	// TODO : Trim the bitcoin mag linking out
	// TODO : Persist to fs in js
	// TODO : Add news section and story count and notifications defaults

	// http://feeds.feedburner.com/BitcoinMagazine
	// https://www.cryptocoinsnews.com/category/news/feed/
	
	$result = array();
	$feed = array("http://feeds.feedburner.com/BitcoinMagazine","https://www.cryptocoinsnews.com/category/news/feed/", "http://bitcoinexaminer.org/feed/", "http://feeds.feedburner.com/CoinDesk");
	
<<<<<<< HEAD
	$data = fetchData($feedburner);
	$data = str_replace("content:encoded","content",$data);
	$result = processRSS($data);
	var_dump($result);
	//fetchRawRSS($feedburner);
	//fetchRawRSS($cryptonews);
=======
	foreach ($feed as &$value) {
		$data = fetchData($value);
		processRSS($data, &$result);
	}
	
	// Now sort it all by pub date ;)
	uasort($result, 'sortByPubDate');
	
	var_dump($result);
	
	function sortByPubDate($a, $b){
	
		if($a["pupDate"] == $b["pupDate"]){
			return 0;
		}
	
		return ($a["pupDate"] < $b["pupDate"]) ? 1 : -1;
	}
>>>>>>> e89bac6e246fa1cea183f4771fb09e66a62585c5
	
	function fetchData($url){
	
		$data = file_get_contents($url);

		return $data;
	}
	
	function processRSS($data, $result){
		
<<<<<<< HEAD
		$xml = simplexml_load_string($data, null, LIBXML_NOCDATA);
		$result = array();
=======
		$data = str_replace("content:encoded","content",$data);
		
		$xml = simplexml_load_string($data, null, LIBXML_NOCDATA);
>>>>>>> e89bac6e246fa1cea183f4771fb09e66a62585c5
		$pos = 0;
		foreach($xml->channel->item as $item){
		
			$title = (string)$item->title;
			$link = (string)$item->link;
			$guid = (string)$item->guid;
			$pupDate = (string)$item->pubDate;
<<<<<<< HEAD
			$content = pruneSection($item->content, "<p>The post <a rel=\"nofollow" , "height=\"1\" width=\"1\"/>");
			$content = pruneRubish($content);
			$description = buildDescription($content);

			if(strlen($title) <= 60){
=======
			$description = pruneDescription((string)$item->description);

			if(strlen($title) <= 80){
>>>>>>> e89bac6e246fa1cea183f4771fb09e66a62585c5
				$story = array();
				$story["title"] = $title;
				$story["guid"] = $link;
				$story["pupDate"] = $pupDate;
				$story["description"] = $description;
<<<<<<< HEAD
				$story["content"] = $content;
=======
>>>>>>> e89bac6e246fa1cea183f4771fb09e66a62585c5
				$result[] = $story;
			}	
		}
		
		return $result;
	}
	
<<<<<<< HEAD
=======
	function pruneDescription($description){
		$result = str_replace("[&#8230;]", "", $description);
		$result = pruneSection($result, "<p>The post <a rel=\"nofollow" , "</p>");
		$result = str_replace("<p>","", $result);
		$result = str_replace("</p>","", $result);
		
		return trim($result);
	}

>>>>>>> e89bac6e246fa1cea183f4771fb09e66a62585c5
	function buildDescription($content){
	
		$description = substr($content, 0, 200);
		$lastSpace = strrpos($description, " ");
		$result = substr($description, 0, $lastSpace);
		
		$result = str_replace("<p>","", $result);
		$result = str_replace("</p>","", $result);
		$result = str_replace("<br/>","", $result);
		$result = str_replace("<b>","", $result);
		$result = str_replace("<b/>","", $result);
		$result = str_replace("<i>","", $result);
		$result = str_replace("<i/>","", $result);
		
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
