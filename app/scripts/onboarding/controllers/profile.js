angular.module('dmc.onboarding')
.controller('ProfileController', 
	['$scope', '$state', 'location', 'fileUpload',
	function ($scope, $state, location, fileUpload) {
		if($state.current.name == "onboarding.profile"){
			$state.go($scope.profile[0].state);
		}
        $scope.activePage = $state;
        $scope.file = null;


//upload file
	$scope.creds = {
	bucket: 'dmc-test',
	access_key: 'AKIAI3UDZVKQDH2E5R5A',
	secret_key: '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'
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
	    file = $scope.file.files[0];
//	    alert(file.size);
//	    alert(file.name);
	    if(file.size > 10585760) {
	      alert('Sorry, file size must be under 10MB');
	      return false;
	    }

  // Configure The S3 Object
  AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
  AWS.config.region = 'us-east-1';
  var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
 
  if(file) {
    var params = { Key: file.name, ContentType: file.type, Body: file.file, ServerSideEncryption: 'AES256' };
 
    bucket.putObject(params, function(err, data) {
      if(err) {
        // There Was An Error With Your S3 Config
        alert(err.message);
        return false;
      }
      else {
        // Success!
        alert('Upload Done');
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



        }
/*
        $scope.next = function(index){
            $scope.storefront[index].done = true;
            if(index == 1 && $scope.file){
                fileUpload.uploadFileToUrl(
                    $scope.file.files[0].file,
                    {id: $scope.userData.profileId}, 
                    'profile', 
                    function(data){
                        $scope.file = null;
                        if(data.file && data.file.name){
                            $scope.profile[1].data.image = data.file.name;
                        }
                        $scope.saveProfile($scope.profile[index].data, function(){
                            $(window).scrollTop(0);
                            $state.go('^' + $scope.profile[index+1].state);
                        });
                    }
                );
            }else{
                $scope.saveProfile($scope.profile[index].data, function(){
                    $(window).scrollTop(0);
                    $state.go('^' + $scope.profile[index+1].state);
                });
            }
        }
*/

        $scope.finish = function(index){
            $scope.saveProfile($scope.profile[index].data, function(){
                $scope.saveFinish('profile');
                $(window).scrollTop(0);
                $state.go('^.^.home');
            });
        }
}]);
