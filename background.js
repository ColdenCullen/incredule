(function() {
	var tabId;

	// Execute our page-side script
	chrome.tabs.executeScript( { file: "foreground.js" }, function() {
		// Get the current tab
		chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
			tabId = tabs[0].id;
		} );
	} );

	function sendMessage( request, callback ) {
		chrome.tabs.sendMessage( tabId, request, function( response ) {
			callback( response );
		} );
	}

	// When you click the button...
	chrome.browserAction.onClicked.addListener( function () {
		sendMessage( "Hello", function( response ) {
			console.log( "Response: " + response );
		} );
	});
})();

/*
var tableItems = document.getElementById( 'ptifrmtgtframe' ).contentDocument.getElementsByClassName( "PSGROUPBOXWBO" );
var classes = [];

for( var ii = 1; ii < tableItems.length; ++ii )
	classes.push( tableItems[ ii ] );

alert( classes );
*/