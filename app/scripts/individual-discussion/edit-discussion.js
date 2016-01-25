'use strict';

angular.module('dmc.individual-discussion')
    .controller('edit-discussionController', ['$scope', '$stateParams', 'ajax', 'dataFactory','toastModel', function ($scope, $stateParams, ajax, dataFactory,toastModel) {
        $scope.followFlag = false;
        $scope.userlogin = "DMC Member";
        $scope.NewComment = "";
        $scope.discussion = null;
        $scope.accountId = 1;

        // delete comment
        $scope.deleteComment = function(comment){
            ajax.on(dataFactory.deleteDiscussionComment(comment.id), {
            }, function(data){
                for(var index in $scope.discussion.comments.items){
                    if(parseInt($scope.discussion.comments.items[index].id) == parseInt(comment.id)){
                        $scope.discussion.comments.items.splice(index,1);
                        break;
                    }
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }, function(){
                toastModel.showToast("error", "Unable delete tags");
            },"DELETE");
        };

        // edit comment
        $scope.editComment = function(comment){
            comment.isEditing = true;
        };

        // cancel editing comment
        $scope.cancelChangeComment = function(comment){
            comment.isEditing = false;
        };

        // delete discussion tag
        $scope.deleteTag = function(tag){
            ajax.on(dataFactory.deleteDiscussionTag(tag.id), {
            }, function(data){
                for(var index in $scope.discussion.tags){
                    if(parseInt($scope.discussion.tags[index].id) == parseInt(tag.id)){
                        $scope.discussion.tags.splice(index,1);
                        break;
                    }
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }, function(){
                toastModel.showToast("error", "Unable delete tags");
            },"DELETE");
        };

        // save changed comment
        $scope.saveChangedComment = function(comment){
            ajax.on(dataFactory.saveChangedDiscussionComment(comment.id), {
                text: comment.text
            }, function(data){
                $scope.cancelChangeComment(comment);
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }, function(){
                toastModel.showToast("error", "Unable to save changed a comment");
            },"PUT");
        };

        // add discussion tag
        $scope.addTag = function(){
            ajax.on(dataFactory.getLastDiscussionTagId(), {
                "_limit" : 1,
                "_order" : "DESC",
                "_sort" : "id"
            }, function(data){
                var lastId = (data.length == 0 ? 1 : parseInt(data[0].id)+1);
                ajax.on(dataFactory.addDiscussionTag(), {
                    "id" : lastId,
                    "name" : $scope.newTag,
                    "individualDiscussionId" : $stateParams.discussionId
                }, function(data){
                    $scope.newTag = null;
                    $scope.discussion.tags.unshift(data);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }, function(){
                    toastModel.showToast("error", "Unable to add a tag");
                },"POST");
            }, function(){
                toastModel.showToast("error", "Unable get last id");
            },"GET");
        };

        //load Discussion
        ajax.on(
            dataFactory.getIndividualDiscussion($stateParams.discussionId), {},
            function(data){
                $scope.discussion = data;
                if($scope.discussion) {
                    $scope.loadTags();
                    $scope.loadComments();
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            },
            function(){
                toastModel.showToast("error", "Fail Load IndividualDiscussion");
            }
        );

        // load tags
        $scope.loadTags = function(){
            ajax.on(dataFactory.getDiscussionTags(), {
                "_order" : "DESC",
                "_sort" : "id",
                "individualDiscussionId" : $stateParams.discussionId
            }, function(data){
                $scope.discussion.tags = data;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }, function(){
                toastModel.showToast("error", "Unable get tags");
            },"GET");
        };

        // load comments
        $scope.loadComments = function(){
            ajax.on(dataFactory.getDiscussionComments($scope.discussion.comments.link), {
                "_order" : "DESC",
                "_sort" : "created_at"
            }, function(data){
                $scope.discussion.comments.items = data.reverse();
                for (var c in $scope.discussion.comments.items) {
                    $scope.discussion.comments.items[c].created_at = moment($scope.discussion.comments.items[c].created_at).format('MM/DD/YYYY, h:mm A');
                    if ($scope.accountId == $scope.discussion.comments.items[c].accountId) $scope.discussion.comments.items[c].isOwner = true;
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }, function(){
                toastModel.showToast("error", "Unable get comments");
            },"GET");
        };

        //load realted Disscussion
        ajax.on(
            dataFactory.getIndividualDiscussions(),{
                "_limit" : 5
            },
            function(data){
                $scope.realtedDiscussions = data;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            },
            function(){
                toastModel.showToast("error", "Fail Load IndividualDiscussion");
            }
        );


        //Submit Leave A Review form
        $scope.Submit = function(){
            ajax.on(dataFactory.getLastDiscussionCommentId(), {
                "_limit" : 1,
                "_order" : "DESC",
                "_sort" : "id"
            }, function(data){
                var lastId = (data.length == 0 ? 1 : parseInt(data[0].id)+1);
                ajax.on(
                    dataFactory.addCommentIndividualDiscussion(),
                    {
                        "id": lastId,
                        "individual-discussionId": $stateParams.discussionId,
                        "full_name": "DMC Member",
                        "accountId": $scope.accountId,
                        "avatar": "/images/carbone.png",
                        "text": $scope.newComment,
                        "created_at": moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
                        "userRatingReview": {
                            "DMC Member": "like"
                        },
                        "like": 0,
                        "dislike": 0
                    },
                    function(data){
                        $scope.newComment = null;
                        data.created_at = moment(data.created_at).format('MM/DD/YYYY, h:mm A');
                        data.isOwner = true;
                        $scope.discussion.comments.items.push(data);
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },
                    function(){
                        toastModel.showToast("error", "Fail add comment");
                    }, "POST"
                );
            }, function(){
                toastModel.showToast("error", "Unable get last id");
            },"GET");
        };

	}]);