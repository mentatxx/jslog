describe('JsLogOptions', function(){

        var /** @type JsLog */ logger,
            sample = {
                "enabled": false,
                "logUncaughtExceptions": false,
                "hookConsole": false,
                "trackHost": false,
                "collectSystemInfo": false,
                "trackLaunches": false,
                "key": false,
                "version": "SPECIFIC_KEY",
                "sessionId": "SPECIFIC_SESSION"
            };

        beforeEach(function(){
            logger = new JsLog(sample);
        });

        afterEach(function(){
            logger = null;
        });

        it('should accept all specified options', function(){
            var allFilled = true;
            _.each(sample, function(val, key){
                var fieldOk = sample[key] === logger.options[key];
                allFilled = allFilled && fieldOk;
                if (!fieldOk) {
                    console.log('Failed for field ', key);
                }
            });
            expect(allFilled).toEqual(true);
        });

        it('should not any other options', function(){
            var allFilled = true;
            _.each(logger.options, function(val, key){
                var haveField = sample.hasOwnProperty(key);
                allFilled = allFilled && haveField;
                if (!haveField) {
                    console.log('Failed for field ', key);
                }
            });
            expect(allFilled).toEqual(true);
        });

    });

