/* Idea of classOf() function is from the book of David Flanagan, "JavaScript: The Definitive Guide. 6th Edition" */
function classOf( object ) {
    if ( object === null ) {
        return "null";
    }
    if ( object === undefined ) {
        return "undefined";
    }
    return Object.prototype.toString.call( object ).slice( 8, -1 ).toLowerCase();
}


var validators = {

    string: function( key, value, definition ) {
        switch ( classOf( value ) ) {
            case "undefined":
                if ( definition.required ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter does not exist." } };
                } else {
                    return {};
                }
            case "null":
                if ( definition.required ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter does not exist." } };
                } else {
                    return { value: null };
                }
            case "string":
                if ( definition.hasOwnProperty( "maxLength" ) && value.length > definition.maxLength ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
                if ( definition.hasOwnProperty( "minLength" ) && value.length < definition.minLength ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
                return { value: value };
            default:
                return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
        }
    },

    number: function( key, value, definition ) {
        switch ( classOf( value ) ) {
            case "undefined":
                if ( definition.required ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter does not exist." } };
                } else {
                    return {};
                }
            case "null":
                if ( definition.required ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter does not exist." } };
                } else {
                    return { value: null };
                }
            case "string":
                value = parseFloat( value );
                if ( isNaN( value ) ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
            case "number":
                if ( definition.hasOwnProperty( "integerOnly" ) && definition.integerOnly === true && ! Number.isInteger( value ) ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
                if ( definition.hasOwnProperty( "max" ) && value > definition.max ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
                if ( definition.hasOwnProperty( "min" ) && value < definition.min ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
                return { value: value };
            default:
                return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
        }
    },

    timestamp: function( key, value, definition ) {
        switch ( classOf( value ) ) {
            case "undefined":
                if ( definition.required ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter does not exist." } };
                } else {
                    return {};
                }
            case "null":
                if ( definition.required ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter does not exist." } };
                } else {
                    return { value: null };
                }
            case "string":
                value = parseFloat( value );
                if ( isNaN( value ) ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
            case "number":
                if ( definition.hasOwnProperty( "until" ) && value > definition.until ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
                if ( definition.hasOwnProperty( "since" ) && value < definition.since ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
                return { value: new Date( value ) };
            default:
                return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
        }
    },

    array: function( key, value, definition ) {
        switch ( classOf( value ) ) {
            case "undefined":
                if ( definition.required ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter does not exist." } };
                } else {
                    return {};
                }
            case "null":
                if ( definition.required ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter does not exist." } };
                } else {
                    return { value: null };
                }
            case "array":
                if ( definition.items ) {
                    if ( classOf( definition.items ) !== "object" ) {
                        return { error: { reason:"invalid_argument", description: "config argument is not valid : '" + key + ".items'" } };
                    }

                    var validator = validators[ definition.items.type ];
                    if ( ! validator ) {
                        return { error: { reason:"invalid_argument", description: "config argument is not valid : '" + key + ".items'" } };
                    }
                }

                var refinedValue = [];

                for ( var index = 0; index < value.length; index++ ) {
                    var item = value[ index ];

                    var classType = classOf( item );
                    if ( classType !== "string" &&  classType !== "number" ) {
                        return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                    }

                    if ( definition.items ) {
                        var result = validator( key, item, definition.items );
                        if ( result.error ) {
                            return {  error: { reason: "invalid_parameter", description: "one of items of '" + key + "' parameter has invalid value." } }
                        } else {
                            item = result.value;
                        }
                    }

                    if ( definition.unique ) {
                        if ( refinedValue.indexOf( item ) == -1 ) {
                            refinedValue.push( item )
                        }
                    } else {
                        refinedValue.push( item )
                    }
                }

                if ( definition.hasOwnProperty( "maxCount" ) && refinedValue.length > definition.maxCount ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }
                if ( definition.hasOwnProperty( "minCount" ) && refinedValue.length < definition.minCount ) {
                    return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
                }

                return { value: refinedValue };
            default:
                return { error: { reason: "invalid_parameter", description: "'" + key + "' parameter has invalid value." } };
        }
    }
};


module.exports = {
    refine: function( params, config ) {
        if ( classOf( params ) !== "object" ) {
            return { error: { reason: "invalid_argument", description: "params argument is not valid." } };
        }
        if ( classOf( config ) !== "object" ) {
            return { error: { reason: "invalid_argument", description: "config argument is not valid." } };
        }

        var refinedParams = {};
        for ( var name in config ) {
            if ( classOf( name ) !== "string" || name.length == 0 ) {
                return { error: { reason: "invalid_argument", description: "config format is not valid." } };
            }

            var definition = config[ name ];
            if ( classOf( definition ) !== "object" || classOf( definition.type ) !== "string" ) {
                return { error: { reason: "invalid_argument", description: "config format is not valid." } };
            }

            var validator = validators[ definition.type ];
            if ( ! validator ) {
                return { error: { reason: "invalid_argument", description: "type '" + definition.type + "' is unsupported validator type." } };
            }

            var result = validator( name, params[ name ], definition );
            if ( result.error ) {
                return result;
            } else if ( result.hasOwnProperty( "value" ) ) {
                refinedParams[ name ] = result.value;
            }
        }

        return refinedParams;
    }
};
