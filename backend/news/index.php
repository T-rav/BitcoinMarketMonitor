<?php

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
	processRSS($data);
	//fetchRawRSS($feedburner);
	//fetchRawRSS($cryptonews);
	
	function fetchData($url){
	
		$data = file_get_contents($url);

		return $data;
	}
	
	function processRSS($data){
		
		$xml = simplexml_load_string($data, null, LIBXML_NOCDATA);

		var_dump($xml);
		
		/*
		foreach($xml->channel->item as $item){
			// title, link, description -> Prune junk out ;)
			// pubDate
			// guid - Unique id
			//var_dump($item);
			
			// Prune String
			// <p>The post <a rel="nofollow" href="http://bitcoinmagazine.com/17107/coins-in-the-kingdom-wrap-up/">Coins In The Kingdom Wrap Up</a> appeared first on <a rel="nofollow" href="http://bitcoinmagazine.com">Bitcoin Magazine</a>.</p>
			
			$title = $item->title;
			
			//$title = str_replace("'", "", $title);
			//$title = str_replace(";", "", $title);
			//$title = str_replace("‘", "", $title);
			//$title = preg_replace('/\s+?(\S+)?$/', '', substr($title, 0, 60));
			
			if(strlen($title) <= 60){
				echo $title." !! "; //" ".$item->content." !!! ";
			}	
		}
		*/
	}
	
?>
