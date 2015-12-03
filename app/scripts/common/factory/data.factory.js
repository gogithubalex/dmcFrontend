'use strict';

angular.module('dmc.data',[])
    .factory('dataFactory', function ($window) {
        var baseServer = $window.apiUrl ? $window.apiUrl : '/static/?p=';
        var urlSocketServer = 'http://localhost:8080/';
        var appendId = function(id){
            return ($window.apiUrl && id ? '/'+id : '');
        };
        return {
            url_php_server: function(){
                return baseServer;
            },
            url_socket_server: function(){
                return urlSocketServer;
            },
            getUrlAllServices: function(id){
                return baseServer+'/services'+appendId(id);
            },
            getUrlChangeService: function(id){
                return baseServer+'/change_service'+appendId(id);
            },
            getUrlAllTasks: function(id){
                return baseServer+'/tasks'+appendId(id);
            },
            getUrlChangeTask: function(id){
                return baseServer+'/change_tasks'+appendId(id);
            },
            getUrlAllDiscussions: function(id){
                return baseServer+'/discussions'+appendId(id);
            },
            getUrlAllProjects: function(){
                return baseServer+'/projects';
            },
            getUrlAllComponents: function(id){
                return baseServer+'/components'+appendId(id);
            },
            getUrlAllProducts: function(){
                return baseServer+'/products';
            },
            getUrlAddToProject: function(id){
                return baseServer+'/add_to_project'+appendId(id);
            },
            getUrlRemoveFromProject: function(id){
                return baseServer+'/remove_from_project'+appendId(id);
            },
            getUrlAllDocuments: function(id){
                return baseServer+'/documents'+appendId(id);
            },
            getDocumentUpload: function(id){
                return baseServer+'/upload'+appendId(id);
            },
            getUrlCreateTask: function(id){
                return baseServer+'/create_task'+appendId(id);
            },
            getUrlCreateDiscussion: function(id){
                return baseServer+'/create_discussion'+appendId(id);
            },
            getProduct: function(){
                return baseServer+'/product';
            },
            getProductReview: function(){
                return baseServer+'/get_product_review';
            },
            addProductReview: function(){
                return baseServer+'/add_product_review';
            }
        };
    }
);