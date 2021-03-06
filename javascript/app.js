(function() {
    // create the module and name it App
    var App = angular.module('App', ['ngRoute', 'ui.grid', 'ui.grid.edit',
				     'ui.grid.rowEdit', 'ui.grid.resizeColumns', 'ui.grid.cellNav'])
	.run(function($rootScope) {
	    $rootScope.deleteRow = function() {
		console.log("deleteRow")
            };
	});
    var gData = {}
    /////////////////////////////////////////////////////////////////////////////////////

    App.controller('mainController', function($http, $scope) {
	var localThis = this;
	$http.get('/getSubjects').success(function(data){
	    gData.subjects = data
	});
    });

    /////////////////////////////////////////////////////////////////////////////////////

    App.controller('coursesController', function($http) {
	this.gridOptions = {};
 	this.gridOptions.columnDefs = [
	    { name: 'pk', enableCellEdit: false, visible:false },
	    { name: 'course_name', displayName: 'Course name', enableCellEdit: false },
	    { name: 'subject', displayName: 'Subject', width:110, enableCellEdit: false },
	    { name: 'points', displayName: 'ECTS credits', width:70, enableCellEdit: false },
	    { name: 'date_start', displayName: 'Start date', width:90, enableCellEdit: false },
	    { name: 'date_end', displayName: 'End date', width:90, enableCellEdit: false },
	    { name: 'last_apply_date', displayName: 'Reg deadline', width:90, enableCellEdit: false },
	    { name: 'course_velocity', displayName: 'Tempo (%)', width:80, enableCellEdit: false },
	    { name: 'distance_course', displayName: 'Distance course', width:90, enableCellEdit: false },
	    { name: 'university', displayName: 'Location', width:110, enableCellEdit: false },
	    { name: 'language', displayName: 'Language', width:90, enableCellEdit: false },
	    { name: 'course_url', displayName: 'URL', width:85,
	      cellTemplate: '<a href={{row.entity.course_url}} target="_blank">Course info</a>' , enableCellEdit: false }
	];
	this.gridOptions.enableFiltering = true;
	var localThis = this;
	$http.get('/getCourses').success(function(data){
	    localThis.gridOptions.data = data
	});
    });

    /////////////////////////////////////////////////////////////////////////////////////

    App.controller('editSubjectsController', function($scope, $http) {
	this.subjectToDelete = "";
	localThis = this;
	localThis.sSubject = "";
	localThis.subjectList = null;
	localThis.deletableSubjectList = null;
	localThis.buttonDisable = true;

	$http.get('/getSubjects').success(function(data){
	    localThis.subjectList = data;
	});

	$http.get('/getDeletableSubjects').success(function(data){
	    localThis.deletableSubjectList = data;
	});

	this.setSubject = function(sSubject) {
	    localThis.subjectToDelete = sSubject;
	    localThis.buttonDisable = false;
	};

	this.addSubject = function() {
	    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	    $http({url:'/createSubject',
		   method:'POST',
		   data:$.param({'subject':localThis.sSubject})
		  })
		.success(function(data){
		    localThis.subjectList = data;
		    localThis.sSubject = "";

		    $http.get('/getDeletableSubjects').success(function(data){
			localThis.deletableSubjectList = data;
		    });
		});
	};

	localThis.deleteSubject = function() {
	    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	    $http({url:'/deleteSubject',
		   method:'POST',
		   data:$.param({'subject':localThis.subjectToDelete})
		  })
		.success(function(data){
		    localThis.subjectToDelete = "";
		    localThis.buttonDisable = true;

		    $http.get('/getSubjects').success(function(data){
			localThis.subjectList = data;
		    });
		    
		    $http.get('/getDeletableSubjects').success(function(data){
			localThis.deletableSubjectList = data;
		    });
		});
	};
    });
    
    /////////////////////////////////////////////////////////////////////////////////////

    App.controller('editCoursesController', function($scope, $http, $q, $timeout) {
	var localThis = this;
	localThis.buttonDisable = true;
	localThis.sPk = null;
	this.gridOptions = {rowEditWaitInterval: 20};
 	this.gridOptions.columnDefs = [
	    { name: 'email', enableCellEdit: false, visible:false },
	    { name: 'pk', enableCellEdit: false, visible:false },
	    { name: 'course_name', displayName: 'Course name'},
	    { name: 'subject', displayName: 'Subject', enableCellEdit: true,
	      editableCellTemplate: 'ui-grid/dropdownEditor',
	      editDropdownValueLabel: 'subject',
	      editDropdownIdLabel: 'subject',
	      editDropdownOptionsArray: gData.subjects},
	    { name: 'points', displayName: 'ECTS credits', enableCellEdit: true },
	    { name: 'date_start', displayName: 'Start date'},
	    { name: 'date_end', displayName: 'End date'},
	    { name: 'last_apply_date', displayName: 'Reg deadline', enableCellEdit: true },
	    { name: 'course_velocity', displayName: 'Tempo (%)', enableCellEdit: true },
	    { name: 'distance_course', displayName: 'Distance course', enableCellEdit: true,
	      editableCellTemplate: 'ui-grid/dropdownEditor',
	      editDropdownValueLabel: 'distance_course',
	      editDropdownIdLabel: 'distance_course',
	      editDropdownOptionsArray: [
		  { id: 1, distance_course: 'Yes' },
		  { id: 2, distance_course: 'No' }
	      ]},
	    { name: 'university', displayName: 'Location', enableCellEdit: true },
	    { name: 'language', displayName: 'Language', enableCellEdit: true,
	      editableCellTemplate: 'ui-grid/dropdownEditor',
	      editDropdownValueLabel: 'language',
	      editDropdownIdLabel: 'language',
	      editDropdownOptionsArray: [
		  { id: 1, language: 'English' },
		  { id: 2, language: 'Swedish' }
	      ]},
	    { name: 'course_url', displayName: 'URL', enableCellEdit: true }
	];
	$http.get('/getUserCourses').success(function(data){
	    localThis.gridOptions.data = data
	});

	localThis.addCourse = function() {
	    $http.post('/createCourse').success(function(data){
		localThis.gridOptions.data = data
	    });
	};

	this.deleteCourse = function() {
	    var promise = $q.defer();
	    var selectedRow = localThis.gridApi.cellNav.getFocusedCell();
	    var sPk = selectedRow.row.entity.pk;
	    
	    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	    $http({url:'/deleteCourse',
		   method:'POST',
		   data:$.param({'pk':sPk})
		  })
		.success(function(data){
		    localThis.buttonDisable = true;
		    localThis.sPk = null;
		    localThis.sMsg = '';

		    localThis.gridOptions.data = data;
		    promise.resolve();
		})
		.error(function(data){
		    // Show error message for 5 sec and then reload the data from server
		    localThis.sMessage = "Error deleteing course";
		    $timeout(function() {
			localThis.sMessage = "";
		    }, 5000);
		    
		    $http.get('/getUserCourses').success(function(data){
			localThis.gridOptions.data = data
		    });
		    promise.reject();
		});
	};
	
	this.saveRow = function( rowEntity ) {
	    var promise = $q.defer();
	    localThis.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
	    
	    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	    $http({url:'/updateCourse',
		   method:'POST',
		   data:$.param({'email':rowEntity.email,
		                 'pk':rowEntity.pk,
		                 'course_name':rowEntity.course_name,
				 'subject':rowEntity.subject,
				 'points':rowEntity.points,
				 'date_start':rowEntity.date_start,
				 'date_end':rowEntity.date_end,
				 'last_apply_date':rowEntity.last_apply_date,
				 'course_velocity':rowEntity.course_velocity,
				 'university':rowEntity.university,
				 'course_url':rowEntity.course_url,
				 'distance_course':rowEntity.distance_course,
				 'language':rowEntity.language,
				})
		  })
		.success(function(data){
		    localThis.gridOptions.data = data;
		    promise.resolve();
		})
		.error(function(data){
		    // Show error message for 5 sec and then reload the data from server
		    localThis.sMessage = "Wrong date format, should be YYYY-MM-DD";
		    $timeout(function() {
			localThis.sMessage = "";
		    }, 5000);

		    $http.get('/getUserCourses').success(function(data){
			localThis.gridOptions.data = data
		    });
		    promise.reject();
		});
	};
	
	localThis.gridOptions.onRegisterApi = function(gridApi){
	    //set gridApi on scope
	    localThis.gridApi = gridApi;
	    gridApi.rowEdit.on.saveRow($scope, localThis.saveRow);

	    gridApi.cellNav.on.navigate($scope, function(newRowCol, oldRowCol){
		localThis.sMsg = newRowCol.row.entity.course_name + ', ' + newRowCol.row.entity.subject + ', ' + newRowCol.row.entity.date_start
		localThis.buttonDisable = false;
		localThis.sPk = newRowCol.row.entity.sPk;

		$scope.$apply();
		localThis.currentCourse = newRowCol.row.entity.sPk;
            });
	};
    });

    ////////////////////////////////////////////////////////////////////////////
    // configure routes
    App.config(function($routeProvider) {
	$routeProvider
	// Read only view
	    .when('/', {
		templateUrl : 'static/home.html'
	    })
	// Edit courses view
	    .when('/editCourses/', {
		templateUrl : 'static/editCourses.html'
	    })
	    .when('/editSubjects/', {
		templateUrl : 'static/editSubjects.html'
	    })
    });
})();

