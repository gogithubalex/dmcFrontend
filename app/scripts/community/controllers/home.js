'use strict';

angular.module('dmc.community')
    .controller(
        'HomeCommunityCtr', [
            '$stateParams', '$state', "$scope", "ajax", "$location","dataFactory","toastModel", "$mdDialog",
            function ($stateParams, $state, $scope, ajax, $location, dataFactory, toastModel, $mdDialog) {

                $scope.peoples = [
                    {
                        id : 1,
                        name : "People"
                    },{
                        id : 2,
                        name : "Organizations"
                    },{
                        id : 3,
                        name : "Discussions"
                    }
                ];

                $scope.selectItemDropDown = function(){
                    var item = null;
                    var index = -1;
                    for(var p in $scope.peoples){
                        if($scope.peoples[p].id == $scope.peopleModel){
                            item = $scope.peoples[p];
                            index = p;
                            break;
                        }
                    }
                    if(item && index >= 0) {
                        $scope.peoples.splice(index, 1);
                        $scope.peoples = $scope.peoples.sort(function (a, b) {
                            return a.id - b.id
                        });
                        $scope.peoples.unshift(item);
                    }
                };
                

                $scope.createDiscussion = function(ev){
                    $(window).scrollTop(0);
                        $mdDialog.show({
                            controller: "ComposeDiscussionController",
                            templateUrl: "templates/individual-discussion/compose-discussion.html",
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            // locals: {
                            //     products: $scope.allServices
                            // },
                            clickOutsideToClose:true
                        })
                        .then(function() {
                        }, function() {
                        });
                }
            }
        ]
    );