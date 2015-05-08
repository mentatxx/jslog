/*global it, declare, expect*/
describe('have valid API', function () {
    var /**JsLog*/logger,
        sampleOptions = {
            "key": "MY_KEY",
            "hookConsole": false
        },
        sampleData = {
            "b": 1,
            "a": 2
        },
        sampleError = new Error('Some error text');

    beforeEach(function () {
        jasmine.Ajax.install();
        logger = new JsLog(sampleOptions);
    });

    afterEach(function () {
        logger = null;
        jasmine.Ajax.uninstall();
    });

    it('sending initial info matches protocol', function () {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer');
        logger.systemInfo(false);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual('systemInfo');
    });

    it('sending log matches protocol', function () {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer');
        logger.log(sampleData);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual('log');
        expect(spy.calls.mostRecent().args[2]).toEqual(sampleData);
    });

    it('sending info matches protocol', function () {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer');
        logger.info(sampleData);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual('info');
        expect(spy.calls.mostRecent().args[2]).toEqual(sampleData);
    });

    it('sending warn matches protocol', function () {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer');
        logger.warn(sampleData);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual('warn');
        expect(spy.calls.mostRecent().args[2]).toEqual(sampleData);
    });

    it('sending error matches protocol', function () {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer'),
            extractedException = logger.exceptionToObject(sampleError);
        logger.error(sampleError);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual('error');
        var arg2 = spy.calls.mostRecent().args[2],
            objectsAreEqual = _.isEqual(arg2, extractedException);
        expect(objectsAreEqual).toBeTruthy();
    });

    it('sending exception matches protocol', function () {
        var spy = logger.sendToServer = jasmine.createSpy('sendToServer'),
            extractedException = logger.exceptionToObject(sampleError);
        logger.exception(sampleError);
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(1);
        expect(spy.calls.mostRecent().args[0]).toEqual(sampleOptions.key);
        expect(spy.calls.mostRecent().args[1]).toEqual('exception');
        var arg2 = spy.calls.mostRecent().args[2],
            objectsAreEqual = _.isEqual(arg2, extractedException);
        expect(objectsAreEqual).toBeTruthy();
    });

});