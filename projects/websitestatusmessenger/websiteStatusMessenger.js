var WebsiteStatusMessenger = function (arguments) {
    arguments = typeof(arguments) != 'undefined' ? arguments : {};

    this.options = {
        id: 'system_messages',
        animationSpeed: 200,
        messageDelay: 3500,
        messageBaseClass: 'message',
        messageCloseText: 'close'
    };

    this.isAnimating = false;
    this.isOpened = false;
    this.currentMessage = 0;
    this.messageCounter = 0;
    this.messageQueue = [];

    // merge in option arguments
    for (var property in arguments) {
        if (arguments.hasOwnProperty(property)) {
            this.options[property] = arguments[property];
        }
    }

    // create basic nodes messages
    this.createBaseElements();

    // action listener for close button
    this.setCloseListener();
};

WebsiteStatusMessenger.prototype = {
    //<div id="system_messages">
    //  <div class="message">
    //    <p></p>
    //    <a href="#">close</a>
    //  </div>
    //</div>

    createBaseElements: function () {
        // base node
        var base = document.createElement("div");
        base.id = this.options.id;

        // text node
        var text = document.createElement("p");

        // close node
        var close_link = document.createElement("a");
        close_link.href = "#";

        var close_text = document.createTextNode(this.options.messageCloseText);

        // message node
        var message = document.createElement("div");
        message.className = this.options.messageBaseClass;

        // appending nodes into one another
        message.appendChild(text);
        close_link.appendChild(close_text);
        message.appendChild(close_link);
        base.appendChild(message);

        // pre-pending base into the DOM
        document.body.insertBefore(base, document.body.firstChild);
    },

    addMessage: function (text, state) {
        this.messageQueue.push({nr: this.messageCounter++, text: text, state: state});

        if (this.messageQueue.length == 1 && !this.isAnimating) {
            this.nextMessage();
        }
    },

    nextMessage: function () {
        if (this.messageQueue.length > 0) {
            this.isAnimating = true;
            this.currentMessage = this.messageQueue[0].nr;
            var messageNr = this.messageQueue[0].nr;
            // check if the message needs to be closed and set the timeout
            var closeDelay = 0;
            if (this.isOpened) {
                this.closeMessage();
                closeDelay = this.options.animationSpeed;
            }

            var self = this;
            setTimeout( function(){
                self.changeMessage();
                self.openMessage();
            }, closeDelay);

            setTimeout( function(){
                if (messageNr == self.currentMessage) {
                    self.isAnimating = false;
                    self.nextMessage();
                }
            }, closeDelay + this.options.animationSpeed + this.options.messageDelay);
        }
    },

    changeMessage: function () {
        if (this.messageQueue.length > 0) {
            var message = this.messageQueue.shift();

            try {
                var messageElement = document.getElementById(this.options.id).firstChild;
                // add styling from queue
                messageElement.className = this.options.messageBaseClass + " " + message.state;

                // add text from queue
                messageElement.firstChild.innerHTML = message.text;
            } catch(error) {
                if (console != "undefined") {
                    console.log("could not change elements of the message:" + error.message);
                }
            }
        }
    },

    openMessage: function () {
        this.isOpened = this.connectorOpenMessage();
    },

    closeMessage: function () {
        this.isOpened = this.connectorCloseMessage();
    }
};