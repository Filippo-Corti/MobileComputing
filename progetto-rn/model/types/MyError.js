
export default class MyError extends Error {

    /**
     * 
     * @param {ERROR_TYPE} type 
     * @param {string} title 
     * @param {string} message 
     * @param {string?} actionText 
     * @param {string} dismissText 
     */
    constructor(
        type,
        title,
        message,
        actionText = null,
        dismissText = "Dismiss"
    ) {
        super(message);
        this.type = type;
        this.title = title;
        this.actionText = actionText;
        this.dismissText = dismissText;
    }
}