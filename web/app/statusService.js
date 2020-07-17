/**
 * Handles status labels, options and everything status.
 */
class Status {

    /**
     * Initiate all the things! https://imgflip.com/s/meme/X-All-The-Y.jpg
     * @param props
     */
    constructor(props) {
        /**
         *
         * @type {{READY: string, CREATED: string, DELIVERED: string, IN_DELIVERY: string, PREPARING: string, REFUSED: string}}
         */
        this.statuses = {
            CREATED: 'Created',
            PREPARING: 'In preparation',
            READY: 'Ready for delivery',
            IN_DELIVERY: 'In transit',
            DELIVERED: 'Delivered',
            REFUSED: 'Refused'
        };
    }


    /**
     * Returns a more user-friendly label.
     * @param code
     * @returns {*}
     */
    getLabel(code) {
        return this.statuses[code]
    }
}

angular
    .module("ohm-delivery")
    .factory('statusService', () => {
        return new Status
    });