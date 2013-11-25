(function() {
	var gCalendarUrl = "https://www.googleapis.com/calendar/v3";

	function Class( object ) {
		object.startDate = new Date( object.startDate );
		object.endDate = new Date( object.endDate );

		return object;
	}

	// When you click the button...
	chrome.browserAction.onClicked.addListener( function () {
		// Execute our page-side script
		chrome.tabs.executeScript( { file: "foreground.js" } );

		// Get the current tab
		chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
			chrome.tabs.sendMessage( tabs[0].id, "classes", function( response ) {
				var classes = JSON.parse( response );

				for( var ii = 0; ii < classes.length; ++ii )
					classes[ ii ] = new Class( classes[ ii ] );

				console.log( classes[ 0 ]);
			} );
		} );
	} );
} )();
