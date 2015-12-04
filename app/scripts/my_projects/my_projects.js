'use strict';

angular.module('dmc')
.controller('MyProjectsCtr', function ($scope) {
    $scope.sortList = [
        {
            id : 3, tag : "date", name : "Most recent"
        },{
            id : 2, tag : "name", name : "Name"
        },{
            id : 1, tag : "id", name : "ID Project"
        }
    ];
    $scope.filterList = [
        {
            id : 1, tag : "id1", name : "ID Project1"
        },{
            id : 2, tag : "id2", name : "ID Project2"
        },{
            id : 3, tag : "id3", name : "ID Project3"
        },{
            id : 4, tag : "id4", name : "ID Project4"
        },{
            id : 5, tag : "id5", name : "ID Project5"
        }
    ];
    $scope.sortModel = 0;
    $scope.selectItemDropDown = function(type){
        if(type == "filter"){
            if($scope.filterModel != 0) {
                var item = $scope.filterList[$scope.filterModel];
                $scope.filterList.splice($scope.filterModel, 1);
                $scope.filterList = $scope.filterList.sort(function(a,b){return a.id - b.id});
                if ($scope.filterList.unshift(item)) $scope.filterModel = 0;
            }
        }else{
            if($scope.sortModel != 0) {
                var item = $scope.sortList[$scope.sortModel];
                $scope.sortList.splice($scope.sortModel, 1);
                $scope.sortList = $scope.sortList.sort(function(a,b){return a.id - b.id});
                if ($scope.sortList.unshift(item)) $scope.sortModel = 0;
            }
        }
    };
})