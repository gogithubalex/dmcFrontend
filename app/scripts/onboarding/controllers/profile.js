angular.module('dmc.onboarding')
.controller('ProfileController', 
	['$scope', '$state', 'location', 'fileUpload',
	function ($scope, $state, location, fileUpload) {
		if($state.current.name == "onboarding.profile"){
			$state.go($scope.profile[0].state);
		}
        $scope.activePage = $state;
        $scope.file = null;


        //profile pic upload parameters for S3
	$scope.creds = {
	    bucket: 'dmc-uploads2',

// james.barkley creds (used for testing)
            access_key: 'AKIAJHHCWWBAHZPREBCQ', 
            secret_key: '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'

// frontend-uploader creds
/*
	    access_key: 'AKIAIYFNN5QQETHXQ5AA',
    	    secret_key: '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'
*/
	}


 

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
            $scope.file = flow;
        };

        $scope.removePicture = function(flow){
            flow.files = [];
            $scope.file = null;
        };

//get location
        $scope.getLocation = function () {
            location.get(callback);
        };

        var callback = function (success, data) {
            if (success) {
                $scope.profile[0].data.location = data.city + ", " + data.region;
            }
        };

        //add skill to profile
        $scope.addSkill = function (inputSkill) {
            if (!inputSkill)return;
            $scope.profile[2].data.skills.push(inputSkill);
            this.inputSkill = null;
        }

        //remove skill
        $scope.deleteSkill = function (index) {
            $scope.isChange = true;
            $scope.profile[2].data.skills.splice(index, 1);
        }

        $scope.deleteImage = function(){
            $scope.profile[1].data.image = "";
        }

        $scope.next = function(index){
            $scope.storefront[index].done = true;
            if(index == 1 && $scope.file){
	        file = $scope.file.files[0];
    	        console.log("file size: " + file.size);
	        console.log("file name: " + file.name);
	        if(file.size > 10585760) {
	            alert('Sorry, file size must be under 10MB');
	            return false;
	        }

                // Configure The S3 Object
                AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
                AWS.config.region = 'us-east-1';
                var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
 
                if (file) {
                    var params = { Key: file.name, ContentType: file.type, Body: file.file, ServerSideEncryption: 'AES256' };
                    bucket.putObject(params, function(err, data) {
                        if (err) {
                            // There Was An Error With Your S3 Config
                            alert(err.message);
                            return false;
                        }
                        else {
                            // Success!
                            //alert('Upload Done');
			    console.log('Upload Done');
                            $scope.file = null;
                            $scope.profile[1].data.image = "https://dmc-uploads.s3.amazonaws.com/" + file.name;
			    console.log("final resource at " + $scope.profile[1].data.image);
                        }
                    })
                   .on('httpUploadProgress',function(progress) {
                       // Log Progress Information
                       console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                   });
               }
               else {
                   // No File Selected
                   alert('No File Selected');
               }

            }else{
                $scope.saveProfile($scope.profile[index].data, function(){
                    $(window).scrollTop(0);
                    $state.go('^' + $scope.profile[index+1].state);
                });
            }

        }
/*
                    $scope.file.files[0].file,
                    {id: $scope.userData.profileId}, 
                    'profile', 
                    function(data){
                        $scope.saveProfile($scope.profile[index].data, function(){
                            $(window).scrollTop(0);
                            $state.go('^' + $scope.profile[index+1].state);
                        });
                    }
                );
*/

        $scope.finish = function(index){
            $scope.saveProfile($scope.profile[index].data, function(){
                $scope.saveFinish('profile');
                $(window).scrollTop(0);
                $state.go('^.^.home');
            });
        }
}]);
