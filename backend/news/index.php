<?php
	ini_set('display_errors', true);
	error_reporting(E_ALL);

	// TODO : Fetch and persist to DB, every 4 hours pull via cron
	// TODO : Trim the bitcoin mag linking out
	// TODO : Persist to fs in js
	// TODO : Add news section and story count and notifications defaults

	// http://feeds.feedburner.com/BitcoinMagazine
	// https://www.cryptocoinsnews.com/category/news/feed/
	
	$feedburner = "http://feeds.feedburner.com/BitcoinMagazine";
	$cryptonews = "https://www.cryptocoinsnews.com/category/news/feed/";
	
	$data = fetchData($feedburner);
	$data = str_replace("content:encoded","content",$data);
	$result = processRSS($data);
	var_dump($result);
	//fetchRawRSS($feedburner);
	//fetchRawRSS($cryptonews);
	
	function fetchData($url){
	
		$data = file_get_contents($url);

		return $data;
	}
	
	function processRSS($data){
		
		$xml = simplexml_load_string($data, null, LIBXML_NOCDATA);
		$result = array();
		$pos = 0;
		foreach($xml->channel->item as $item){
		
			$title = (string)$item->title;
			$link = (string)$item->link;
			$guid = (string)$item->guid;
			$pupDate = (string)$item->pubDate;
			$content = pruneSection($item->content, "<p>The post <a rel=\"nofollow" , "height=\"1\" width=\"1\"/>");
			$content = pruneRubish($content);
			$description = buildDescription($content);

			if(strlen($title) <= 60){
				$story = array();
				$story["title"] = $title;
				$story["guid"] = $link;
				$story["pupDate"] = $pupDate;
				$story["description"] = $description;
				$story["content"] = $content;
				$result[] = $story;
			}	
		}
		
		return $result;
	}
	
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
