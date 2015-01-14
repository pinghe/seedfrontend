/**
 * Created by mengzhx on 2015-01-08.
 */
(function( global, factory ) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get avalon.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var avalon = require("avalon")(window);
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "Avalon requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal )
{
    var strundefined = typeof undefined;

    var testamd = {};



// Register as a named AMD module, since avalon can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase avalon is used because AMD module names are
// derived from file names, and Avalon is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of avalon, it will work.

// Note that for maximum portability, libraries that are not avalon should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. avalon is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

    if ( typeof define === "function" && define.amd ) {
        define( "testamd", [], function() {
            return testamd;
        });
    }

    var
    // Map over avalon in case of overwrite
        _testamd = window.testamd;

    testamd.noConflict = function( deep ) {

        if ( deep && window.testamd === testamd ) {
            window.testamd = testamd;
        }

        return testamd;
    };


// Expose avalon and $ identifiers, even in AMD
// and CommonJS for browser emulators
    if ( typeof noGlobal === strundefined ) {
        window.testamd = testamd;
    }

    return testamd;

}));

//(function(factory) {
//    if (typeof define === 'function' && define.amd) {
//        define([], factory);
//    }
//    else {
//        factory();
//    }
//})(function() {
//
//})