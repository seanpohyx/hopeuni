var sheet_cache = {}
var data_cache = {}

// Cache sheet data, to prevent too many api calls
function is_cached_sheet (sheetname) {
	return (Object.prototype.hasOwnProperty.call(sheet_cache, sheetname))
}
function cache_sheet (data, sheetname) {
	sheet_cache[sheetname] = data 
}
function get_cached_sheet (sheetname) {
	return sheet_cache[sheetname]
}

// Cache processed sheet data, to prevent duplicate processing
function cache_processed_sheet (data, processedname) {
	data_cache[processedname] = data
}
function is_cached_processed_sheet (processedname) {
	return (Object.prototype.hasOwnProperty.call(data_cache, processedname))
}
function get_cached_processed_sheet (processedname) {
	return data_cache[processedname]
}


/*
 * Call google sheet api to get data from sheetid/sheetname
 * Returns a promise, that resolves the fetched data 
 */
function load_sheet($http, api_obj, sheetname) {
	if (is_cached_sheet(sheetname)) {
		console.log ("Cached: " + sheetname)
		return Promise.resolve(get_cached_sheet(sheetname))
	}

	// Fetch sheet data
	const sheet_id = api_obj.SHEET_ID 
	const api_key = api_obj.API_KEY
	const url = "https://sheets.googleapis.com/v4/spreadsheets/"+sheet_id+"/values/"+sheetname+"?key="+api_key
	return $http.get(url)
		.then((res) => {
			cache_sheet(res, sheetname)
			return Promise.resolve(res)
		})
}

/*
 * Loads user sheet data and 
 * process the sheet data
 */
function get_users($http, api_obj) {
	const sheetname = "users"

	if (is_cached_processed_sheet(sheetname)) {
		return Promise.resolve(get_cached_processed_sheet(sheetname))
	}

	return load_sheet($http, api_obj, sheetname)
	.then((res) => {

		// Process user sheet data 
		const values = res.data.values
		const headers = values[0]
		let data = {}
		for (let i = 1; i < values.length; i++) {
			let user = {}
			for (let j = 0; j < headers.length; j++) {
				user[headers[j]] = values[i][j]
			}
			data[values[i][0]] = user
		}
		const processed_sheet = {
			"headers": headers,
			"users": data
		}
		cache_processed_sheet(processed_sheet, sheetname)
		return Promise.resolve(processed_sheet)
	})

}

/*
 * Get info of a user
 * the person name should be a key in dictionary
 */
function get_user_info($http, name, api_obj) {
	return get_users($http, api_obj)
			.then((data) => {
				return Promise.resolve(data["users"][name])
			})
}

/*
 * Get announcement from annoucements sheet
 */
function get_announcement($http, api_obj) {
	return load_sheet($http, api_obj, "announcements")
	.then((res) => {
		return Promise.resolve(res.data.values)
	})
}

/*
 * Get schedule from schedule sheet and
 * processed it into an object
 */
function get_schedule($http, api_obj) {
	sheetname = "schedule"
	if (is_cached_processed_sheet(sheetname)) {
		return Promise.resolve(get_cached_processed_sheet(sheetname))
	}

	return load_sheet($http, api_obj, sheetname)
	.then((res) => {
		let data = res.data.values
		let headers = data[0]
		let schedules = []
		for (var i = 1; i < data.length; i++) {
			let schedule = {}
			for (var j = 0; j < headers.length; j++) {
				schedule[headers[j]] = data[i][j]
			}
			schedules.push(schedule)
		}
		let processed_data = {
			headers,
			schedules
		}
		cache_processed_sheet(processed_data, sheetname)
		return Promise.resolve(processed_data)
	})
}