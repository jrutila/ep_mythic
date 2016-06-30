function Mythic(fFocus , fPoints) {

	//fate table
	var fateArray = new Array();

	fateArray[0] = new Array( 50, 25, 15, 10,  5,  5,  0,  0,-20);
	fateArray[1] = new Array( 75, 50, 35, 25, 15, 10,  5,  5,  0);
	fateArray[2] = new Array( 85, 65, 50, 45, 25, 15, 10,  5,  5);
	fateArray[3] = new Array( 90, 75, 55, 50, 35, 20, 15, 10,  5);
	fateArray[4] = new Array( 95, 85, 75, 65, 50, 35, 25, 15, 10);
	fateArray[5] = new Array( 95, 90, 85, 80, 65, 50, 45, 25, 20);
	fateArray[6] = new Array(100, 95, 90, 85, 75, 55, 50, 35, 25);
	fateArray[7] = new Array(105, 95, 95, 90, 85, 75, 65, 50, 45);
	fateArray[8] = new Array(115,100, 95, 95, 90, 80, 75, 55, 50);
	fateArray[9] = new Array(125,110, 95, 95, 90, 85, 80, 65, 55);
	fateArray[10]= new Array(145,130,100,100, 95, 95, 90, 85, 80);
	
	//focus table
	var focusArray = new Array();

	focusArray[0] = new Array("5/Standard game.  Regular fate chart rules." , "1/7/Remote event" , "8/28/NPC action" , "29/35/Introduce a new NPC" , "36/45/Move towards a thread" , "46/52/Move away from a thread" , "53/55/Close a thread" , "56/67/PC negative" , "68/75/PC positive" , "76/83/Ambiguous event" , "84/92/NPC negative" , "93/100/NPC positive");

	focusArray[1] = new Array("4/Horror: the game starts with the Chaos Factor set to 4.  Chaos can only increase, not decrease.  When random events are generated, results of 1 to 3 within the Chaos Factor are altered scenes.  Any higher numbers will be interrupts." , "1/10/Horror - PC" , "11/23/Horror - NPC" , "24/30/Remote Event" , "31/49/NPC action" , "50/52/Introduce an NPC" , "53/55/Move toward a thread" , "56/62/Move away from a thread" , "63/72/PC Negative" , "73/75/PC positive" , "76/82/Ambiguous event" , "83/97/NPC negative" , "98/100/NPC positive");
	
	focusArray[2] = new Array("5/Action adventure: Double rolls on the Fate chart always result in a random event, whether they fall within the Chaos Facotr range or not.  Chaos cannot fall below 5.  Any scene which would normally lower the Chaos below 5 leaves it unchanged." , "1/16/Action!" , "17/24/Remote event" , "25/44/NPC action" , "45/52/Introduce an NPC" , "53/56/Move toward a thread" , "57/64/Move away from a thread" , "65/76/PC negative" , "77/80/PC positive" , "81/84/Ambiguous event" , "85/96/NPC negative" , "97/100/NPC positive");
	
	focusArray[3] = new Array("5/Mystery: the Chaos Factor cannot fall below 3.  Any scene which would normally lower the Chaos below 3 leaves it unchanged." , "1/8/Remote event" , "9/20/NPC action" , "21/32/Introduce an NPC" , "33/52/Move toward a thread" , "53/64/Move away from a thread" , "65/72/PC negative" , "73/80/PC positive" , "81/88/Ambiguous event" , "89/96/NPC negative" , "97/100/NPC positive");
	
	focusArray[4] = new Array("5/Social game: this game uses standard Chaos rules." , "1/12/Drop a bomb!" , "13/24/Remote event" , "25/36/NPC action" , "37/44/Introduce an NPC" , "45/56/Move toward a thread" , "57/60/Move away from a thread" , "61/64/Close a thread" , "65/72/PC negative" , "73/80/PC positive" , "81/92/Ambiguous event" , "93/96/NPC negative" , "7/100/NPC positive");
	
	focusArray[5] = new Array("5/Personal game: this game uses standard Chaos rules." , "1/7/Remote event" , "8/24/NPC action" , "25/28/PC NPC action" , "29/35/Introduce an NPC" , "36/42/Move toward a thread" , "43/45/Move toward a PC thread" , "46/50/Move away from a thread" , "51/52/Move away from a PC thread" , "53/54/Close thread" , "55/55/Close PC thread" , "56/67/PC negative" , "68/75/PC positive" , "76/83/Ambiguous event" , "84/90/NPC negative" , "91/92/PC NPC negative" , "93/99/NPC positive" , "100/100/PC NPC positive");
	
	focusArray[6] = new Array("5/Epic game: the Chaos Factor cannot fall below 3.  Any scene which would normally lower the Chaos below 3 leaves it unchanged." , "1/12/Thread escalates" , "13/16/Remote event" , "17/30/NPC action" , "31/42/Introduce an NPC" , "43/46/Move toward a thread" , "47/58/Move away from a thread" , "59/72/PC negative" , "73/80/PC positive" , "81/84/Ambiguous event" , "85/92/NPC negative" , "93/100/NPC positive");

	//action chart
	var fActionArray = new Array(
	"Attainment" , "Starting" , "Neglect" , "Fight" , "Recruit" , "Triumph" , "Violate" , "Oppose" , "Malice" , "Communicate" , "Persecute" , "Increase" , "Decrease" , "Abandon" , "Gratify" , "Inquire" , "Antagonise" , "Move" , "Waste" , "Truce" , 
	"Release" , "Befriend" , "Judge" , "Desert" , "Dominate" , "Procrastinate" , "Praise" , "Separate" , "Take" , "Break" , "Heal" , "Delay" , "Stop" , "Lie" , "Return" , "Imitate" , "Struggle" , "Inform" , "Bestow" , "Postpone" , 
	"Expose" , "Haggle" , "Imprison" , "Release" , "Celebrate" , "Develop" , "Travel" , "Block" , "Harm" , "Debase" , "Overindulge" , "Adjourn" , "Adversity" , "Kill" , "Disrupt" , "Usurp" , "Create" , "Betray" , "Agree" , "Abuse" , 
	"Oppress" , "Inspect" , "Ambush" , "Spy" , "Attach" , "Carry" , "Open" , "Carelessness" , "Ruin" , "Extravagance" , "Trick" , "Arrive" , "Propose" , "Divide" , "Refuse" , "Mistrust" , "Deceive" , "Cruelty" , "Intolerance" , "Trust" , 
	"Excitement" , "Activity" , "Assist" , "Care" , "Negligence" , "Passion" , "Work hard" , "Control" , "Attract" , "Failure" , "Pursue" , "Vengeance" , "Proceedings" , "Dispute" , "Punish" , "Guide" , "Transform" , "Overthrow" , "Oppress" , "Change"
	);

	//subject chart
	var fSubjectArray = new Array(
	"Goals" , "Dreams" , "Environment" , "Outside" , "Inside" , "Realities" , "Allies" , "Enemies" , "Evil" , "Good" , "Emotions" , "Opposition" , "War" , "Peace" , "The innocent" , "Love" , "The spiritual" , "The intellectual" , "New ideas" , "Joy" , 
	"Messages" , "Energy" , "Balance" , "Tension" , "Friendship" , "The physical" , "A project" , "Pleasures" , "Pain" , "Possessions" , "Benefits" , "Plans" , "Lies" , "Expectations" , "Legal matters" , "Bureaucracy" , "Business" , "A plan" , "News" , "Exterior factors" ,
	"Advice" , "A plot" , "Competition" , "Prison" , "Illness" , "Food" , "Attention" , "Success" , "Failure" , "Travel" , "Jealously" , "Dispute" , "Home" , "Investment" , "Suffering" , "Wishes" , "Tactics" , "Stalemate" , "Randomness" , "Misfortune" , 
	"Death" , "Disruption" , "Power" , "A burden" , "Intrigues" , "Fears" , "Ambush" , "Rumour" , "Wounds" , "Extravagance" , "A representative" , "Adversities" , "Opulance" , "Liberty" , "Military" , "The mundane" , "Trials" , "Masses" , "Vehicle" , "Art" , 
	"Victory" , "Dispute" , "Riches" , "Status quo" , "Technology" , "Hope" , "Magic" , "Illusions" , "Portals" , "Danger" , "Weapons" , "Animals" , "Weather" , "Elements" , "Nature" , "The public" , "Leadership" , "Fame" , "Anger" , "Information"
	);

	var ChaosFactor = 0;
	var gameDescrip = "";
	var favourPoints = 0;
	var gameChart = new Array();

	this.fFocus = fFocus || 0; //Standard, Horror, Action, Mystery, Social, Personal, Epic
	fFocus = this.fFocus;
	this.fPoints = fPoints;
	var tempArray = focusArray[fFocus][0].split("/");

	for(i=0 ; i<focusArray[fFocus].length ; i++)
		gameChart[i] = new Array(0 , 0 , "");
		
	//set starting chaos factor
	this.ChaosFactor = parseInt(tempArray[0]);
	this.Threads = {};
	//get game description
	gameDescrip = tempArray[1];
	//set starting Favour Points
	favourPoints = fPoints || 0;
	
	//select focus chart to use for game
	for(i=1 ; i<focusArray[fFocus].length ; i++) {
		tempArray = focusArray[fFocus][i].split("/");
		for(j=0 ; j<tempArray.length ; j++) {
			if((j+1)%3 != 0)
				gameChart[i][j] = parseInt(tempArray[j]);
			//end if
			else
				gameChart[i][j] = tempArray[j];
			//end else
		}//end for
	}//end for

	this.getOdds = function(fDown , fAcross) {
		this.fDown = fDown;
		this.fAcross = fAcross;
		var gArray = new Array(0 , 0 , 0);
		
		if(0 <= fDown <=10) {
			if(0 <= fAcross <= 8) {
				//odds for success
				gArray[1] = fateArray[fDown][fAcross];
				//odds for exceptional yes
				if(gArray[1] >= 5)
					gArray[0] = Math.ceil(gArray[1] / 5);
				//end if
				//odds for exceptional no
				if(gArray[1] <= 95)
					gArray[2] = Math.ceil(gArray[1] + (((100 - gArray[1]) * 0.8)+1));
				//end if
			}//end if
			else
				for(i=0 ; i<gArray.length ; i++)
					gArray[i] = -1;
			//end if-else
		}//end if
		else 
			for(i=0 ; i<gArray.length ; i++)
				gArray[i] = -1;
		//end else
		
		return gArray;
	}//end func getOdds

	this.roll = function(fDown , fAcross) {
		this.fDown = fDown;
		this.fAcross = fAcross;
		var rOdds = this.getOdds(fDown , fAcross);
		var rInt = Math.ceil(Math.random()*100);
		var returnArray = new Array(0 , "");

		if(isNaN(fDown) || isNaN(fAcross))
			returnArray[0] = -1;
		//end if
		else {
			returnArray[0] = rInt;
			if(rInt <= rOdds[0])
				returnArray[1] = "EXCEPTIONAL YES";
			//end if
			else {
				if(rInt > rOdds[0] && rInt < rOdds[1])
					returnArray[1] = "Yes";
				//end if
				else {
					if(rInt > rOdds[1] && rInt < rOdds[2])
						returnArray[1] = "No";
					//end if
					else
						returnArray[1] = "EXCEPTIONAL NO";
					//end else
				}//end else
			}//end else
		}//end else

		return returnArray;
	}//end func roll

	this.getFocus = function(fNum) {
		this.fNum = fNum;
		var gCnt = 1;
		
		if(!fNum || fNum < 1 || fNum >100)
			return -1;
		//end if
		else {
			while(fNum > gameChart[gCnt][1])
				gCnt++;
			//end while
			return gameChart[gCnt][2];
		}//end else
	}//end func getFocus
	
	this.getFocusChart = function() {
		var returnArray = this.gameChart;
		
		return returnArray;
	}//end func getFocusChart
	
	this.getFocusNum = function() {
		return fFocus;
	}//end func getFocusNum
	
	this.getGameDescrip = function() {
		var dArray = focusArray[fFocus].split("/");
		
		return dArray[1];
	}//end func getGameDescrip
	
	this.getRandom = function() {
		var gText = fActionArray[Math.ceil(Math.random()*100)] + "/" + fSubjectArray[Math.ceil(Math.random()*100)];

		return gText;
	}//end func getRandom

	this.getChaos = function() {

		return this.ChaosFactor;
	}//end func getChaos
	
	this.chaosUp = function() {
		if(this.ChaosFactor < 9)
			this.ChaosFactor++;
		//end if

		return this.ChaosFactor;
	}//end func chaosUp
	
	this.setChaos = function(chaos) {
	    this.ChaosFactor = chaos;
	}
	
	//Standard, Horror, Action, Mystery, Social, Personal, Epic
	this.chaosDown = function() {
		var cFocus = parseInt(fFocus);
		var cLimit = 0;

		switch (cFocus) {
			case 0 :
			case 4 :
			case 5 :
				cLimit = 1;
				break;
			case 1 :
				cLimit = 4;
				break;
			case 2 :
				cLimit = 5;
				break;
			case 3 :
			case 6 :
				cLimit = 3;
				break;
			default :
				cLimit = 1;
		}//end switch
		if(this.ChaosFactor > cLimit)
			this.ChaosFactor--;
		//end if

		return this.ChaosFactor;
	}//end func chaosDown

	this.getFavour = function() {

	return favourPoints;
	}//end func getFavour

	this.favourUp = function(howFar) {
		this.howFar = howFar;

		favourPoints += howFar;

		return favourPoints;
	}//end func favourUp
	
	this.favourDown = function(howFar) {
		this.howFar = howFar;

		favourPoints -= howFar;

		return favourPoints;
	}//end func favourUp

	this.getGameDescrip = function() {

		return gameDescrip;
	}//end func getGameDescrip
	
}

exports.engine = Mythic