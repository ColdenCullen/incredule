var Class = function( table ) {
	function getElementByIdStart( id ) {
		return table.querySelector( "span[id^=" + id + "]" ).innerText;
	}

	// Get name
	this.name = table.rows[ 0 ].innerText;

	// Get start and end date
	this.dateRange = getElementByIdStart( "MTG_DATES" );
	this.startDate = new Date( this.dateRange.split( "-" )[0].trim() );
	this.endDate = new Date( this.dateRange.split( "-" )[1].trim() );

	// Get location
	this.location = getElementByIdStart( "MTG_LOC" );

	// Get days and times
	this.daysAndTimes = getElementByIdStart( "MTG_SCHED" );
	this.days = this.daysAndTimes.split( " " )[ 0 ].trim();
	this.times = this.daysAndTimes.split( " " ).splice( 1 ).join( "" ).trim();
	this.startTime = this.times.split( "-" )[ 0 ];
	this.endTime = this.times.split( "-" )[ 1 ];
};

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	console.log(gapi);
	var tableItems = document.getElementById( 'ptifrmtgtframe' )
							 .contentDocument
							 .getElementsByClassName( "PSGROUPBOXWBO" ),
		classes = [];

	for( var ii = 1; ii < tableItems.length; ++ii )
		classes.push( new Class( tableItems[ ii ] ) );

	sendResponse( JSON.stringify( classes ) );

	return true;
} );
