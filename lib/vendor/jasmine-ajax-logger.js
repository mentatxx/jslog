/*global jasmine,window*/
(function(){
    var
        originalSend = null,
        xhr = null,
        sender;

    jasmine.Ajax = jasmine.Ajax || {};
    jasmine.Ajax.installLogger = function(xhrEnvironment) {
        if (originalSend) {
            // avoid accidental rerun
            return;
        }
        xhr = xhrEnvironment || window.XMLHttpRequest.prototype;
        originalSend = xhr.send;
        xhr.send = sendWrapper;
    };

    jasmine.Ajax.uninstallLogger = function() {
        xhr.send = originalSend;
        originalSend = null;
        xhr = null;
    };

    function sendWrapper() {
        window.console.log('XHR: ' + this.url);
        originalSend.apply(this, arguments);
    }

})();
