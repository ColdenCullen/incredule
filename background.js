(function() {
	function sendMessage( tabid, request, callback ) {
		chrome.tabs.sendMessage( tabid, request, function( response ) {
			callback( response );
		} );
	}

	// When you click the button...
	chrome.browserAction.onClicked.addListener( function () {
		// Execute our page-side script
		chrome.tabs.executeScript( { file: "foreground.js" } );

		// Get the current tab
		chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
			sendMessage( tabs[0].id, "classes", function( response ) {
				console.log( "Response: " + response );
			} );
		} );
	} );
} )();
