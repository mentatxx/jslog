/*global it, declare, expect*/
describe('have valid API', function () {
    var /**JsLog*/logger,
        sampleOptions = {
            "key": "MY_KEY",
            "hookConsole": true
        },
        sampleData = {
            "b": 1,
            "a": 2
        },
        orderedData = {
            "a": 2,
            "b": 1
        },
        sampleError = new Error('Some error text'),
        availableConsoleHookOptions = ['log', 'warn', 'info', 'error'],
        savedConsole = {};

    beforeEach(function () {
        jasmine.Ajax.install();
        availableConsoleHookOptions.forEach(function (item) {
            savedConsole[item] = window.console[item];
            window.console[item] = function () {
            };
        });
        logger = new JsLog(sampleOptions);
    });

    afterEach(function () {
        logger.pendingSenderService.queue.clearWithPostponedData();
        logger.finalize();
        jasmine.Ajax.uninstall();
        availableConsoleHookOptions.forEach(function (item) {
            window.console[item] = savedConsole[item];
        });
    });

    it('sending initial info matches protocol', function () {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer');
        logger.systemInfo();
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual('systemInfo');
    });


    function testSendingProtocol(protocol, givenData, expectedData) {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer');
        logger[protocol](givenData);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual(protocol);
        var arg2 = spy.calls.mostRecent().args[2],
            objectsAreEqual = _.isEqual(arg2, expectedData);
        expect(objectsAreEqual).toBeTruthy();
    }

    it('sending log matches protocol', function () {
        testSendingProtocol('log', sampleData, orderedData);
        testSendingProtocol('info', sampleData, orderedData);
        testSendingProtocol('warn', sampleData, orderedData);
        testSendingProtocol('error', sampleError, logger.exceptionToObject(sampleError));
        testSendingProtocol('exception', sampleError, logger.exceptionToObject(sampleError));
    });

    it('can renew session', function () {
        var oldSessionId = logger.options.sessionId;
        logger.renewSession();
        expect(logger.options.sessionId).not.toEqual(oldSessionId);
        expect(logger.systemInfoSent).toBeFalsy();
    });

    it('can send two or more items at once', function () {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer');
        logger.log(sampleData, sampleData);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual('log');
        var arg2 = spy.calls.mostRecent().args[2],
            objectsAreEqual = _.isEqual(arg2, [orderedData, orderedData]);
        //expect(spy.calls.mostRecent()).toEqual([orderedData, orderedData]);
        expect(objectsAreEqual).toBeTruthy();
    });

});