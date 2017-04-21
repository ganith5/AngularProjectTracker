var projectsModule = angular.module('projects');




projectsModule.factory('Project', function($resource, Environment) {

    return $resource(Environment.getBaseUrl() + '/projects/:id/:action',
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


projectsModule.factory('WorkPackage', function($resource, Environment) {

    return $resource(Environment.getBaseUrl() + '/workpackage/:wid/:action',
        {},
        {
            query: {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        }


    );
});

projectsModule.factory('Users', function($resource, Environment) {

    return $resource(Environment.getBaseUrl() + '/users',
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






