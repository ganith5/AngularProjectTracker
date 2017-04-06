var projectsModule = angular.module('projects');

projectsModule.service('ProjectService', function($http) {

    this.getAllProjects = function () {

        return $http.get('projects/projects.json');

    }

    this.getProjectById = function(pId) {
        console.log("Project id = " + pId);
        return $http.get('projects/projects.json')

    }


});

projectsModule.factory('Project', function($resource) {

    return $resource('http://localhost:3000/projects/:id',
        {},
        {
            query: {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT'
            }
        }


    );
});




