var projectsModule = angular.module('projects',['ngResource']);

//TODO: should the project controller be in a different JS?
//TODO: how to store currentProject?
//TODO: is this the best way to store project data
projectsModule.controller('ProjectController', function($scope, $http, $rootScope, Project){

    console.log("Loading ProjectController ---");

    //TODO: Check if there is a better way!!
    $scope.getProjectMembers = function() {
        return $rootScope.currentProject.members;
    }


//Methods in the controller are executed only when called.
    $scope.addProject = function(projectInput) {


        projectInput.pid = Math.floor((Math.random() * 1000) + 1);

        console.log("Project to be added : " + JSON.stringify(projectInput));

        Project.save(projectInput, function (retProject) {
           // console.log("Succeess!!" + retProject.id);
            $scope.statusMessage = "Project successfully saved!";
            // Project.query(function (projectList) {
            //     angular.forEach(projectList, function(project) {
            //         $scope.allProjects.push(project);
            //
            //     });
            // });
        });

    }


});

projectsModule.controller('WorkPackageController',
    function WorkPackageController($scope, $rootScope, NgTableParams,
                                   Project, WorkPackage, Users){

    var wpc = this;

    var workPackagesIds = $rootScope.currentProject.workPackages;
    console.log("workPackagesIds : " + workPackagesIds);

    $scope.allProjectAssignees = [];



    WorkPackage.query({wid: workPackagesIds}, function(originalData){

        console.log("Original Data = " + originalData);
        wpc.tableParams = new NgTableParams({}, {
            dataset: angular.copy(originalData)

        });



        var projectId = $rootScope.currentProject.pid;
        console.log("Current project id = " + projectId);
        Users.query({projectId: projectId}, function(projectAssignees){
            console.log("Project assignees = " + projectAssignees);

            angular.forEach(projectAssignees, function(pAssignee) {

                console.log("Assignee = " + JSON.stringify(pAssignee));
                $scope.allProjectAssignees.push(pAssignee);


            });
        });


    });



    wpc.addRow = function() {
        console.log("Adding a row to the workPackage table");
        this.isEditing = true;
        this.isAdding = true;

        wpc.tableParams.settings().dataset.unshift({
             wid: Math.floor((Math.random() * 1000) + 1),
             subject: "",
             type: "",
             status: "",
             assignee: ""
         });

        wpc.tableParams.sorting({});
        wpc.tableParams.page(1);
        wpc.tableParams.reload();
    }



    wpc.cancel = function() {
        console.log("Cancel changes called");
        this.isEditing = false;
    }
        
   wpc.deleteRow = function(row) {
       console.log("Delete Row.. " + row);
       _.remove(this.tableParams.settings().dataset, function(item){
           console.log("Item = " + item);
           return row === item;
       });

   }

   wpc.saveRow = function(workPackage) {
       // console.log("Saving single row = " + JSON.stringify(workPackage) + "  ID : " + workPackage._id);
        if(workPackage._id){
            //console.log("Yes, I am PUT");
            WorkPackage.update({wid: workPackage.wid}, workPackage, function(successResponse){
                //console.log("Successfully saved a single row : " + JSON.stringify(successResponse));

                $scope.statusMessage = "Workpackage " + workPackage.wid + " updated successfully"

            }, function(errorResponse){
                $scope.statusMessage = errorResponse.data.errmsg;
                console.log("Error Response Code: " + errorResponse.data.code + " message: " + errorResponse.data.errmsg);
            });
        } else {
            WorkPackage.save(workPackage, function(successResponse){
                $scope.statusMessage = "Workpackages created successfully!!";
                $rootScope.currentProject.workPackages.push(workPackage.wid);
                Project.update({pid: $scope.currentProject.pid}, $scope.currentProject, function (successResponse) {
                    $scope.statusMessage = "Workpackage " + workPackage.wid + " added successfully"
                })
            }, function(errorResponse){
                $scope.statusMessage = errorResponse.data.errmsg;
                console.log("Error Response Code: " + errorResponse.data.code + " message: " + errorResponse.data.errmsg);
            });
        }

       this.isEditing = false;

   }

        //TODO: this is not working
        wpc.saveAll = function() {

            var tableDataArr = [];
            var dataArr = this.tableParams.settings().dataset;
            // console.log("Saving data of workPackage table" + JSON.stringify(dataArr));
            // angular.forEach(dataArr, function (da) {
            //     console.log(da.$getDirty);
            //
            // });
            var projectUpdated = $rootScope.currentProject;
            delete projectUpdated.workpackage;
            projectUpdated.workpackage = dataArr;

            this.isEditing = false;


            console.log("New workpackages = " + JSON.stringify(projectUpdated.workpackage));
            WorkPackage.save(projectUpdated.workpackage, function(successResponse){
                $scope.statusMessage = "Workpackages updated successfully!!";
                console.log("Successful response! ");
            }, function(errorResponse){
                $scope.statusMessage = errorResponse.data.errmsg;
                console.log("Error Response Code: " + errorResponse.data.code + " message: " + errorResponse.data.errmsg);
            });
        }

   wpc.hasChanges = function() {
       console.log("Changes = " + wpc.tableParams.$dirty);
   }


});


