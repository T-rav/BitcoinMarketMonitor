CREATE TABLE marketData(
	rID int NOT NULL,
	symbol varchar(40) NOT NULL,
	average decimal(20,4) NOT NULL AUTO_INCREMENT,
	volume decimal(20,4) NOT NULL,
	ask decimal(20,4) NOT NULL,
	bidPrice decimal(20,4) NOT NULL,
	closePrice decimal(20,4) NOT NULL,
	lastTradeMinutes long NOT NULL,
	rTS TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (rID)
) ENGINE=MyISAM;

-- TODO : Create Agergate Table ;)