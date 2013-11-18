chrome.browserAction.onClicked.addListener(function () {
	
	var tableItems = document.getElementById( 'ptifrmtgtframe' ).contentDocument.getElementsByClassName( "PSGROUPBOXWBO" );
	var classes = [];

	for( var ii = 1; ii < tableItems.length; ++ii )
		classes.push( tableItems[ ii ] );

	alert( classes );
});
