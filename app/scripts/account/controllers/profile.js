'use strict';
angular.module('dmc.account')
    .controller('ProfileAccountCtr', [ '$stateParams', '$state', "$scope", "location",'fileUpload','accountData','accountUpdate', function ($stateParams, $state, $scope, location,fileUpload,accountData,accountUpdate) {
        $scope.accountData = accountData;
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];

        $scope.profile = accountData;
        if($scope.profile.displayName == null || $scope.profile.displayName.length == 0) $scope.profile.displayName = $scope.profile.firstName + ' ' + $scope.profile.lastName;

        $scope.blurDisplayName = function(){
            if($scope.profile.displayName == null || $scope.profile.displayName.trim().length == 0){
                $scope.profile.displayName = $scope.profile.displayName = $scope.profile.firstName + ' ' + $scope.profile.lastName;
            }
        };

        var callback = function(success,data){
            if(success == true) {
                $scope.profile.dataLocation = data;
                $scope.profile.location = $scope.profile.dataLocation.city + ", " + $scope.profile.dataLocation.region;
                $scope.profile.timezone = $scope.profile.dataLocation.timezone;
                accountUpdate.update($scope.profile);
            }
        };

        $scope.getLocation = function(container){
            location.get(callback);
        };

        $scope.changeValue = function(){
            accountUpdate.update($scope.profile);
        };

        $scope.profile.skills = [
            {
                id : 1,
                name : 'AngularJS'
            },{
                id : 2,
                name : 'Java'
            },{
                id : 3,
                name : 'jQuery'
            },{
                id : 4,
                name : 'CSS3'
            },{
                id : 5,
                name : 'Ruby on Rails'
            }
        ];

        $scope.deleteSkill = function(id){
            for(var s=0;s<$scope.profile.skills.length;s++){
                if(parseInt($scope.profile.skills[s].id) == parseInt(id)){
                    $scope.profile.skills.splice(s,1);
                    break;
                }
            }
        };

        $scope.keyPress = function($event){
            if($event.which === 13) $scope.addSkill($scope.newSkill);
        };

        $scope.addSkill = function(name){
            var max = 0;
            for(var s=0;s<$scope.profile.skills.length;s++) {
                if(max < $scope.profile.skills[s].id) max = $scope.profile.skills[s].id;
            }
            $scope.profile.skills.push({
                id : max+1,
                name : name
            });
            $scope.newSkill = null;
        };

        $scope.isChangingPicture = false;

        $scope.changePicture = function(){
            $scope.isChangingPicture = true;
        };

        var callbackUploadPicture = function(data){
            $scope.profile.featureImage.large = data.file.name;
            $scope.profile.featureImage.thumbnail = data.file.name;
        };

        $scope.uploadFile = function(flow){
            $scope.file = flow.files[0].file;
            $scope.cancelChangePicture(flow);
            fileUpload.uploadFileToUrl($scope.file,{id : $scope.accountId},'account',callbackUploadPicture);
        };

        $scope.cancelChangePicture = function(flow){
            flow.files = [];
            $scope.isChangingPicture = false;
        };

        $scope.prevPicture = null;
        $scope.pictureDragEnter = function(flow){
            $scope.prevPicture = flow.files[0];
            flow.files = [];
        };

        $scope.pictureDragLeave = function(flow){
            if(flow.files.length == 0 && $scope.prevPicture != null) {
                flow.files = [$scope.prevPicture];
                $scope.prevPicture = null;
            }
        };

        $scope.addedNewFile = function(file,event,flow){
            flow.files.shift();
        };
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
}]);