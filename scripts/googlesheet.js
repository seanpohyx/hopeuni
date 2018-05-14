var data = {};

function load_sheet($http, api_obj, sheetname) {
	if (Object.prototype.hasOwnProperty.call(data, sheetname)) {
		console.log ("Cached: " + sheetname)
		return Promise.resolve(data[sheetname])
	}
	console.log("Fetching Data...")
	const sheet_id = api_obj.SHEET_ID 
	const api_key = api_obj.API_KEY
	const url = "https://sheets.googleapis.com/v4/spreadsheets/"+sheet_id+"/values/"+sheetname+"?key="+api_key
	return $http.get(url)
	.then((res) => {
		console.log(res)
		data[sheetname] = res
		return Promise.resolve(res)
	})
}

function get_users($http, api_obj) {
	return load_sheet($http, api_obj, "users")
	.then((res) => {
		values = res.data.values
		headers = values[0]
		let data = {}
		for (var i = 1; i < values.length; i++) {
			var user = {}
			for (var j = 0; j < headers.length; j++) {
				user[headers[j]] = values[i][j]
			}
			data[values[i][0]] = user
		}
		console.log("END Fetching Data...")
		return Promise.resolve({
			"headers": headers,
			"users": data
		})
	})

}

function get_user_sheet($http, name, api_obj) {
	return get_users($http, api_obj)
			.then((data) => {
				return Promise.resolve(data["users"][name])
			})
}

function get_announcement($http, api_obj) {
	return load_sheet($http, api_obj, "announcements")
	.then((res) => {
		return Promise.resolve(res.data.values)
	})
}