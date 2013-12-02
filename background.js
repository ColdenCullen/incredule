function Class( object ) {
	object.startDate = new Date( object.startDate );
	object.endDate = new Date( object.endDate );

	return object;
}

function load() {
	//gapi.client.setApiKey( 'KEY' );

	// Initialize authorization
	gapi.auth.init( function() {
		// When you click the button...
		chrome.browserAction.onClicked.addListener( buttonClick );
	} );
}

function buttonClick() {
	// Execute our page-side script
	chrome.tabs.executeScript( { file: "foreground.js" } );

	var config = {
		client_id: config.client_id,
		scope: "https://www.googleapis.com/auth/calendar",
		immediate: true
	};

	gapi.auth.authorize( config, function( token ) {
		// Get the current tab
		chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
			chrome.tabs.sendMessage( tabs[0].id, "classes", messageResponse );
		} );
	} );
}

function messageResponse( response ) {
	var classes = JSON.parse( response );

	for( var ii = 0; ii < classes.length; ++ii )
		classes[ ii ] = new Class( classes[ ii ] );

	console.log( classes[ 0 ] );
	console.log( gapi.client );

	gapi.client.load( 'calendar', 'v3', function() {
		console.log( gapi.client );
	} );
}
