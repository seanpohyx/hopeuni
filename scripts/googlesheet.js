var data = null;

function load_sheet($http, api_obj) {
	if (data != null) {
		console.log ("Cached Data")
		return Promise.resolve(data)
	}

	console.log("Fetching Data...")
	const sheet_id = api_obj.SHEET_ID 
	const api_key = api_obj.API_KEY
	const url = "https://sheets.googleapis.com/v4/spreadsheets/"+sheet_id+"/values/Sheet1?key="+api_key

	return $http.get(url)
	.then((res) => {
		values = res.data.values
		headers = values.shift()
		data = {}
		for (var i = 0; i < values.length; i++) {
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

function get_user_sheet(name, api_obj) {
	return load_sheet(api_obj)
			.then((data) => {
				return Promise.resolve(data[name])
			})

}