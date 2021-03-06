'use strict';
angular.module('dmc.company-profile').
    directive('tabContact', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-contact.html',
            scope: {
                source : "=",
                changedValue : "=",
                changes : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, questionToastModel) {
                $element.addClass("tab-contact");

                $scope.isAddingContactMethod = false;

                $scope.source.contactMethods = [];

                // get company contacts
                $scope.getContacts = function(){
                    ajax.get(dataFactory.getCompanyKeyContacts($scope.source.id),{
                            "_order" : "DESC",
                            "_sort" : "id"
                        }, function(response){
                            $scope.source.contacts = response.data;
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        }
                    );
                };
                $scope.getContacts();

                $scope.keyContactTypes = [
                    {
                        id : 1,
                        name : "LEGAL"
                    }, {
                        id : 2,
                        name : "LEGAL 2"
                    }
                ];

                $scope.states = [
                    "AL|Alabama",
                    "AK|Alaska",
                    "AZ|Arizona",
                    "AR|Arkansas",
                    "CA|California",
                    "CO|Colorado",
                    "CT|Connecticut",
                    "DE|Delaware",
                    "FL|Florida",
                    "GA|Georgia",
                    "HI|Hawaii",
                    "ID|Idaho",
                    "IL|Illinois",
                    "IN|Indiana",
                    "IA|Iowa",
                    "KS|Kansas",
                    "KY|Kentucky",
                    "LA|Louisiana",
                    "ME|Maine",
                    "MD|Maryland",
                    "MA|Massachusetts",
                    "MI|Michigan",
                    "MN|Minnesota",
                    "MS|Mississippi",
                    "MO|Missouri",
                    "MT|Montana",
                    "NE|Nebraska",
                    "NV|Nevada",
                    "NH|New Hampshire",
                    "NJ|New Jersey",
                    "NM|New Mexico",
                    "NY|New York",
                    "NC|North Carolina",
                    "ND|North Dakota",
                    "OH|Ohio",
                    "OK|Oklahoma",
                    "OR|Oregon",
                    "PA|Pennsylvania",
                    "RI|Rhode Island",
                    "SC|South Carolina",
                    "SD|South Dakota",
                    "TN|Tennessee",
                    "TX|Texas",
                    "UT|Utah",
                    "VT|Vermont",
                    "VA|Virginia",
                    "WA|Washington",
                    "WV|West Virginia",
                    "WI|Wisconsin",
                    "WY|Wyoming"
                ];

                $scope.addNewContactMethod = function(){
                    $scope.isAddingContactMethod = true;
                };

                $scope.cancelAddContactMethod = function(){
                    $scope.isAddingContactMethod = false;
                };

                $scope.saveContactMethod = function(name){
                    var data = {
                        name : name,
                        companyId : $scope.source.id,
                        value : null
                    };
                    $scope.source.contactMethods.push(data);
                    $scope.cancelAddContactMethod();
                    $scope.changedValue('new-contact-method');
                    apply();
                };

                $scope.deleteContactMethod = function(item,ev,index){
                    questionToastModel.show({
                        question : "Do you want to delete the contact method?",
                        buttons: {
                            ok: function(){
                                if(item.id) {
                                    item.removed = true;
                                }else{
                                    $scope.source.contactMethods.splice(index,1);
                                }
                                $scope.changedValue('contact-method');
                                apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };

                function loadContactMethods(){
                    ajax.get(dataFactory.companyURL($scope.source.id).get_contact_methods,{},function(response){
                        $scope.source.contactMethods = response.data;
                        apply();
                    });
                }
                loadContactMethods();

                $scope.states = $.map($scope.states, function( n,index ) {
                    var name = n.split('|');
                    return {
                        id : index+1,
                        abbr : name[0],
                        name : name[1]
                    }
                });

                $scope.preferredMethods = [
                    {
                        id : 1,
                        name : "Email"
                    }, {
                        id : 2,
                        name : "Phone"
                    }
                ];

                // open form for add contact
                $scope.addNewContact = function(){
                    $scope.isAddingContact = true;
                };

                // close form for add contact
                $scope.cancelAddContact = function(){
                    $scope.isAddingContact = false;
                };

                // save new contact
                $scope.saveContact = function(newContact){
                    if((newContact.phoneNumber || newContact.email) && newContact.type) {
                        newContact.companyId = $scope.source.id;
                        if (!$scope.source.contacts) $scope.source.contacts = [];
                        $scope.source.contacts.unshift(newContact);
                        $scope.cancelAddContact();
                        $scope.changedValue('contact-added');
                        apply();
                    }
                };

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

                // delete contact
                $scope.deleteContact = function(contact,ev){
                    questionToastModel.show({
                        question : "Do you want to delete the contact?",
                        buttons: {
                            ok: function(){
                                contact.hide = true;
                                $scope.changedValue('contact');
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };
            }
        };
    }]);