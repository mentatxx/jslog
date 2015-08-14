/*global it, declare, expect*/
describe('hooks network', function () {
    var /**JsLog*/logger,
        sampleOptions = {
            "key": "MY_KEY",
            "hookConsole": false,
            network: {
                enabled: true,
                codesExclude: []
            }
        },
        ajaxStub = {
            response200: {
                url: 'http://example.com/',
                response: {
                    status: 200,
                    contentType: 'application/json',
                    responseText: '{"status":"OK"}'
                }
            },
            response400: {
                url: 'http://example.com/',
                response: {
                    status: 400,
                    contentType: 'application/json',
                    responseText: '{"status":"Invalid input"}'
                }
            },
            response500: {
                url: 'http://example.com/',
                response: {
                    status: 500,
                    contentType: 'application/json',
                    responseText: 'Server error'
                }
            }
        };

    beforeEach(function () {
        jasmine.Ajax.install();
        jasmine.clock().install();
        logger = new JsLog(sampleOptions);
        logger.network = jasmine.createSpy('network');
    });

    afterEach(function () {
        logger.pendingSenderService.queue.clearWithPostponedData();
        logger.finalize();
        jasmine.clock().uninstall();
        jasmine.Ajax.uninstall();
    });

    it('sending initial info matches protocol', function () {
        jasmine.Ajax.stubRequest(ajaxStub.response200.url).andReturn(ajaxStub.response200.response);
        var xhr = new window.XMLHttpRequest();
        xhr.open('GET', ajaxStub.response200.url);
        xhr.send();
        expect(logger.network).toHaveBeenCalled();
    });

    it('handling timeouts', function () {
        var xhr = new window.XMLHttpRequest();
        xhr.open('GET', ajaxStub.response200.url);
        xhr.send();
        expect(logger.network).not.toHaveBeenCalled();
        xhr.responseTimeout();
        expect(logger.network).toHaveBeenCalled();
    });

    it('handling errors', function () {
        var xhr = new window.XMLHttpRequest();
        xhr.open('GET', ajaxStub.response200.url);
        xhr.send();
        expect(logger.network).not.toHaveBeenCalled();
        xhr.responseError();
        expect(logger.network).toHaveBeenCalled();
    });


});