chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	console.log( "Request received: " + request );

	if( true )
		sendResponse( "goodbye" );

	return true;
});
