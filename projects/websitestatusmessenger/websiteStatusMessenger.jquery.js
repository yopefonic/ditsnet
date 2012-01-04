// jQuery extending
WebsiteStatusMessenger.prototype.setCloseListener = function () {
    var self = this;
    jQuery("#" + self.options.id).find('a').click( function () {
        self.closeMessage();
        self.nextMessage();
    });

    return true;
};

WebsiteStatusMessenger.prototype.connectorOpenMessage = function () {
    jQuery("#" + this.options.id).slideDown(this.options.animationSpeed);

    return true;
};

WebsiteStatusMessenger.prototype.connectorCloseMessage = function () {
    jQuery("#" + this.options.id).slideUp(this.options.animationSpeed);

    return false;
};
