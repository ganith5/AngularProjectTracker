var projectsModule = angular.module('projects',['ngResource']);

//TODO: should the project controller be in a different JS?
//TODO: how to store currentProject?
//TODO: is this the best way to store project data
projectsModule.controller('ProjectController', function($scope, $http, $rootScope, Project){

    console.log("Loading ProjectController ---");

    // $scope.addTask = function() {
    //     console.log("Adding a new task");
    //     $scope.message = "Added a task " + $scope.taskName;
    // }

    
    //TODO: Check if there is a better way!!
    $scope.getProjectMembers = function() {
        return $rootScope.currentProject.members;
    }

    //$scope.allProjects = [];

   /* Project.query(function (projectList) {
        console.log("All projects with factory  = " + projectList);

        angular.forEach(projectList, function(project) {

            $scope.allProjects.push(project);


        })
    }); */

//Methods in the controller are executed only when called.
    $scope.addProject = function(projectInput) {


        projectInput.pid = Math.floor((Math.random() * 1000) + 1);

        console.log("Project to be added : " + JSON.stringify(projectInput));

        Project.save(projectInput, function (retProject) {
           // console.log("Succeess!!" + retProject.id);
            $scope.statusMessage = "Project successfully saved!";
        });

    }


});

projectsModule.controller('WorkPackageController',
    function WorkPackageController($scope, $rootScope, NgTableParams,
                                   Project, WorkPackage, Users){

    console.log("Instantiating WorkPackageController,{currProject} = "+ JSON.stringify($rootScope.currentProject));
    var wpc = this;

    var workPackagesIds = $rootScope.currentProject.workPackages;
    console.log("workPackagesIds : " + workPackagesIds);

    $scope.allProjectAssignees = [];

    WorkPackage.query({wid: workPackagesIds}, function(originalData){

        console.log("Returned data = " + originalData)
        console.log("JSON original data = " + JSON.stringify(originalData));
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

    //TODO: this is not working
    wpc.saveRow = function() {
        console.log("Saving data of workPackage table");
        var tableDataArr = [];
        var dataArr = this.tableParams.settings().dataset;
        var projectUpdated = $rootScope.currentProject;
        delete projectUpdated.workpackage;
        projectUpdated.workpackage = dataArr;

        this.isEditing = false;

        Project.update({id: projectUpdated.id}, projectUpdated, function (retProject) {
            $scope.statusMessage = "Workpackage successfully saved!";
        });
    }
        
   wpc.deleteRow = function(row) {
       console.log("Delete Row.. " + row);
       _.remove(this.tableParams.settings().dataset, function(item){
           console.log("Item = " + item);
           return row === item;
       });

   }


});

// projectsModule.controller('WorkPackageController', function($scope, $rootScope, NgTableParams){
//     var self = this;
//     //console.log("Self : " + self.value)
//     var data = $scope.getWorkPackages;
//
//     $scope.isEditing = false;
//     $scope.isAdding = false;
//     //self.add = add;
//     //self.cancelChanges = cancelChanges;
//     //self.del = del;
//     //self.hasChanges = hasChanges;
//     //self.saveChanges = saveChanges;
//
//     // self.tableParams = new NgTableParams({}, {
//     //     dataset: data
//     // });
//
//     $scope.addRow = function() {
//         console.log("Adding a row" + $rootScope.currentProject.workpackage);
//         var data = $rootScope.currentProject.workpackage;
//         console.log("Adding a row[data]" + data);
//         $scope.isEditing = true;
//         $scope.isAdding = true;
//         self.tableParams = new NgTableParams({}, {
//             dataset: data
//         });
//         console.log("tableParam: " + self.tableParams);
//         console.log("settings : " + self.tableParams.settings());
//         self.tableParams.settings().dataset.unshift({
//             id: 4,
//             subject: "",
//             type: "",
//             status: "",
//             assignee: ""
//         });
//
//         $scope.tableParams.sorting({});
//         $scope.tableParams.page(1);
//         self.tableParams.reload();
//     }
//
//
//     $scope.getWorkPackages = function () {
//         return $rootScope.currentProject.workpackage;
//     }
//
//
// });
