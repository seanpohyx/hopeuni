var app = angular.module("hopeUNIapp", [])

/*
 * User info controller
 * load from api and populate front end
 */
app.controller("userInfoCtrl", 
	($scope, $http) => {

		$scope.filterByQuery = (query) => {
			return (username) => {
				return query != null && query != "" && username.toUpperCase().includes(query.toUpperCase())
			}
		}

		$scope.display = (name) => {
			return get_user_info($http, name, sheet_api)
			.then ((value) => {
				$scope.selecteduser = value
				$scope.$apply()
			})
		}


		get_users($http, sheet_api)
		.then ((values) => {
			$scope.heads = values["headers"]
			$scope.usernames = Object.keys(values["users"])
			$scope.userloaded = true
		})
	})

/*
 * Announcement controller
 * load from api and populate front end
 */
app.controller("announcementCtrl", 
	($scope, $http) => {
		get_announcement($http, sheet_api)
		.then((annos) => {
			$scope.annos = Array.prototype.map.call(annos, (anno) => anno[0])
		})
	})


/*
 * Scheduler Controller
 * fetch from api and start countdown
 */
 app.controller("scheduleCtrl", ($scope, $http, $interval) => {
 	const pad_time = (time) => (time < 10) ? "0" + time : time
 	get_schedule($http, sheet_api)
 	.then((data) => {
 		let schedule = data['schedules']
 		const heads = data['headers']
 		const first_event = schedule.shift()
 		const starttime = parseInt(first_event["start time"])
 		let hour = parseInt(starttime / 100)
 		let min = starttime % 100
 		let secs = 0

 		
 		countdown = $interval(() => {
 			$scope.hrs = pad_time(hour)
	 		$scope.min = pad_time(min)
	 		$scope.secs = pad_time(secs)

	 		secs = (secs-- < 1) ? 59 : secs
	 		if (hour == 0 && min == 0 && secs == 0) {
	 			$scope.secs = pad_time(secs)
	 			return stop_interval()
	 		} 
	 		min = (secs < 59) ? min : (min-- < 1) ? 59 : min
	 		hour = (secs < 59 || min < 59) ? hour : (hour == 0) ? hour : hour - 1

	 		
 		}, 1000)
 		let stop_interval = () => { console.log("stop!"); $interval.cancel(countdown)}
 		$scope.heads = heads
 		$scope.nexts = schedule
 	})
 })
			