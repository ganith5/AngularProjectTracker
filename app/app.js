'use strict';

// Declare app level module which depends on views, and components
//TODO add sub-modules
var app = angular.module('openProjectApp', ['ngRoute', 'ngResource', 'projects', 'smart-table','ngTable']);

app.config(function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix = '!';

   $routeProvider
       
       .when("/projects/:pName/workpackage", {
           templateUrl: "projects/workpackage.html"
       })
       .when("/projects/new", {
           templateUrl: "projects/newProject.html",
           controller: 'ProjectController'
       })
       .when("/projects/:pName", {
           templateUrl: "projects/overview.html",
           controller: 'ProjectController'
       })


});


//Method to call SideBar actions
app.controller('SidebarController', function($scope, $rootScope){

    $scope.toggleSideBar = function () {

        $("#sidebar-menu").toggle();
        //$("#breadcrumb-content").toggle();
    }

    $scope.setSideMenuName = function (name) {
        $rootScope.sideMenuName = name;
    }

});


//TODO : how to inject service to a controller?
app.controller('NavigationController', function (Project, $scope, $rootScope) {

    console.log("NavigationCtrl called..");


    $scope.allProjects = [];
    
    
    Project.query(function (projectList) {

        //console.log("All projects with factory  = " + projectList);

        angular.forEach(projectList, function(project) {
            $scope.allProjects.push(project);
        });
    });
   

    //Load project by id
    $scope.loadProject = function(project) {
        //console.log("project id to be loaded = " + project.id);
        $rootScope.currentProject = Project.get({id: project.id});
        $rootScope.sideMenuName = "Overview";
    }

});











