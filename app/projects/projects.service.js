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

    return $resource('http://localhost:3000/v1/projects',
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


projectsModule.factory('WorkPackage', function($resource) {

    return $resource('http://localhost:3000/v1/workpackage',
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

projectsModule.factory('Users', function($resource) {

    return $resource('http://localhost:3000/v1/users',
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




