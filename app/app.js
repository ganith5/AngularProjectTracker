'use strict';

// Declare app level module which depends on views, and components

var app = angular.module('openProjectApp', ['ngRoute', 'ngResource', 'projects', 'smart-table','ngTable']);

app.config(function($routeProvider, $locationProvider, EnvironmentProvider) {

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

    EnvironmentProvider.setActive('DEV')


});




//Method to call SideBar actions
app.controller('SidebarController', function($scope, $rootScope){

    $scope.toggleSideBar = function () {
        console.log("Toggling!!");

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
        $rootScope.currentProject = Project.get({id: project.pid});
        $rootScope.sideMenuName = "Overview";
    }

});


app.provider('Environment', function EnvironmentProvider() {

    var environments = {
        DEV: {
            root: 'http://localhost',
            port: '3000',
            version: 'v1'
        },
        PROD: {
            root: 'https://localhost',
            port: '3000',
            version: 'v1'
        }
    }

    var selectedEnv = 'dev';

    var self = this;

    this.setActive = function (env) {
        selectedEnv = env;
        return self.getActive(selectedEnv);

    }

    this.getActive = function () {
        return environments[selectedEnv];

    }

    this.getEnvironment = function (env) {

        return environments[env];

    }

    this.getBaseUrl = function () {
        var active = self.getActive();
        return active.root + ':' + active.port + '/' + active.version;

    }

    this.$get = [function () {
        return self;
    }];

});











