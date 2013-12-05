var calendars = [].
    classes;

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
	classes = JSON.parse( response );

	for( var ii = 0; ii < classes.length; ++ii )
		classes[ ii ] = new Class( classes[ ii ] );

	gapi.client.load( 'calendar', 'v3', function() {
		gapi.client.calendar.calendarList.list().execute( function (response) {
			calendars = response.items.filter( function (item) {
				return item.accessRole == "owner" ||
					   item.accessRole == "writer";
			} );

            populatePopup();
/* 
            addItems( calendars.filter( function (cal) {
				return cal.summary == "Incredule Test";
			} )[ 0 ], classes )
*/
		});
	} );
}

function populatePopup() {
    var html = '<ul class="calendar-list">',
        i = 0;
    calendars.forEach( function ( calendar ) {
        html += '<li>';
        html += '<div class="color" style="background-color:' 
            + calendar.backgroundColor  + ';"></div>';
        html += '<button class="get-calendar" id="' + i + '">Use Calendar</button>';
        html += '<h3>' + calendar.summary + '</h3>';
        if( calendar.description )
            html += '<p>' + calendar.description + '</p>';
        html += '</li>';
        i++;
    });
    html += '</ul>';
    document.querySelector('#content').innerHTML = html;
    for (var i = 0; i < calendars.length; i++) {
        document.getElementById(i).onclick = getCalendar;
    };
}

function getCalendar( event ) {
    addItems(calendars[event.srcElement.id], classes)
}

function addItems( calendar, classes ) {
	for( var ii = classes.length - 1; ii >= 0; ii-- ) {
        console.log(cur);
		var cur = classes[ ii ];

        var startHr = cur.startTime.split(':')[0],
            startMin = cur.startTime.split(':')[1];
        console.log(startHr, startMin);
        if (startMin.indexOf('PM') !== -1) {
            startMin = startMin.split('PM')[0];
            startHr = (parseInt(startHr) % 12) + 12
            console.log(startHr);
        } else {
            startMin = startMin.split('AM')[0];
        }

        var endHr = cur.endTime.split(':')[0],
            endMin = cur.endTime.split(':')[1];

        if (endMin.indexOf('PM') !== -1) {
            endMin = endMin.split('PM')[0];
            endHr = (parseInt(endHr) % 12) + 12;
        } else {
            endMin = endMin.split('AM')[0];
        }

		cur.start = new Date(	cur.startDate.getFullYear(),
								cur.startDate.getMonth(),
								cur.startDate.getDate(),
								startHr,
								startMin,
								0, 0);

		cur.end = new Date(		cur.startDate.getFullYear(),
								cur.startDate.getMonth(),
								cur.startDate.getDate(),
								endHr,
                                endMin,
								0, 0);

		var days = cur.days.match( /.{1,2}/g ).join(',').toUpperCase();
		var endString = "" + cur.endDate.getFullYear() + cur.endDate.getMonth() + cur.endDate.getDate() + "T" + cur.endDate.getHours() + cur.endDate.getMinutes() + cur.endDate.getSeconds() + "-05:00";
		var recurStr = "RRULE:FREQ=WEEKLY;UNTIL=" + endString + ";BYDAY=" + days;
		console.log( recurStr );

		var request = gapi.client.calendar.events.insert( {
			calendarId: calendar.id,
			resource: {
				summary: cur.name,
				location: cur.location,
				start: {
					dateTime: cur.start.toJSON(),
					timeZone: calendar.timeZone
				},
				end: {
					dateTime: cur.end.toJSON(),
					timeZone: calendar.timeZone
				},
				recurrence: [
					recurStr
				]
			}
		} ).execute( function (response) {
			console.log( response );
		} );
	};
}
