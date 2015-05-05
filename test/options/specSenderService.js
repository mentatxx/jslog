/*global it, declare, expect*/
describe('SenderService', function() {
    var logger,
        sampleOptions = {},
        protocol = 'http:',
        postData = 'SOME_POST_DATA',
        successCall,
        failedCall,
        ajaxStub = {
            response200 : {
                url: 'http://jslog.me/log',
                response: {
                    status: 200,
                    contentType: 'application/json',
                    responseText: '{"status":"OK"}'
                }
            },
            response400 : {
                url: 'http://jslog.me/log',
                response: {
                    status: 400,
                    contentType: 'application/json',
                    responseText: '{"status":"Invalid input"}'
                }
            },
            response500 : {
                url: 'http://jslog.me/log',
                response: {
                    status: 500,
                    contentType: 'application/json',
                    responseText: 'Server error'
                }
            }
        };

    beforeEach(function(){
        successCall = jasmine.createSpy('successCall');
        failedCall = jasmine.createSpy('failedCall');
        jasmine.clock().install();
        jasmine.Ajax.install();
        //jasmine.Ajax.installLogger(/*logger.senderService.xmlHttpRequest*/);
        logger = new JsLog(sampleOptions);
    });

    afterEach(function(){
        //jasmine.Ajax.uninstallLogger();
        jasmine.Ajax.uninstall();
        jasmine.clock().uninstall();
        logger = null;
    });

    it('handles 200 response', function(){
        jasmine.Ajax.stubRequest(ajaxStub.response200.url).andReturn(ajaxStub.response200.response);
        logger.senderService.sendXmlHttpRequest(protocol, postData, successCall, failedCall);
        expect(successCall).toHaveBeenCalled();
        expect(failedCall).not.toHaveBeenCalled();
    });

    it('handles 400 response', function(){
        jasmine.Ajax.stubRequest(ajaxStub.response400.url).andReturn(ajaxStub.response400.response);
        logger.senderService.sendXmlHttpRequest(protocol, postData, successCall, failedCall);
        expect(successCall).toHaveBeenCalled();
        expect(failedCall).not.toHaveBeenCalled();
    });

    it('handles 500 response', function(){
        jasmine.Ajax.stubRequest(ajaxStub.response500.url).andReturn(ajaxStub.response500.response);
        logger.senderService.sendXmlHttpRequest(protocol, postData, successCall, failedCall);
        expect(successCall).not.toHaveBeenCalled();
        expect(failedCall).toHaveBeenCalled();
    });

});