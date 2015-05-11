describe('JsLogOptions', function(){

        var /** @type JsLog */ logger,
            sample = {
                // Main settings
                "enabled": false,
                "key": false,
                "version": "SPECIFIC_KEY",
                "sessionId": "SPECIFIC_SESSION",
                // Old-style settings, deprecated
                "hookConsole": true,
                "collectSystemInfo": false,
                "trackLaunches": false,
                // New-style settings
                "logUncaughtExceptions": false,
                "console": {
                    "enabled": true,
                    "display": true,
                    "watch": ['log', 'info', 'warn', 'error']
                },
                "network": {
                    "enabled": true,
                    "codes": [],
                    "codesExclude": [200, 304, 404],
                    "logRequest": true,
                    "logResponse": true
                },
                "userInteraction": {
                    "enabled": false,
                    "events": ['click', 'dblclick', 'change', 'tap', 'drag', 'drop'],
                    "navigation": true
                }
            };

        beforeEach(function(){
            logger = new JsLog(sample);
        });

        afterEach(function(){
            logger.finalize();
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

