'use strict';

angular.module('dmc.model.fileUpload', ['dmc.data'])
    .service('fileUpload', ['$http','dataFactory', function ($http,dataFactory) {
        this.uploadFileToUrl = function(file, data, type, callbackUploadPicture){
            var fd = new FormData();
            fd.append('file', file);
            for(var key in data) {
                fd.append(key, data[key]);
            }
            var url = null;
            switch(type){
                case 'account' :
                    url = dataFactory.uploadAccountPictureUrl();
                    break;
                case 'company' :
                    url = dataFactory.uploadCompanyPictureUrl();
                    break;
                default:
                    break;
            }
            if(url) {
                $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function (data) {
                    callbackUploadPicture(data);
                }).error(function (data) {
                    callbackUploadPicture(data);
                });
            }else{
                callbackUploadPicture(null);
            }
        }
    }]);