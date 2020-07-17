angular
    .module("ohm-delivery", [])
    .controller("tracking", function ($scope, $http, statusService) {

        $scope.showHistory = false;

        const successHandler = (result) => {
            $scope.errorMessage = '';
            this.ohm = result.data;
            $scope.ohm = result.data;

            $scope.statusLabel = statusService.getLabel(result.data.status);
        }

        const errorHandler = (error) => {
            $scope.errorMessage = error.data;
        }

        $scope.markReceived = function() {
            $http.get(`/ohms/forward/${this.trackingId}/1`)
                .then(successHandler, errorHandler);
        }

        $scope.markReject = function() {
            $http.get(`/ohms/forward/${this.trackingId}/2`)
                .then(successHandler, errorHandler);
        }

        $scope.sendData = function () {
            if(! this.trackingId ) {
                $scope.errorMessage = 'Please enter a valid tracking code.';
                return;
            }

            $http.get(`/ohms/tracking/${this.trackingId}`)
                .then(successHandler, errorHandler);
        };
    });