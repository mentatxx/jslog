/*global it, declare, expect*/
describe('pending queue', function () {
    var longSampleData = [{
            "b": (new Array(1000)).join('a'),
            "a": 2
        }],
        longSampleText = JSON.stringify(longSampleData),
        /**PendingSenderService*/pendingSenderService,
        /**PendingQueue*/pendingQueue,
        senderMock;

    beforeEach(function () {
        localStorage.clear();
        jasmine.Ajax.install();
        jasmine.clock().install();
        senderMock = {
            inOperation: false,
            strategy: 0,
            operationTime: 1000,
            sendPacket: function (protocol, postData, forceSend, successHandler, failHandler) {
                var that = this;
                if (this.inOperation && !forceSend) {
                    failHandler();
                    return;
                }
                this.inOperation = true;
                if (this.strategy === 0) {
                    setTimeout(function () {
                        that.inOperation = false;
                        successHandler();
                    }, this.operationTime);
                }
                if (this.strategy === 1) {
                    setTimeout(function () {
                        that.inOperation = false;
                        failHandler();
                    }, this.operationTime);
                }
            }
        };
        pendingQueue = new JsLog.PendingQueue();
        pendingSenderService = new JsLog.PendingSenderService('http:', senderMock, pendingQueue);
    });

    afterEach(function () {
        pendingSenderService.stop();
        pendingSenderService = null;
        jasmine.clock().uninstall();
        jasmine.Ajax.uninstall();
    });

    it('can start and stop sending postponed messages', function () {
        pendingSenderService.sendPendingItem = jasmine.createSpy('sendPendingItem');
        expect(pendingSenderService.sendPendingItem).not.toHaveBeenCalled();
        pendingSenderService.start();
        jasmine.clock().tick(JsLog.PendingSenderService.SEND_POSTPONE_INTERVAL);
        expect(pendingSenderService.sendPendingItem.calls.count()).toEqual(1);
        pendingSenderService.stop();
        jasmine.clock().tick(2 * JsLog.PendingSenderService.SEND_POSTPONE_INTERVAL);
        expect(pendingSenderService.sendPendingItem.calls.count()).toEqual(1);
    });

    it('do not double start', function () {
        pendingSenderService.sendPendingItem = jasmine.createSpy('sendPendingItem');
        expect(pendingSenderService.sendPendingItem).not.toHaveBeenCalled();
        pendingSenderService.start();
        pendingSenderService.start();
        jasmine.clock().tick(JsLog.PendingSenderService.SEND_POSTPONE_INTERVAL);
        expect(pendingSenderService.sendPendingItem.calls.count()).toEqual(1);
        pendingSenderService.stop();
    });

    it('sends data from queue', function () {
        pendingQueue.add(longSampleText);
        pendingQueue.add(longSampleText);
        pendingQueue.add(longSampleText);
        spyOn(senderMock, 'sendPacket');
        pendingSenderService.sendPendingItem();
        jasmine.clock().tick(60000);
        var sendArg = JSON.parse(senderMock.sendPacket.calls.first().args[1]);
        expect(sendArg.length).toEqual(3);
    });
});