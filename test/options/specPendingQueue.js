/*global it, declare, expect*/
describe('pending queue', function () {
    var /**JsLog*/logger,
        sampleOptions = {
            "key": "MY_KEY",
            "hookConsole": false
        },
        sampleData = [{
            "b": 1,
            "a": 2
        }],
        longSampleData = [{
            "b": (new Array(1000)).join('a'),
            "a": 2
        }],
        sampleError = new Error('Some error text'),
        /**PendingQueue*/pendingQueue;

    beforeEach(function () {
        localStorage.clear();
        jasmine.Ajax.install();
        pendingQueue = new JsLog.PendingQueue();
    });

    afterEach(function () {
        pendingQueue = null;
        jasmine.Ajax.uninstall();
    });

    it('clears data', function () {
        pendingQueue.clear();
        expect(pendingQueue.postponedLength).toEqual(0);
        expect(pendingQueue.postponedSize).toEqual(0);
        expect(pendingQueue.postponed).toEqual({});
        expect(pendingQueue.counter).toEqual(0);
        expect(pendingQueue.timePrefix).toBeTruthy();
        expect(pendingQueue.lastItem).toBeUndefined();
    });

    it('adds data', function(){
        var sampleText = JSON.stringify(sampleData);
        pendingQueue.clear();
        expect(pendingQueue.haveItems()).toBeFalsy();
        pendingQueue.add(sampleText);
        expect(pendingQueue.haveItems()).toBeTruthy();
        expect(function(){pendingQueue.add('aaaaaaa');}).toThrow();
    });

    it('combine records', function(){
        var sampleText = JSON.stringify(sampleData);
        pendingQueue.clear();
        expect(pendingQueue.haveItems()).toBeFalsy();
        pendingQueue.add(sampleText);
        pendingQueue.add(sampleText);
        expect(pendingQueue.haveItems()).toEqual(1);
        var fetchedValue = pendingQueue.fetchItem(),
            item = JSON.parse(fetchedValue.value),
            expectedResult = [sampleData[0], sampleData[0]];
        expect(item).toEqual(expectedResult);
        expect(fetchedValue).toBeDefined();
        expect(fetchedValue.key).toBeDefined();
        expect(fetchedValue.value).toBeDefined();
    });

    it('load / saves records', function(){
        var sampleText = JSON.stringify(longSampleData),
            MESSAGE_COUNT = 1000,
            result = [],
            item;
        // Clear & Fill
        pendingQueue.clear();
        expect(pendingQueue.haveItems()).toBeFalsy();
        for (var i=0; i<MESSAGE_COUNT; i++) {
            pendingQueue.add(sampleText);
        }
        // Load from storage
        pendingQueue.clear();
        expect(pendingQueue.haveItems()).toBeFalsy();
        pendingQueue.loadPostponedData();
        //
        expect(pendingQueue.haveItems()).toBeGreaterThan(1);
        while (item = pendingQueue.fetchItem()) {
            var value = JSON.parse(item.value);
            result = result.concat(value);
            pendingQueue.deleteItem(item.key);
        }
        expect(result.length).toEqual(MESSAGE_COUNT);
        expect(pendingQueue.haveItems()).toBeFalsy();
    });

    it('ignores messages over limit', function(){
        var sampleText = JSON.stringify(longSampleData),
            OVERSIZE_COUNT = 2000;
        //
        pendingQueue.clear();
        for (var i=0; i<OVERSIZE_COUNT; i++) {
            pendingQueue.add(sampleText);
        }
        expect(pendingQueue.counter).toBeLessThan(OVERSIZE_COUNT);
    });


});
