var Class = function( table ) {
	this.name = table.rows[ 0 ].innerText;
	console.log( this.name );
};

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {

	var tableItems = document.getElementById( 'ptifrmtgtframe' ).contentDocument.getElementsByClassName( "PSGROUPBOXWBO" );
	var classes = [];

	for( var ii = 1; ii < tableItems.length; ++ii )
		classes.push( new Class( tableItems[ ii ] ) );

	sendResponse( classes );

	return true;
} );
