var should = require( "should" );
var parameterUtil = require( "../index" );


var notExistResult = { error: { reason: "invalid_parameter", description: "'test' parameter does not exist." } };
var invalidValueResult = { error: { reason: "invalid_parameter", description: "'test' parameter has invalid value." } };
var invalidItemsValueResult = { error: { reason: "invalid_parameter", description: "one of items of 'test' parameter has invalid value." } };


describe( "testing #refine() function", function() {

    describe( "checking for 'params' and 'config' arguments", function() {

        it( "should fail with invalid argument : params is not Object", function() {
            var expectedResult = { error: { reason: "invalid_argument", description: "params argument is not valid." } };

            parameterUtil.refine( undefined, {} ).should.be.eql( expectedResult );
            parameterUtil.refine( null, {} ).should.be.eql( expectedResult );
            parameterUtil.refine( false, {} ).should.be.eql( expectedResult );
            parameterUtil.refine( [], {} ).should.be.eql( expectedResult );
            parameterUtil.refine( 13, {} ).should.be.eql( expectedResult );
            parameterUtil.refine( "a string", {} ).should.be.eql( expectedResult );
            parameterUtil.refine( new Date(), {} ).should.be.eql( expectedResult );
        } );

        it( "should fail with invalid argument : config is not Object", function() {
            var expectedResult = { error: { reason: "invalid_argument", description: "config argument is not valid." } };

            parameterUtil.refine( {} ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, null ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, false ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, [] ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, 13 ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, "a string" ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, new Date() ).should.be.eql( expectedResult );
        } );

        it( "should fail with invalid argument : config's property is not valid", function() {
            var expectedResult = { error: { reason: "invalid_argument", description: "config format is not valid." } };

            parameterUtil.refine( {}, {} ).should.be.eql( {} );
            parameterUtil.refine( {}, { "": { type: "string" } } ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, { "test": {} } ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, { "test": null } ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, { "test": true } ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, { "test": [] } ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, { "test": 123 } ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, { "test": "a string" } ).should.be.eql( expectedResult );
            parameterUtil.refine( {}, { "test": new Date() } ).should.be.eql( expectedResult );

            parameterUtil.refine( {}, { "test": { type: "unsupported" } } )
                         .should.be.eql( { error: { reason: "invalid_argument", description: "type 'unsupported' is unsupported validator type." } } );
        } );
    } );

    describe( "checking for 'string' validator", function() {

        it( "{ type: 'string', required: true, minLength: 3, maxLength: 10 }", function() {
            var config = { "test": { type: "string", required: true, minLength: 3, maxLength: 10 } };

            parameterUtil.refine( {}, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": undefined }, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": false }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 12 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "12" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "123" }, config ).should.be.eql( { "test": "123" } );
            parameterUtil.refine( { "test": "123456" }, config ).should.be.eql( { "test": "123456" } );
            parameterUtil.refine( { "test": "1234567890" }, config ).should.be.eql( { "test": "1234567890" } );
            parameterUtil.refine( { "test": "12345678901" }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'string', minLength: 3, maxLength: 10 }", function() {
            var config = { "test": { type: "string", minLength: 3, maxLength: 10 } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": undefined }, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": true }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 12 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "12" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "123" }, config ).should.be.eql( { "test": "123" } );
            parameterUtil.refine( { "test": "123456" }, config ).should.be.eql( { "test": "123456" } );
            parameterUtil.refine( { "test": "1234567890" }, config ).should.be.eql( { "test": "1234567890" } );
            parameterUtil.refine( { "test": "12345678901" }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'string', minLength: 0 }", function() {
            var config = { "test": { type: "string", minLength: 0 } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": false }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 12 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "" }, config ).should.be.eql( { "test": "" } );
            parameterUtil.refine( { "test": "123" }, config ).should.be.eql( { "test": "123" } );
            parameterUtil.refine( { "test": "12345678901234567" }, config ).should.be.eql( { "test": "12345678901234567" } );
        } );

        it( "{ type: 'string' }", function() {
            var config = { "test": { type: "string" } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": true }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 12 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "" }, config ).should.be.eql( { "test": "" } );
            parameterUtil.refine( { "test": "123" }, config ).should.be.eql( { "test": "123" } );
            parameterUtil.refine( { "test": "12345678901234567" }, config ).should.be.eql( { "test": "12345678901234567" } );
        } );
    } );

    describe( "checking for 'number' validator", function() {

        it( "{ type: 'number', required: true, min: -3, max: 10 }", function() {
            var config = { "test": { type: "number", required: true, min: -3, max: 10 } };

            parameterUtil.refine( {}, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": false }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "9.9" }, config ).should.be.eql( { "test": 9.9 } );
            parameterUtil.refine( { "test": "-2.9" }, config ).should.be.eql( { "test": -2.9 } );
            parameterUtil.refine( { "test": "10.1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "-3.1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "9" }, config ).should.be.eql( { "test": 9 } );
            parameterUtil.refine( { "test": "-2" }, config ).should.be.eql( { "test": -2 } );
            parameterUtil.refine( { "test": "11" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "-4" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 9.9 }, config ).should.be.eql( { "test": 9.9 } );
            parameterUtil.refine( { "test": -2.9 }, config ).should.be.eql( { "test": -2.9 } );
            parameterUtil.refine( { "test": 10.1 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": -3.1 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 9 }, config ).should.be.eql( { "test": 9 } );
            parameterUtil.refine( { "test": -2 }, config ).should.be.eql( { "test": -2 } );
            parameterUtil.refine( { "test": 11 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": -4 }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'number', min: -3, max: 10 }", function() {
            var config = { "test": { type: "number", min: -3, max: 10 } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": true }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "10.0" }, config ).should.be.eql( { "test": 10 } );
            parameterUtil.refine( { "test": "-3.0" }, config ).should.be.eql( { "test": -3 } );
            parameterUtil.refine( { "test": "10.1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "-3.1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "10" }, config ).should.be.eql( { "test": 10 } );
            parameterUtil.refine( { "test": "-3" }, config ).should.be.eql( { "test": -3 } );
            parameterUtil.refine( { "test": "11" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "-4" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 10.0 }, config ).should.be.eql( { "test": 10 } );
            parameterUtil.refine( { "test": -3.0 }, config ).should.be.eql( { "test": -3 } );
            parameterUtil.refine( { "test": 10.1 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": -3.1 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 10 }, config ).should.be.eql( { "test": 10 } );
            parameterUtil.refine( { "test": -3 }, config ).should.be.eql( { "test": -3 } );
            parameterUtil.refine( { "test": 11 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": -4 }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'number', max: 0 }", function() {
            var config = { "test": { type: "number", max: 0 } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": false }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "0.0" }, config ).should.be.eql( { "test": 0 } );
            parameterUtil.refine( { "test": "-0.1" }, config ).should.be.eql( { "test": -0.1 } );
            parameterUtil.refine( { "test": "0.1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "0" }, config ).should.be.eql( { "test": 0 } );
            parameterUtil.refine( { "test": "-1" }, config ).should.be.eql( { "test": -1 } );
            parameterUtil.refine( { "test": "1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 0.0 }, config ).should.be.eql( { "test": 0 } );
            parameterUtil.refine( { "test": -0.1 }, config ).should.be.eql( { "test": -0.1 } );
            parameterUtil.refine( { "test": 0.1 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 0 }, config ).should.be.eql( { "test": 0 } );
            parameterUtil.refine( { "test": -1 }, config ).should.be.eql( { "test": -1 } );
            parameterUtil.refine( { "test": 1 }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'number', integerOnly: true }", function() {
            var config = { "test": { type: "number", integerOnly: true } };

            parameterUtil.refine( { "test": 2.0 }, config ).should.be.eql( { test: 2 } );
            parameterUtil.refine( { "test": 100 }, config ).should.be.eql( { test: 100 } );
            parameterUtil.refine( { "test": "9.3" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": -9.3 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'number' }", function() {
            var config = { "test": { type: "number" } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": true }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "9.3" }, config ).should.be.eql( { "test": 9.3 } );
            parameterUtil.refine( { "test": "-1.2" }, config ).should.be.eql( { "test": -1.2 } );
            parameterUtil.refine( { "test": "9.0" }, config ).should.be.eql( { "test": 9 } );
            parameterUtil.refine( { "test": "-1.0" }, config ).should.be.eql( { "test": -1 } );
            parameterUtil.refine( { "test": "11" }, config ).should.be.eql( { "test": 11 } );
            parameterUtil.refine( { "test": "-4" }, config ).should.be.eql( { "test": -4 } );
            parameterUtil.refine( { "test": 9.9 }, config ).should.be.eql( { "test": 9.9 } );
            parameterUtil.refine( { "test": -2.9 }, config ).should.be.eql( { "test": -2.9 } );
            parameterUtil.refine( { "test": 10.0 }, config ).should.be.eql( { "test": 10 } );
            parameterUtil.refine( { "test": -3.0 }, config ).should.be.eql( { "test": -3 } );
            parameterUtil.refine( { "test": 11 }, config ).should.be.eql( { "test": 11 } );
            parameterUtil.refine( { "test": -5 }, config ).should.be.eql( { "test": -5 } );
            parameterUtil.refine( { "test": 0 }, config ).should.be.eql( { "test": 0 } );
        } );
    } );

    describe( "checking for 'timestamp' validator", function() {

        it( "{ type: 'timestamp', required: true, since: -30000, until: 1049122800000 }", function() {
            var config = { "test": { type: "timestamp", required: true, since: -30000, until: 1049122800000 } };

            parameterUtil.refine( {}, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": false }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "1049122800000" }, config ).should.be.eql( { "test": new Date( 1049122800000 ) } );
            parameterUtil.refine( { "test": "-30000" }, config ).should.be.eql( { "test": new Date( -30000 ) } );
            parameterUtil.refine( { "test": "123456789012" }, config ).should.be.eql( { "test": new Date( 123456789012 ) } );
            parameterUtil.refine( { "test": "1049122800001" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "-30001" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 1049122800000 }, config ).should.be.eql( { "test": new Date( 1049122800000 ) } );
            parameterUtil.refine( { "test": -30000 }, config ).should.be.eql( { "test": new Date( -30000 ) } );
            parameterUtil.refine( { "test": 123456789012 }, config ).should.be.eql( { "test": new Date( 123456789012 ) } );
            parameterUtil.refine( { "test": 1049122800001 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": -30001 }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'timestamp', since: -30000, until: 1049122800000 }", function() {
            var config = { "test": { type: "timestamp", since: -30000, until: 1049122800000 } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": true }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "1049122800000.0" }, config ).should.be.eql( { "test": new Date( 1049122800000 ) } );
            parameterUtil.refine( { "test": "-30000.0" }, config ).should.be.eql( { "test": new Date( -30000 ) } );
            parameterUtil.refine( { "test": "123456789012.3" }, config ).should.be.eql( { "test": new Date( 123456789012.3 ) } );
            parameterUtil.refine( { "test": "1049122800000.1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "-30000.1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 1049122800000.0 }, config ).should.be.eql( { "test": new Date( 1049122800000 ) } );
            parameterUtil.refine( { "test": -30000.0 }, config ).should.be.eql( { "test": new Date( -30000 ) } );
            parameterUtil.refine( { "test": 123456789012.3 }, config ).should.be.eql( { "test": new Date( 123456789012.3 ) } );
            parameterUtil.refine( { "test": 1049122800000.1 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": -30000.1 }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'timestamp', until: 0 }", function() {
            var config = { "test": { type: "timestamp", until: 0 } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": false }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "0" }, config ).should.be.eql( { "test": new Date( 0 ) } );
            parameterUtil.refine( { "test": "-0.1" }, config ).should.be.eql( { "test": new Date( -0.1 ) } );
            parameterUtil.refine( { "test": "0.1" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 0 }, config ).should.be.eql( { "test": new Date( 0 ) } );
            parameterUtil.refine( { "test": -0.1 }, config ).should.be.eql( { "test": new Date( -0.1 ) } );
            parameterUtil.refine( { "test": 0.1 }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'timestamp' }", function() {
            var config = { "test": { type: "timestamp" } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": true }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "1049122800000" }, config ).should.be.eql( { "test": new Date( 1049122800000 ) } );
            parameterUtil.refine( { "test": "-1049122800000.1" }, config ).should.be.eql( { "test": new Date( -1049122800000.1 ) } );
        } );
    } );

    describe( "checking for 'array' validator", function() {

        it( "{ type: 'array', required: true, unique: true, minCount: 2, maxCount: 5 }", function() {
            var config = { "test" : { type: "array", required: true, unique: true, minCount: 2, maxCount: 5 } };

            parameterUtil.refine( {}, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( notExistResult );
            parameterUtil.refine( { "test": false }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 31 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, null ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, undefined ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, {} ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, [] ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, false ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, new Date() ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ "123" ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, "apple" ] }, config ).should.be.eql( { "test": [ 123, "apple" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple" ] }, config ).should.be.eql( { "test": [ 123, 1234567890, "apple" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple", "cherry", "banana" ] }, config ).should.be.eql( { "test": [ 123, 1234567890, "apple", "cherry", "banana" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple", "cherry", "banana", "too many" ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, 123456, "apple", "cherry", "banana", "apple", 123456 ] }, config ).should.be.eql( { "test": [ 123, 123456, "apple", "cherry", "banana" ] } );
            parameterUtil.refine( { "test": [ 123, 123 ] }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'array', unique: true, minCount: 2, maxCount: 5 }", function() {
            var config = { "test" : { type: "array", unique: true, minCount: 2, maxCount: 5 } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": true }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": {} }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 31 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ "123" ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, "apple" ] }, config ).should.be.eql( { "test": [ 123, "apple" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple" ] }, config ).should.be.eql( { "test": [ 123, 1234567890, "apple" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple", "cherry", "banana" ] }, config ).should.be.eql( { "test": [ 123, 1234567890, "apple", "cherry", "banana" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple", "cherry", "banana", "too many" ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, 123456, "apple", "cherry", "banana", "apple", 123456 ] }, config ).should.be.eql( { "test": [ 123, 123456, "apple", "cherry", "banana" ] } );
            parameterUtil.refine( { "test": [ 123, 123 ] }, config ).should.be.eql( invalidValueResult );
        } );

        it( "{ type: 'array', minCount: 2, maxCount: 5 }", function() {
            var config = { "test" : { type: "array", minCount: 2, maxCount: 5 } };

            parameterUtil.refine( {}, config ).should.be.eql( {} );
            parameterUtil.refine( { "test": null }, config ).should.be.eql( { "test": null } );
            parameterUtil.refine( { "test": true }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": "a string" }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": 31 }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": new Date() }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, null ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, undefined ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, {} ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, [] ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, false ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, new Date() ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ "123" ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123, "apple" ] }, config ).should.be.eql( { "test": [ 123, "apple" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple" ] }, config ).should.be.eql( { "test": [ 123, 1234567890, "apple" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple", "cherry", "banana" ] }, config ).should.be.eql( { "test": [ 123, 1234567890, "apple", "cherry", "banana" ] } );
            parameterUtil.refine( { "test": [ 123, 1234567890, "apple", "cherry", "banana", "too many" ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ 123456, "apple", "banana", "apple", 123456 ] }, config ).should.be.eql( { "test": [ 123456, "apple", "banana", "apple", 123456 ] } );
            parameterUtil.refine( { "test": [ 123, 123 ] }, config ).should.be.eql( { "test": [ 123, 123 ] } );
        } );

        it( "{ type: 'array', minCount: 2, maxCount: 5, items: 'invalid values' }", function() {
            var params = { "test": [ 123, "apple" ] };
            var expectedResut = { error: { reason: "invalid_argument", description: "config argument is not valid : 'test.items'" } };

            parameterUtil.refine( params, { "test" : { type: "array", minCount: 2, maxCount: 5, items: null } } ).should.be.eql( { "test": [ 123, "apple" ] } );
            parameterUtil.refine( params, { "test" : { type: "array", minCount: 2, maxCount: 5, items: true } } ).should.be.eql( expectedResut );
            parameterUtil.refine( params, { "test" : { type: "array", minCount: 2, maxCount: 5, items: "a string" } } ).should.be.eql( expectedResut );
            parameterUtil.refine( params, { "test" : { type: "array", minCount: 2, maxCount: 5, items: 13 } } ).should.be.eql( expectedResut );
            parameterUtil.refine( params, { "test" : { type: "array", minCount: 2, maxCount: 5, items: [] } } ).should.be.eql( expectedResut );
            parameterUtil.refine( params, { "test" : { type: "array", minCount: 2, maxCount: 5, items: {} } } ).should.be.eql( expectedResut );
            parameterUtil.refine( params, { "test" : { type: "array", minCount: 2, maxCount: 5, items: { type: "unsupported" } } } ).should.be.eql( expectedResut );
        } );

        it( "{ type: 'array', required: true, unique: true, minCount: 2, maxCount: 5, items: { type: 'string', minLength: 3, maxLength: 10 } }", function() {
            var config = { "test" : { type: "array", required: true, unique: true, minCount: 2, maxCount: 5, items: { type: "string", minLength: 3, maxLength: 10 } } };

            parameterUtil.refine( { "test": [ "123", "1234567890", "apple", "123" ] }, config ).should.be.eql( { "test": [ "123", "1234567890", "apple" ] } );
            parameterUtil.refine( { "test": [ "123", "1234567890", "apple", "123", "banana", "cherry", "orange" ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ "123", "12345678901", "apple" ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ "12", "1234567890", "apple" ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ "123", 1234567890, "apple" ] }, config ).should.be.eql( invalidItemsValueResult );
        } );

        it( "{ type: 'array', required: true, minCount: 2, maxCount: 5, items: { type: 'number', min: -1, max: 100 } }", function() {
            var config = { "test" : { type: "array", required: true, minCount: 2, maxCount: 5, items: { type: "number", min: -1, max: 100 } } };

            parameterUtil.refine( { "test": [ -1, 47, 33.5, 47, 100 ] }, config ).should.be.eql( { "test": [ -1, 47, 33.5, 47, 100 ] } );
            parameterUtil.refine( { "test": [ -1 ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ -1, 0, 33.5, -3, 100 ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ -1, 0, 33.5, 101, 100 ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ 30.3, "95", 100 ] }, config ).should.be.eql( { "test": [ 30.3, 95, 100 ] } );
            parameterUtil.refine( { "test": [ 30.3, "apple", 100 ] }, config ).should.be.eql( invalidItemsValueResult );
        } );

        it( "{ type: 'array', unique: true, minCount: 2, maxCount: 5, items: { type: 'number', min: -1, max: 100, integerOnly: true } }", function() {
            var config = { "test" : { type: "array", unique: true, minCount: 2, maxCount: 5, items: { type: "number", min: -1, max: 100, integerOnly: true } } };

            parameterUtil.refine( { "test": [ -1, 0, 33, 47, 100 ] }, config ).should.be.eql( { "test": [ -1, 0, 33, 47, 100 ] } );
            parameterUtil.refine( { "test": [ -1, -2, 33, 47, 100 ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ -1, 0, 33, 101, 100 ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ -1, 0, 33, "99", 100 ] }, config ).should.be.eql( { "test": [ -1, 0, 33, 99, 100 ] } );
            parameterUtil.refine( { "test": [ -1, 0, 33, "apple", 100 ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ -1, 0, 33, 33.5, 100 ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ -1, 0, 33, "33.5", 100 ] }, config ).should.be.eql( invalidItemsValueResult );
        } );

        it( "{ type: 'array', minCount: 2, maxCount: 5, items: { type: 'timestamp', since: -100, until: 1000 } }", function() {
            var config = { "test" : { type: "array", minCount: 2, maxCount: 5, items: { type: "timestamp", since: -100, until: 1000 } } };

            parameterUtil.refine( { "test": [ -100, 32, 1000 ] }, config ).should.be.eql( { "test": [ new Date( -100 ), new Date( 32 ), new Date( 1000 ) ] } );
            parameterUtil.refine( { "test": [ -100, 32, 1000, 82, 99, 32 ] }, config ).should.be.eql( invalidValueResult );
            parameterUtil.refine( { "test": [ -101, 32, 1000 ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ -100, 32, 1001 ] }, config ).should.be.eql( invalidItemsValueResult );
            parameterUtil.refine( { "test": [ -100, "32", 1000 ] }, config ).should.be.eql( { "test": [ new Date( -100 ), new Date( 32 ), new Date( 1000 ) ] } );
            parameterUtil.refine( { "test": [ -100, "apple", 1000 ] }, config ).should.be.eql( invalidItemsValueResult );
        } );
    } );

    describe( "checking for multiple parameters and validators", function() {
        it( "all together", function() {
            parameterUtil.refine( {
                string: "together", numberDouble: 32.3, numberInteger: "53", timestamp: 123456, array: [ 123, "456" ]
            }, {
                string: { type: "string", required: true, minLength: 3, maxLength: 10 },
                numberDouble: { type: "number", required: true, min: 10, max: 40 },
                numberInteger: { type: "number", required: true, min: 40, max: 60, integerOnly: true },
                timestamp: { type: "timestamp", required: true, since: 0, until: 10000000 },
                array: { type: "array", required: true, minCount: 1, maxCount: 3, items: { type: "number", min: 100, max: 500, integerOnly: true } }
            } ).should.be.eql( {
                string: "together", numberDouble: 32.3, numberInteger: 53, timestamp: new Date( 123456 ), array: [ 123, 456 ]
            } );
        } );
    } );
} );
