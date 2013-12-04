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
		document.getElementById('button').onclick = buttonClick;
	} );
}

function buttonClick( event ) {
	// Execute our page-side script
	chrome.tabs.executeScript( { file: "foreground.js" } );
	gapi.client.setApiKey(config.api_key);
	authorize();
}

function authorize() {
	gapi.auth.authorize( config, function (token) {
		if( !token ) {
			config.immediate = false;
			authorize();
			config.immediate = true;
		} else {
			// Get the current tab
			chrome.tabs.query( { active: true, currentWindow: true }, function(tabs ) {
				chrome.tabs.sendMessage( tabs[0].id, "classes", messageResponse );
			} );
		}
	} );
}

function messageResponse( response ) {
	var classes = JSON.parse( response );

	for( var ii = 0; ii < classes.length; ++ii )
		classes[ ii ] = new Class( classes[ ii ] );

	gapi.client.load( 'calendar', 'v3', function() {
		gapi.client.calendar.calendarList.list().execute( function (response) {
			var calendars = response.items.filter( function (item) {
				return item.accessRole == "owner" ||
					   item.accessRole == "writer";
			} );

			addItems( calendars.filter( function (cal) {
				return cal.summary == "Incredule Test";
			} )[ 0 ], classes )
		});
	} );
}

function addItems( calendar, classes ) {
	for( var ii = classes.length - 1; ii >= 0; ii-- ) {
		var cur = classes[ ii ];

		cur.start = new Date();
		cur.start.setTime( cur.startTime );
		cur.start.setDate( cur.startDate.getDate() );
		cur.start.setMonth( cur.startDate.getMonth() );
		cur.start.setYear( '2013' );
		cur.end = new Date();
		cur.end.setTime( cur.endTime );
		cur.end.setDate( cur.startDate.getDate() );
		cur.end.setMonth( cur.startDate.getMonth() );
		cur.end.setYear( '2013' );

		console.log( cur );

		var request = gapi.client.calendar.events.insert( {
			calendarId: calendar.id,
			resource: {
				summary: cur.name,
				location: cur.location,
				start: {
					dateTime: cur.start.toJSON()
				},
				end: {
					dateTime: cur.end.toJSON()
				}/*,
				recurrence: [
					""
				]*/
			}
		} ).execute( function (response) {
			console.log( response );
		} );
	};
}
