<?php
	
	ini_set('display_errors', true);
	error_reporting(E_ALL);

	$jqueryFormat = isset($_GET['jsoncallback']);
	
	// Additional Feeds ;)
	// https://cex.io/api/ticker/BTC/USD
	// https://cex.io/api/ticker/BTC/EUR
	
	// https://btc-e.com/api/3/ticker/btc_usd
	// + rur , eur, cnh , gbp 
	
	// bitstamp ?
	
	// https://api.kraken.com/0/public/Ticker?pair=XBTEUR,XBTUSD
	
	// https://data.btcchina.com/data/ticker?market=btccny
	
	// https://www.okcoin.com/api/ticker.do?ok=1
	
	// https://justcoin.com/developers - Look into
	
	// https://bitkonan.com/api/ticker
	
	// https://btcxindia.com/api/ticker
	
	// https://crypto-trade.com/api/1/tickers
	
	// Need to mash up to get correct data ;)
	// https://www.igot.com/developer/api/stats/buy
	// https://www.igot.com/developer/api/stats/sell
	
	// mexican pasios
	// https://api.bitso.com/v2/ticker?book=btc_mxn
	
	// https://api.btcmarkets.net/market/BTC/AUD/tick
	
	// coinbase?
	
	// set header to only accept json - https://cryptonit.net/documentation/public-api
	// http://cryptonit.net/apiv2/rest/public/ccorder?bid_currency=eur&ask_currency=btc&ticker
	// usd, eur
	
	// https://api.coinsetter.com/v1/marketdata/ticker
	
	// http://data.bter.com/api/1/tickers
	// http://data.bter.com/api/1/ticker/btc_cny
	// http://data.bter.com/api/1/ticker/btc_usd
	
	// https://www.lakebtc.com/api_v1/ticker
	
	// https://anxpro.com/api/2/btcusd/money/ticker
	// BTCUSD,BTCHKD,BTCEUR,BTCCAD,BTCAUD,BTCSGD,BTCJPY,BTCCHF,BTCGBP,BTCNZD
	
	// https://1wbe.com/api/ticker/btc-usd
	
	// https://www.cavirtex.com/api2/ticker.json
	
	// https://api.hitbtc.com/api/1/public/BTCUSD/ticker
	// BTCEUR, BTCUSD
	
	// http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=2
	// USD = 2, 
	
	// BEST SRC : https://www.quandl.com/c/markets/bitcoin-data
	if(updateCache()){
		
		$data = fetchData();

		// TODO : make it more meaningful
		$convertedData = convertFromJson($data);
		$result = buildCache($convertedData);
		
		$returnData = convertToJson($result);
		writeCacheData($returnData);
	}

	$data = readCacheData();
	if($jqueryFormat){
		header('Content-Type:application/x-javascript');
		$fnName = $_GET['jsoncallback'];
		echo $fnName." (".$data.")";
	}else{
		header('Content-Type:text/json');
		echo $data;
	}	
	
	// --- END	
	function buildCache($data){
		$result = array();
		
		foreach ($data as &$value) {
			$key = $value["currency"];
			
			if(!array_key_exists($key, $result)){
				$result[$key] = array();
			}

			$lastTradeTS = $value["latest_trade"];
			$currentTS = time();
			
			$diff = ($currentTS - $lastTradeTS)/(60*60);
			$lastTradeMinutes = ($currentTS - $lastTradeTS)/60;
			// 1 week activity 
			if($diff <= 168){
				// // avg, currency_volume
				if($value["avg"] == null){
					$value["avg"] = 0;
				}

				// set data direction ;)
				$directionDiff = $value["close"] - $value["avg"];

				if($directionDiff < 0){
					$value["direction"] = "up";	
				}else if($directionDiff > 0){
					$value["direction"] = "down";
				}else{
					$value["direction"] = "flat";
				}

				if($value["avg"] > 0){
					$value["avg"] = round($value["avg"], 2);
					$value["volume"] = round($value["volume"], 1);
					$value["ask"] = round($value["ask"],2);
					$value["bid"] = round($value["bid"],2);
					$value["close"] = round($value["close"],2);
					$value["symbol"] = str_replace($key, "", $value["symbol"]);
					$value["lastTradeMinutes"] = round($lastTradeMinutes,2);
					$result[$key][] = $value;
				}

			}
		}
		
		// sort it nicely
		ksort(&$result);
		
		foreach($result as &$entry){
			usort($entry,'sortData');
		}
		
		return $result;
	}
	
	function sortData($a, $b){
		$key = "ask";
		if($a[$key] == $b[$key]){
			return 0;
		}
		
		return ($a[$key] > $b[$key]) ? -1 : 1;
	}
	
	function convertFromJson($dataToConvert){
		
		return json_decode($dataToConvert, true);
	}
	
	function convertToJson($dataToDump){
	
		return json_encode($dataToDump, true);
	}
	
	function readCacheData(){
		$fileName = "cache/data.json";
		$myfile = fopen($fileName, "r") or die("Unable to open file!");
		$data = fread($myfile,filesize($fileName));
		fclose($myfile);
		return $data;
	}
	
	function writeCacheData($jsonData){
	
		$file = fopen("cache/data.json","w");
		fwrite($file,$jsonData);
		fclose($file);
	}
	
	function updateCache(){
		$fileName = "cache/data.json";
		$interval = (time() - (60 * 5));
				
		if(!file_exists($fileName)){
			return true;
		}
		
		if(filemtime($fileName) > $interval){
			return true;
		}
		
		//return true;
		return false;
	}


	function fetchData(){
	
		$url = "http://api.bitcoincharts.com/v1/markets.json";
	
		$data = file_get_contents($url);
	
		return $data;
	}

?>
