var tableItems = document.getElementById( 'ptifrmtgtframe' ).contentDocument.getElementsByClassName( "PSGROUPBOXWBO" );
var classes = [];

for( var ii = 1; ii < tableItems.length; ++ii )
	classes.push( tableItems[ ii ] );

var linqjs = '//cdnjs.cloudflare.com/ajax/libs/linq.js/2.2.0.2/linq.min.js';
