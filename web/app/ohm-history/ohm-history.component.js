
angular.
module('ohm-delivery').
component('ohmHistory', {
    templateUrl: 'ohm-history/ohm-history.template.html',
    bindings: {
        ohm: '<',
    },
    controllerAs: 'history',
    controller: function ($scope) {
        let self = this;
        self.$onInit = function() {}

        /**
         * Although the date is obviously random, it should be formatted in the component.
         * @param unixTime
         * @returns {string}
         */
        self.formatDate = (unixTime) => {
            const dateObj = new Date(unixTime * 1000);
            return `${dateObj.toLocaleDateString("en-GB")}`
        }
    }
});