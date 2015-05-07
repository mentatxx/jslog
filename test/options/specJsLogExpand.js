describe('expands JSON', function () {
    var logger,
        sampleOptions = {};

    beforeEach(function () {
        logger = new JsLog(sampleOptions);
    });

    afterEach(function () {
        logger = null;
    });

    it('with ordering', function () {
        var sourceJson = {"b": 1, "a": 2, "c": [1, 2]},
            expandedJson = logger.expand(sourceJson),
            stringifiedJson = JSON.stringify(expandedJson),
            expectedResult = '{"a":2,"b":1,"c":[1,2]}';
        expect(stringifiedJson).toEqual(expectedResult);
    });

    it('with circular references', function () {
        var sourceJson = {"b": 1, "a": 2};
        sourceJson.c = sourceJson;
        var expandedJson = logger.expand(sourceJson),
            stringifiedJson = JSON.stringify(expandedJson),
            expectedResult = '{"a":2,"b":1,"c":"<circular ref>"}';
        expect(stringifiedJson).toEqual(expectedResult);
    });

    it('with null value', function () {
        var sourceJson = {"b": 1, "a": 2, "c": null},
            expandedJson = logger.expand(sourceJson),
            stringifiedJson = JSON.stringify(expandedJson),
            expectedResult = '{"a":2,"b":1,"c":null}';
        expect(stringifiedJson).toEqual(expectedResult);
    });

    xit('and cuts functions', function () {
        var sourceJson = {"b": 1, "a": 2, "f": function(){}},
            expandedJson = logger.expand(sourceJson),
            stringifiedJson = JSON.stringify(expandedJson),
            expectedResult = '{"a":2,"b":1}';
        expect(stringifiedJson).toEqual(expectedResult);
    });


});