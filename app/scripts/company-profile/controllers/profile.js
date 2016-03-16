'use strict';

angular.module('dmc.company-profile')
    .controller('CompanyProfileController', function ($stateParams, $scope, ajax, dataFactory, $mdDialog, fileUpload, $location, $anchorScroll, $mdToast, toastModel,$timeout,$q, location, companyData, companyProfileModel) {

        $scope.company = companyData;
        //$scope.company.dateJoined = moment( $scope.company.dateJoined,"YYYY-DD-MM").format("MM/DD/YYYY");
        $scope.company.categoryTier = "Tier 4 Academic / Nonprofit";

        $scope.LeaveFlag = false;  //flag for visibility form Leave A Review
        $scope.submit_rating = 0;  //
        $scope.limit_reviews = true;  //limit reviews
        $scope.sortListModel = 0;  //model for drop down menu "sorting"
        $scope.showflag = false;
        $scope.followFlag = false;
        $scope.selectSortingStar = 0;
        $scope.index = 0;
        $scope.inviteToProject = false;
        $scope.invate = false;
        $scope.toProject = "";
        $scope.projects = [];

        $scope.sortList = [
            {
                id: 0,
                val: "date",
                name: "Most recent"
            },
            {
                id: 1,
                val: "helpful",
                name: "Most Helpful"
            },
            {
                id: 2,
                val: "leasthelpful",
                name: "Least Helpful"
            },
            {
                id: 3,
                val: "highest",
                name: "Highest to Lowest Rating"
            },
            {
                id: 4,
                val: "lowest",
                name: "Lowest to Highest Rating"
            },
            {
                id: 5,
                val: "verified",
                name: "Verified Users"
            }
        ];

        $scope.history = {
            leftColumn: {
                title: "Public",
                viewAllLink: "/all.php#/history/company/"+$stateParams.companyId+"/public",
                list: []
            },
            rightColumn: {
                title: "Mutual",
                viewAllLink: "/all.php#/history/company/"+$stateParams.companyId+"/mutual",
                list:[]
            }
        }

        // get company contacts
        var callbackContacts = function(data){
            // console.info(data);
            for(var i in data){
                // console.info(data[i]);
                if(data[i].type == 1){
                    data[i].type = "LEGAL";
                }else if(data[i].type == 2){
                    data[i].type = "LEGAL 2";
                }
            }
            $scope.company.keyContacts = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getKeyContacts($scope.company.id, callbackContacts);


        // get company images
        var callbackVideaos = function(data){
            $scope.company.videos = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getVideos($scope.company.id, callbackVideaos);
        
        // get company images
        var callbackImages = function(data){
            $scope.company.images = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getImages($scope.company.id, callbackImages);

        // get company skills images
        var callbackSkillsImages = function(data){
            $scope.company.skillsImages = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getSkillsImages($scope.company.id, callbackSkillsImages);

        // get company skills
        var callbackSkills = function(data){
            $scope.company.skills = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getSkills($scope.company.id, callbackSkills);

        // get company members
        var callbackMembers = function(data){
            $scope.company.members = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getMembers($scope.company.id, callbackMembers);

        // get company history
        var callbackPublicHistory = function(data){
            for(var i in data){
                data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                switch(data[i].type){
                    case "completed":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;
                    case "added":
                        data[i].icon = "images/ic_group_add_black_24px.svg";
                        break;
                    case "rated":
                        data[i].icon = "images/ic_star_black_24px.svg";
                        break;
                    case "worked":
                        data[i].icon = "images/icon_project.svg";
                        break;  
                    case "favorited":
                        data[i].icon = "images/ic_favorite_black_24px.svg";
                        break;   
                    case "shared":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;   
                    case "discussion":
                        data[i].icon = "images/ic_forum_black_24px.svg";
                        break;                                  
                }
            }
            $scope.history.leftColumn.list = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getCompanyHistory( 
            {
                "_limit": 3,
                "section": "public"
            }, 
            callbackPublicHistory
        );

        // get company history
        var callbackMutualHistory = function(data){
            for(var i in data){
                data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                switch(data[i].type){
                    case "completed":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;
                    case "added":
                        data[i].icon = "images/ic_group_add_black_24px.svg";
                        break;
                    case "rated":
                        data[i].icon = "images/ic_star_black_24px.svg";
                        break;
                    case "worked":
                        data[i].icon = "images/icon_project.svg";
                        break;  
                    case "favorited":
                        data[i].icon = "images/ic_favorite_black_24px.svg";
                        break;   
                    case "shared":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;   
                    case "discussion":
                        data[i].icon = "images/ic_forum_black_24px.svg";
                        break;                                  
                }
            }
            $scope.history.rightColumn.list = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        companyProfileModel.getCompanyHistory( 
            {
                "_limit": 3,
                "section": "mutual"
            }, 
            callbackMutualHistory
        );
        
        ajax.get(
            dataFactory.getProjects(),
            {},
            function(response){
                $scope.projects = response.data;
            }
        )

//review
        //Show Leave A Review form
        $scope.LeaveAReview = function(){
            $scope.LeaveFlag = !$scope.LeaveFlag;
            $scope.submit_rating = 0;
        };

        //cancel Review form
        $scope.Cancel = function(){
            $scope.LeaveFlag = false;
            $scope.submit_rating = 0;
        };

        //Submit Leave A Review form
        $scope.Submit = function(NewReview){
            companyProfileModel.add_company_reviews(
                {
                    name: $scope.$root.userData.displayName,
                    accountId: $scope.$root.userData.accountId,
                    reviewId: 0,
                    rating: $scope.submit_rating,
                    comment: (NewReview && NewReview.Comment ? NewReview.Comment : null)
                },
                function(data){
                    $scope.company.number_of_comments++;
                    $scope.company.rating.push($scope.submit_rating);
                    $scope.submit_rating = 0;
                    $scope.LeaveFlag = !$scope.LeaveFlag;

                    $scope.company.precentage_stars = [0, 0, 0, 0, 0];
                    $scope.company.average_rating = 0;
                    for (var i in $scope.company.rating) {
                        $scope.company.precentage_stars[$scope.company.rating[i] - 1] += 100 / $scope.company.number_of_comments;
                        $scope.company.average_rating += $scope.company.rating[i];
                    }
                    $scope.company.average_rating = ($scope.company.average_rating / $scope.company.number_of_comments).toFixed(1);

                    for (var i in $scope.company.precentage_stars) {
                        $scope.company.precentage_stars[i] = Math.round($scope.company.precentage_stars[i]);
                    }

                    $scope.SortingReviews('date');
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

        $scope.addReply = function(NewReview){
            var review = this.review;
            companyProfileModel.add_company_reviews(
                {
                    name: $scope.$root.userData.displayName,
                    accountId: $scope.$root.userData.accountId,
                    reviewId: NewReview.id,
                    rating: 0,
                    comment: NewReview.Comment
                },
                function(data){
                    data.date = moment(data.date).format("MM/DD/YYYY hh:mm A");
                    if(review.replyReviews){
                        review.replyReviews.unshift(data);
                    }else{
                        review['replyReviews'] = [data];
                    }
                    companyProfileModel.update_company_reviews(NewReview.id, 
                        {
                            'reply': true
                        },
                        function(data){
                            apply();
                        }
                    )
                }
            )
        };

        $scope.addFlagged = function(NewReview){
            companyProfileModel.add_flagged(NewReview.id);
        }

        $scope.updateHelpful = function(item, create, helpful){
            companyProfileModel.update_company_reviews(item.id,
                {
                    'like': item.like,
                    'dislike': item.dislike
                },
                function(data){
                }
            );
            if(create){
                companyProfileModel.add_helful(helpful, item.id,function(data){
                    item.helpful = data;
                });
            }else{
                companyProfileModel.update_helful(item.helpful.id, item.helpful)
            }
        };

        //selected dorp down menu "sorting"
        $scope.selectItemDropDown = function(value){
            if(value != 0) {
                var item = $scope.sortList[value];
                $scope.sortList.splice(value, 1);
                $scope.sortList = $scope.sortList.sort(function(a,b){return a.id - b.id});
                if ($scope.sortList.unshift(item)) this.sortListModel = 0;
            }
            $scope.SortingReviews($scope.sortList[0].val);
        };

        //sorting Reviews
        $scope.SortingReviews = function(val){
            var params = {};
            $scope.selectSortingStar = 0;
            switch(val){
                case "date":
                    params['_order'] = "DESC";
                    params['_sort'] = "date";
                    break
                case "helpful":
                    params['_order'] = "DESC";
                    params['_sort'] = "like";
                    break
                case "leasthelpful":
                    params['_order'] = "ASC";
                    params['_sort'] = "like";
                    break
                case "lowest":
                    params['_order'] = "ASC";
                    params['_sort'] = "rating";
                    break
                case "highest":
                    params['_order'] = "DESC";
                    params['_sort'] = "rating";
                    break
                case "verified":
                    params['_order'] = "DESC";
                    params['_sort'] = "date";
                    params['status'] = true;
                    break
                case "1star":
                    params['_order'] = "DESC";
                    params['_sort'] = "date";
                    params['rating'] = 1;
                    $scope.selectSortingStar = 1;
                    break
                case "2star":
                    params['_order'] = "DESC";
                    params['_sort'] = "date";
                    params['rating'] = 2;
                    $scope.selectSortingStar = 2;
                    break
                case "3star":
                    params['_order'] = "DESC";
                    params['_sort'] = "date";
                    params['rating'] = 3;
                    $scope.selectSortingStar = 3;
                    break
                case "4star":
                    params['_order'] = "DESC";
                    params['_sort'] = "date";
                    params['rating'] = 4;
                    $scope.selectSortingStar = 4;
                    break
                case "5star":
                    params['_order'] = "DESC";
                    params['_sort'] = "date";
                    params['rating'] = 5;
                    $scope.selectSortingStar = 5;
                    break
            }
            if ($scope.limit_reviews && !$scope.selectSortingStar) params['_limit'] = 2;

            companyProfileModel.get_company_reviews(params, function(data){
                $scope.company.company_reviews = data;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            });
        };

        //Selected rating
        $scope.stars = function(val){
            $scope.submit_rating = val;
        };

        //View All Review
        $scope.ViewAllReview = function(){
            $scope.limit_reviews = false;
            if($scope.selectSortingStar){
                $scope.selectSortingStar =0;
            }
            $scope.SortingReviews($scope.sortList[0].val);
        };

///
        $scope.goToReview = function(){
            $location.hash('review');
            $anchorScroll();
        }

        $scope.showMore = function(){
            $scope.showflag = false;
        }

        $scope.follow = function(){
            $scope.followFlag = !$scope.followFlag;
        }
        $scope.searchText = "";
        $scope.btnInviteToProject = function () {
            $scope.inviteToProject = true;
        }

        $scope.btnAddToProject = function (index) {
            console.info("add", $scope.projects[index])
            $scope.toProject = $scope.projects[index].title;
            $scope.invate = true;
            $scope.inviteToProject = false;
            /*ajax.create(dataFactory.createMembersToProject(),
                {
                    "profileId": $stateParams.profileId,
                    "projectId": $stateParams.projectId,
                    "fromProfileId": $rootScope.userData.profileId,
                    "from": $rootScope.userData.displayName,
                    "date": moment(new Date).format('x'),
                    "accept": false
                }
            );*/
        }

        $scope.btnCanselToProject = function () {
            $scope.inviteToProject = false;
        }

        $scope.btnRemoveOfProject = function () {
            $scope.toProject = "";
            $scope.invate = false;
            $scope.inviteToProject = false;
        }

        $scope.SortingReviews($scope.sortList[0].val);
    });

