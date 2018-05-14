var app = angular.module("hopeUNIapp", [])

app.controller("userInfoCtrl", 
	($scope, $http) => {

		$scope.filterByQuery = (query) => {
			return (username) => {
				return query != null && query != "" && username.toUpperCase().includes(query.toUpperCase())
			}
		}

		$scope.display = (name) => {
			return get_user_sheet($http, name, sheet_api)
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

app.controller("announcementCtrl", 
	($scope, $http) => {
		get_announcement($http, sheet_api)
		.then((annos) => {
			$scope.annos = Array.prototype.map.call(annos, (anno) => anno[0])
		})
	})
			