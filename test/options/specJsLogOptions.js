describe('JsLogOptions', function(){

        var /** @type JsLog */ logger,
            sample = {
                // Main settings
                "enabled": true,
                "key": "SPECIFIC_KEY",
                "version": "SPECIFIC_VERSION",
                "sessionId": "SPECIFIC_SESSION",
                // Old-style settings, deprecated
                "hookConsole": false,
                "collectSystemInfo": false,
                "trackLaunches": false,
                // New-style settings
                "logUncaughtExceptions": false,
                "console": {
                    "enabled": false,
                    "display": true,
                    "watch": ['log', 'info', 'warn', 'error']
                },
                "network": {
                    "enabled": true,
                    "codes": [200, 304, 404],
                    "codesExclude": [],
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

        it('assigns value', function(){
            var options = new JsLog.JsLogOptions();
            options.assign(sample);
            expect(_.isEqual(JSON.stringify(options), JSON.stringify(sample))).toBeTruthy();
        });


    });

