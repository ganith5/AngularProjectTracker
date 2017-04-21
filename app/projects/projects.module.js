var projectsModule = angular.module('projects',['ngResource']);

//TODO: should the project controller be in a different JS?
//TODO: how to store currentProject?
//TODO: is this the best way to store project data
projectsModule.controller('ProjectController', function($scope, $http, $rootScope, Project){

    //console.log("Loading ProjectController ---");

    //TODO: Check if there is a better way!!
    $scope.getProjectMembers = function() {
        return $rootScope.currentProject.members;
    }


//Methods in the controller are executed only when called.
    $scope.addProject = function(projectInput) {


        projectInput.pid = Math.floor((Math.random() * 1000) + 1);

        //console.log("Project to be added : " + JSON.stringify(projectInput));

        Project.save({id: projectInput.pid, action: 'create'}, projectInput, function (retProject) {
           // console.log("Succeess!!" + retProject.id);
            $scope.statusMessage = "Project successfully saved!";

        });

    }


});

projectsModule.controller('WorkPackageController',
    function WorkPackageController($route, $scope, $rootScope, $window, NgTableParams,
                                   Project, WorkPackage, Users){

    var wpc = this;

    var workPackagesIds = $rootScope.currentProject.workPackages;
    //console.log("workPackagesIds : " + workPackagesIds);

    $scope.allProjectAssignees = [];



    WorkPackage.query({wid: workPackagesIds}, function(originalData){

        //console.log("Original Data = " + originalData);
        wpc.tableParams = new NgTableParams({}, {
            dataset: angular.copy(originalData)

        });



        var projectId = $rootScope.currentProject.pid;
       // console.log("Current project id = " + projectId);
        Users.query({projectId: projectId}, function(projectAssignees){
            //console.log("Project assignees = " + projectAssignees);

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
        //console.log("Cancel changes called");
        this.isEditing = false;
    }
        
   wpc.deleteRow = function(row) {
      // console.log("Delete Row.. " + JSON.stringify(row));
       var wkpId = row.wid;
       var projectWkpIds = $rootScope.currentProject.workPackages;
       var projectId = $rootScope.currentProject.pid;
       WorkPackage.delete({wid: wkpId, action: 'remove'}, function (successResponse) {
           var index = projectWkpIds.indexOf(wkpId);
           projectWkpIds.splice(index, 1);
           $rootScope.currentProject.workPackages = projectWkpIds;
          // console.log("New Project = " + JSON.stringify($rootScope.currentProject))
           Project.update({pid: projectId}, $rootScope.currentProject);
           $scope.statusMessage = "Workpackage " + wkpId + " deleted successfully!";
           $route.reload();
       }, function(errorResponse) {
            $scope.statusMessage = constructErrMessage(errorResponse);

       });

   }

   function constructErrMessage(errorResponse) {
        var errData = errorResponse.data;
        var errMsg = '';
        for(i=0; i < errData.length; i++) {
            errMsg = errMsg + errData[i].name + ' : ' + errData[i].message + '\n';
        }
        //console.log("Error message : " + errMsg);
        return errMsg;
   }

   wpc.saveRow = function(workPackage) {
       // console.log("Saving single row = " + JSON.stringify(workPackage) + "  ID : " + workPackage._id);
        if(workPackage._id){
            //console.log("Yes, I am PUT");
            WorkPackage.update({wid: workPackage.wid, action: 'update'}, workPackage, function(successResponse){
                //console.log("Successfully saved a single row : " + JSON.stringify(successResponse));

                $scope.statusMessage = "Workpackage " + workPackage.wid + " updated successfully"

            }, function(errorResponse){
               // console.log(JSON.stringify(errorResponse));
                $scope.statusMessage = constructErrMessage(errorResponse);
               // console.log("Error Response Code: " + errorResponse.data.name + " : " + errorResponse.data.message);
            });
        } else {

            WorkPackage.save({wid: workPackage.wid, action: 'create'}, workPackage, function(successResponse){
                $scope.statusMessage = "Workpackages created successfully!!";
                $rootScope.currentProject.workPackages.push(workPackage.wid);
                Project.update({pid: $scope.currentProject.pid}, $scope.currentProject, function (successResponse) {
                    $scope.statusMessage = "Workpackage " + workPackage.wid + " added successfully"
                })
            }, function(errorResponse){
                $scope.statusMessage = constructErrMessage(errorResponse);
                //console.log("Error Response Code: " + errorResponse.data.code + " message: " + errorResponse.data.errmsg);
            });
        }

       this.isEditing = false;

   }

   wpc.saveWpkModal = function(workPackage) {
       if(!workPackage.wid){
           workPackage.wid = Math.floor((Math.random() * 1000) + 1);
       }
       WorkPackage.save({wid: workPackage.wid, action: 'create'}, workPackage, function(successResponse){
           $scope.statusMessage = "Workpackages created successfully!!";
           $rootScope.currentProject.workPackages.push(workPackage.wid);
           Project.update({pid: $scope.currentProject.pid}, $scope.currentProject, function (successResponse) {
               $scope.statusMessage = "Workpackage " + workPackage.wid + " added successfully";
               $('#wkpModal').modal('hide');

               $('#wkpModal').on('hidden.bs.modal', function (e) {
                   $route.reload();
               });


           });

       }, function(errorResponse){
           //console.log(JSON.stringify(errorResponse))
           $scope.statusMessage = constructErrMessage(errorResponse);
          // console.log("Error Response Code: " + errorResponse.data.type + " : " + errorResponse.data.message);
       });




   }



});


