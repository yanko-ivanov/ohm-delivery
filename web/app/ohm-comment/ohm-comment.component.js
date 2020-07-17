angular.module('ohm-delivery').component('ohmComment', {
    templateUrl: 'ohm-comment/ohm-comment.template.html',
    bindings: {
        ohm: '<',
    },
    controllerAs: 'comment',
    controller: function ($scope, $http, statusService) {
        let self = this;

        self.$onInit = function () {
            // comment is sometimes null in db so we need a sanity check
            self.comment = self.ohm.comment && self.ohm.comment.trim() != '' ? self.ohm.comment : '';
            $scope.comment = self.comment;

            const successHandler = (result) => {
                $scope.errorMessage = '';
                this.ohm = result.data;
                $scope.ohm = result.data;

                $scope.statusLabel = statusService.getLabel(result.data.status);
            }

            const errorHandler = (error) => {
                $scope.errorMessage = error.data;
            }


            /**
             * Handles setting comments on accept/reject ohm.
             */
            $scope.sendComment = function () {
                $http.post(`/ohms/comment/${self.ohm.trackingId}`, {
                    comment: this.comment
                })
                    .then(successHandler, errorHandler);
            }
        }
    }
});