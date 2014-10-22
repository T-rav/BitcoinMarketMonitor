<?php
	
	ini_set('display_errors', true);
	error_reporting(E_ALL);

	$data = fetchData();

	// TODO : make it more meaningful
	$convertedData = convertFromJson($data);
	$result = buildCache($convertedData);
	
	$returnData = convertToJson($result);
	writeCacheData($returnData);
	
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
		
		return false;
	}

	function fetchData(){
	
		$url = "http://api.bitcoincharts.com/v1/markets.json";
	
		$data = file_get_contents($url);
	
		return $data;
	}

?>