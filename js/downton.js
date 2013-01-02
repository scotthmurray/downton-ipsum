
var Data = {};

var numParagraphs = 3;
var numSentences = 5;

var phraseTypes = [
	[ "people", "directobjectverbs", "objects" ],
	[ "people", "speakingverbs", "quotations" ],
	[ "quotations", "speakingverbs", "people" ],
	[ "objects", "directobjectverbs", "objects" ]
];

var numbers = [ "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten" ];



//Load all data files
queue()
    .defer(d3.text, "data/adjectives.txt")
    .defer(d3.text, "data/directobjectverbs.txt")
    .defer(d3.text, "data/objects.txt")
    .defer(d3.text, "data/quotations.txt")
    .defer(d3.text, "data/speakingverbs.txt")
    .defer(d3.csv, "data/people.csv")
    .await(ready);

function ready(error, adjectives, directobjectverbs, objects, quotations, speakingverbs, people) {
	if (error) {
		d3.select("#ipsum").text("Oh, my, there has been an error! There shall be no Downton Ipsum today.");		
	} else {

		d3.select("#jswarning").remove();

		//Split text files at line breaks to make arrays
		Data.adjectives = adjectives.split('\n');
		Data.directobjectverbs = directobjectverbs.split('\n');
		Data.objects = objects.split('\n');
		Data.quotations = quotations.split('\n');
		Data.speakingverbs = speakingverbs.split('\n');

		Data.people = people;
		
		//Interactivity
		d3.select("input.numSentences")
			.attr("value", numSentences)
			.on("change", function() {
				deselectText();
				numSentences = this.value;
				updateSpans();
				generateIpsum();
			});

		d3.select("input.numParagraphs")
			.attr("value", numParagraphs)
			.on("change", function() {
				deselectText();
				numParagraphs = this.value;
				updateSpans();
				generateIpsum();
			});
		
		d3.select("#ipsum").on("click", function() {
			selectText("ipsum");
		});
		
		//Fill values
		updateSpans();

		//Make the ipsum
		generateIpsum();
		
	}
}



var updateSpans = function() {

	//numParagraphs
	d3.select("span.numParagraphs").text(function() {
		if (numParagraphs == 1) {
			return numbers[numParagraphs] + " paragraph";
		} else {
			return numbers[numParagraphs] + " paragraphs";
		}
	});
	
	//numSentences
	d3.select("span.numSentences").text(function() {
		if (numSentences == 1) {
			return numbers[numSentences] + " sentence each";
		} else {
			return numbers[numSentences] + " sentences each";
		}
	});
	
};



var generateIpsum = function() {

	var ipsum = "";

	for (var i = 0; i < numParagraphs; i++) {
		ipsum += "<p>";
		for (var j = 0; j < numSentences; j++) {
			var newPhraseTypeID = Math.round( Math.random() * phraseTypes.length );
			if (newPhraseTypeID == phraseTypes.length) {
				newPhraseTypeID--;
			}
			ipsum += generatePhrase(newPhraseTypeID);
		}
		ipsum += "</p>";
	}

	d3.select("#ipsum").html(ipsum);
};



var generatePhrase = function(phraseID) {
	var phrase = "";
	var phraseType = phraseTypes[phraseID];
	for (var i = 0; i < phraseType.length; i++) {
		
		//Add opening “ for quotations
		if (phraseType[i] == "quotations") {
			phrase += "&ldquo;";
		}
		
		phrase += lookupPiece(phraseType[i]);

		//If it's an object and this is the start of the sentence
		if (phraseType[i] == "objects") {
			//Capitalize the first letter
			var letter = phrase[0].toUpperCase();
			phrase = letter + phrase.slice(1, phrase.length);
		}
		
		//If it's a quotation
		if (phraseType[i] == "quotations") {
			//and this isn't yet the end of the phrase, then change the last punctuation to a comma
			if (i < phraseType.length - 1) {
				phrase = phrase.slice(0, phrase.length - 1);
				phrase += ",";
			}
			//For quotations, always add closing ”
			phrase += "&rdquo; ";
		} else if (i < phraseType.length - 1) {
			//If there will be another piece after this
			
			//If the next one is a quotation, then add a comma
			if (phraseType[i+1] == "quotations") {
				phrase += ",";
			}
			
			//Add a space
			phrase += " ";
		} else {
			phrase += ". ";
		}

	}
	return phrase;
};



var lookupPiece = function(phraseType) {
	
	var length = Data[phraseType].length;
	
	var pieceID = Math.round( Math.random() * length );
	if (pieceID == length) {
		pieceID--;
	}

	//Special handling for people
	if (phraseType == "people") {
		return lookupName();
	} else {
		return Data[phraseType][pieceID];	
	}
};



var lookupName = function() {

	var nameID = Math.round( Math.random() * Data.people.length );
	if (nameID == Data.people.length) {
		nameID--;
	}

	var n = Math.round( Math.random() );

	switch (n) {

		//Full name		
		case 0:
			return Data.people[nameID].fullname;
			break;
		
		//Title + last name
		case 1:
			return Data.people[nameID].title + " " + Data.people[nameID].lastname;
			break;
				
		default:
			return Data.people[nameID].title + " " + Data.people[nameID].lastname;
			break;
		
	}

};



// Code adapted from: http://stackoverflow.com/a/987376
var selectText = function(element) {

	var doc = document,
		text = doc.getElementById(element),
		range,
		selection;

	if (doc.body.createTextRange) { //ms
		range = doc.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	} else if (window.getSelection) { //all others
		selection = window.getSelection();
		range = doc.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
	
};



// Code adapted from: http://help.dottoro.com/ljigixkc.php
var deselectText = function() {
	if (window.getSelection) {  // All browsers, except <= IE8
		var selection = window.getSelection();                                        
		selection.removeAllRanges();
	} else {
		if (document.selection.createRange) { // <= IE8
			var range = document.selection.createRange ();
			document.selection.empty ();
		}
	}
};














