chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.executeScript( null, { file: "linq.min.js" }, function() {
	
		var jsonArray = [
			{ "user": { "id": 100, "screen_name": "d_linq" }, "text": "to objects" },
			{ "user": { "id": 130, "screen_name": "c_bill" }, "text": "g" },
			{ "user": { "id": 155, "screen_name": "b_mskk" }, "text": "kabushiki kaisha" },
			{ "user": { "id": 301, "screen_name": "a_xbox" }, "text": "halo reach" }
		]
		// ["b_mskk:kabushiki kaisha", "c_bill:g", "d_linq:to objects"]
		var queryResult = Enumerable.From(jsonArray)
			.Where(function (x) { return x.user.id < 200 })
			.OrderBy(function (x) { return x.user.screen_name })
			.Select(function (x) { return x.user.screen_name + ':' + x.text })
			.ToArray();

		alert( "queryResult" );
	} );

	alert( "SCRIPT THANG" );
});