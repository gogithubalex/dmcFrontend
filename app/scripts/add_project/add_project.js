'use strict';
angular.module('dmc.add_project', [
    'dmc.configs.ngmaterial',
    'dmc.add_project.directive',
    'dmc.ajax',
    'dmc.data',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.widgets.documents',
    'dmc.component.members-card',
    'dmc.common.header',
    'dmc.common.footer'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider, $mdDateLocaleProvider){
    $stateProvider.state('add_project', {
        url: '',
        abstract: true
    });
    $urlRouterProvider.otherwise('/');

    $mdDateLocaleProvider.formatDate = function(date) {
        if(date){
            return moment(date).format('MM/DD/YYYY');
        }else{
            return "";
        }
    };
})
    .service('projectModel', [
        'ajax', 'dataFactory', '$stateParams', '$http', '$q', 'toastModel', '$rootScope','DMCUserModel',
        function (ajax, dataFactory, $stateParams, $http, $q, toastModel, $rootScope, DMCUserModel ) {

            function addTagsToPromises(promises,tags,id){
                if(tags) {
                    for (var i in tags) {
                        if (tags[i].id && tags[i].id > 0 && tags[i].deleted == true) {
                            promises["deleteTag" + i] = $http.delete(dataFactory.deleteProjectTag(tags[i].id));
                        } else if (!tags[i].id || tags[i].id <= 0) {
                            promises["addTag" + i] = $http.post(dataFactory.addProjectTag(), {
                                projectId: id,
                                name: tags[i].name
                            });
                        }
                    }
                }
            }

            this.update_project = function(id,params, array, currentMembers, callback){
                ajax.update(dataFactory.updateProject(id),{
                    title : params.title,
                    type : params.type,
                    approvalOption : params.approvalOption,
                    dueDate : params.dueDate,
                    description : params.description
                },function(response){
                    var promises = {};

                    // add tags to request
                    addTagsToPromises(promises,params.tags,id);

                    for(var i in array){
                        var isFound = false;
                        for(var j in currentMembers){
                            if(array[i].profileId == currentMembers[j].profileId){
                                currentMembers.splice(j,1);
                                isFound = true;
                                break;
                            }
                        }
                        if(!isFound){
                            promises["addMember"+i] = $http.post(dataFactory.createMembersToProject(), {
                                    "profileId": array[i].id,
                                    "projectId": id,
                                    "fromProfileId": $rootScope.userData.profileId,
                                    "from": $rootScope.userData.displayName,
                                    "date": moment(new Date).format('x'),
                                    "accept": false
                                }
                            );
                        }
                    }
                    if(currentMembers.length > 0) {
                        for (var i in currentMembers) {
                            promises["deleteMember"+i] = $http.delete(dataFactory.deleteProjectMember(currentMembers[i].id));
                        }
                    }

                    $q.all(promises).then(function(){
                            callback();
                        }, function(res){
                            toastModel.showToast("error", "Error." + res.statusText);
                        }
                    );

                    callback();
                });
            };

            this.add_project = function(params, array, callback){

                ajax.create(dataFactory.getCreateProject(),
                    {
                        "title": params.title,
                        "type": params.type,
                        "dueDate": params.dueDate,
                        "projectManager": "DMC member",
                        "approvalOption": params.approvalOption,
                        "featureImage": {
                            "thumbnail": "/images/project_relay_controller.png",
                            "large": "/images/project_relay_controller.png"
                        },
                        "description": params.description
                    },
                    function(response){

                        var promises = {
                            "update": $http.patch(dataFactory.updateProject(response.data.id),{
                                "tasks": {
                                    "totalItems": 0,
                                    "link": "/projects/"+response.data.id+"/tasks"
                                },
                                "discussions": {
                                    "totalItems": 0,
                                    "link": "/projects/"+response.data.id+"/discussions"
                                },
                                "services": {
                                    "totalItems": 0,
                                    "link": "/projects/"+response.data.id+"/services"
                                },
                                "tags": {
                                    "totalItems": 0,
                                    "link": "/projects/"+response.data.id+"/projects_tags"
                                }
                            }),
                            "addCurrentMemberToTheProject" : $http.post(dataFactory.createMembersToProject(),
                                {
                                    "profileId": $rootScope.userData.profileId,
                                    "projectId": response.data.id,
                                    "fromProfileId": $rootScope.userData.profileId,
                                    "from": $rootScope.userData.displayName,
                                    "date": moment(new Date).format('x'),
                                    "accept": true
                                })
                        };

                        // add members to request
                        for(var i in array){
                            promises["addMember"+i] = $http.post(dataFactory.createMembersToProject(),
                                {
                                    "profileId": array[i].id,
                                    "projectId": response.data.id,
                                    "fromProfileId": $rootScope.userData.profileId,
                                    "from": $rootScope.userData.displayName,
                                    "date": moment(new Date).format('x'),
                                    "accept": false
                                });
                        }

                        // add tags to request
                        addTagsToPromises(promises,params.tags,response.data.id);

                        $q.all(promises).then(function(){
                                callback(response.data.id);
                            }, function(res){
                                toastModel.showToast("error", "Error." + res.statusText);
                            }
                        );

                    }
                );
            };

        }
    ]);