# parameter-util
Parameter validity checking utility for Node.js

## Installation

```
$ npm install https://github.com/up2soul/parameter-util.git
```

## Usage

### refine( params, config ) -> refined-params

`refine()` function validates _params_ argument according to given _config_ argument, and returns _refined-params_ as a result of validation.
If invalid values are found in _params_ argument, `refine()` function returns an object that contains information about which value is invalid.
Otherwise, `refine()` function returns the 'refined version' of _params_ argument. In this context, 'refinement' means that `refine()` function
might correct miscellaneous but not so serious problems at values in _params_ argument. For example, when _config_ requires `number` value
but `string` value is given, `refine()` function corrects that value to `number` type if `string` value can be converted to `number` value successfully.

_config_ argument is a simple object which defines what types of _params_ values are expected. _config_ object's key is the name of each parameter value,
and _config_ object's value is the information about the required condition of that parameter value.

`refine()` function validates the following types of parameter values.

#### string

* type (_"string"_) : Parameter value should be `string` type.
* required (_boolean_) : Parameter value should exist. If not exist, function returns error. `null` value is valid if "required" is not `true`. Default is `false`.
* maxLength (_number_) : The length of `string` parameter value should not be greater than "maxLength", if defined.
* minLength (_number_) : The length of `string` parameter value should not be less than "minLength", if defined.

#### number

* type (_"number"_) : Parameter value should be `number` type. If parameter value is `string` type and can be converted into `number` type using `parseFloat()` function,
parameter value is replaced with the 'converted' `number` type value.
* required (_boolean_) : Parameter value should exist. If not exist, function returns error. `null` value is valid if "required" is not `true`. Default is `false`.
* integerOnly (_boolean_) : Parameter value should be integer value. Floating point number is not allowed. Default is `false`.
* max (_number_) : `number` parameter value should not be greater than "max value, if defined.
* min (_number_) : `number` parameter value should not be less than "min" value, if defined.

#### timestamp

* type (_"timestamp"_) : Parameter value should be `number` type, and that `number` value is automatically replaced with the result of `new Date( timestamp )` expression.
If parameter value is `string` type and can be converted into `number` type using `parseFloat()` function, this 'converted' `number` type value is used instead.
* required (_boolean_) : Parameter value should exist. If not exist, function returns error. `null` value is valid if "required" is not `true`. Default is `false`.
* until (_number_) : `number` parameter value should not be greater than "until" value, if defined.
* since (_number_) : `number` parameter value should not be less than "since" value, if defined.

#### array

* type (_"array"_) : Parameter value should be `array` type. For now, only `string` and `number` values are allowed as items of parameter `array`.
* required (_boolean_) : Parameter value should exist. If not exist, function returns error. `null` value is valid if `required` is not `true`. Default is `false`.
* unique (_boolean_) : Items of `array` parameter value should have a unique value in `array`. If same items are found in `array`, only the first one is kept
and the others are eliminated from `array`. Default is `false`.
* maxCount (_number_) : The length(count of items) of `array` parameter value should not be greater than "maxCount", if defined.
* minCount (_number_) : The length(count of items) of `array` parameter value should not be less than "minCount", if defined.
* items (_object_) : Items of `array` parameter value should conform to "items" option's definition, if defined. "items" option shares the same syntax with _config_ parameter.
But `array` type is not allowed, for now.


```javascript
var parameterUtil = require( "parameter-util" );

var config = {
    name: { type: "string", required: true, minLength: 1, maxLength: 30 },
    score: { type: "number", required: true, min: 0, max: 100 },
    ranking: { type: "number", required: true, min: 1, max: 1000, integerOnly: true },
    date: { type: "timestamp", required: true, since: 1451606400000, until: 1477958400000 },
                                            // between 2016.1.1 and 2016.10.30
    verifiedBy: {
        type: "array", required: true, unique: true, minCount: 2, maxCount: 10,
        items: { type: "string", minLength: 1, maxLength: 30 }
    },
    previousScore: { type: "number", min: 0, max: 100 }
};

var refinedParams;

refinedParams = parameterUtil.refine( {
    name: "Richard",
    score: 89.7,
    ranking: "9",
    date: 1467331200000,
    verifiedBy: [ "Amia", "Dylan", "Ava", "Dylan" ],
    previousScore: 77
}, config );

/*
{ name: 'Richard',
  score: 89.7,
  ranking: 9,                               // string type input was automatically refined to number
  date: 2016-07-01T00:00:00.000Z,           // UTC timestamp was converted to Date type
  verifiedBy: [ 'Amia', 'Dylan', 'Ava' ],   // second "Dylan" was eliminated due to 'unique' keyword
  previousScore: 77 }
*/

refinedParams = parameterUtil.refine( {
    name: "Richard",
    score: 89.7,
    ranking: "9",
    date: 1467331200000,
    verifiedBy: [ "Amia", "Dylan", "Ava", "Dylan" ]
}, config );

/*
{ name: 'Richard',
  score: 89.7,
  ranking: 9,
  date: 2016-07-01T00:00:00.000Z,
  verifiedBy: [ 'Amia', 'Dylan', 'Ava' ] }
    // missing 'previousScore' parameter is not 'required' parameter, so error is not raised
*/

refinedParams = parameterUtil.refine( {
    name: "",
    score: 89.7,
    ranking: "9",
    date: 1467331200000,
    verifiedBy: [ "Amia", "Dylan", "Ava", "Dylan" ],
    previousScore: 77
}, config );

/*
{ error:
   { reason: 'invalid_parameter',
     description: '\'name\' parameter has invalid value.' } }
    // 'name' parameter's 'minLength' is 1, but input length was 0
*/

refinedParams = parameterUtil.refine( {
    name: "Richard",
    score: 101,
    ranking: "9",
    date: 1467331200000,
    verifiedBy: [ "Amia", "Dylan", "Ava", "Dylan" ],
    previousScore: 77
}, config );

/*
{ error:
   { reason: 'invalid_parameter',
     description: '\'score\' parameter has invalid value.' } }
    // 'score' parameter's 'max' value is 100, but input value was 101
*/

refinedParams = parameterUtil.refine( {
    name: "Richard",
    score: 89.7,
    ranking: "9.9",
    date: 1467331200000,
    verifiedBy: [ "Amia", "Dylan", "Ava", "Dylan" ],
    previousScore: 77
}, config );

/*
{ error:
   { reason: 'invalid_parameter',
     description: '\'ranking\' parameter has invalid value.' } }
    // 'ranking' parameter should be integer, but input value was double
*/

refinedParams = parameterUtil.refine( {
    name: "Richard",
    score: 89.7,
    ranking: "9",
    date: 1467331200000,
    verifiedBy: [ "Amia" ],
    previousScore: 77
}, config );

/*
{ error:
   { reason: 'invalid_parameter',
     description: '\'verifiedBy\' parameter has invalid value.' } }
    // 'verifiedBy' parameter's 'minCount' is 2, but input count was 1
*/

refinedParams = parameterUtil.refine( {
    name: "Richard",
    score: 89.7,
    ranking: "9",
    date: 1467331200000,
    verifiedBy: [ "Amia", "Dylan", "Ava", 2016 ],
    previousScore: 77
}, config );

/*
{ error:
   { reason: 'invalid_parameter',
     description: 'one of items of \'verifiedBy\' parameter has invalid value.' } }
    // 'verifiedBy' array only accepts string type as items, but there was a number
*/
```

## License
[Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
