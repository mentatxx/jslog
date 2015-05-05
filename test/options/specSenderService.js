describe('SenderService', function() {
    var logger,
        sampleOptions = {},
        protocol = 'http:',
        postData = 'SOME_POST_DATA',
        successCall,
        failedCall,
        ajaxStub = {
            request1 : {
                url: 'http://jslog.me/log',
                response: 'OK'
            }
        };

    beforeEach(function(){
        successCall = jasmine.createSpy('successCall');
        failedCall = jasmine.createSpy('failedCall');
        jasmine.clock().install();
        jasmine.Ajax.install();
        jasmine.Ajax.installLogger(/*logger.senderService.xmlHttpRequest*/);
        logger = new JsLog(sampleOptions);
    });

    afterEach(function(){
        jasmine.Ajax.uninstallLogger();
        jasmine.Ajax.uninstall();
        jasmine.clock().uninstall();
        logger = null;
    });

    it('sends xml http request', function(){
        jasmine.Ajax.stubRequest(ajaxStub.request1.url).andReturn(ajaxStub.request1.response);
        logger.senderService.sendXmlHttpRequest(protocol, postData, successCall, failedCall);
        jasmine.clock().tick(60000);
        expect(successCall).toHaveBeenCalled();
        expect(failedCall).not.toHaveBeenCalled();
    });

});