cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.borismus.webintent/www/webintent.js",
        "id": "com.borismus.webintent.WebIntent",
        "clobbers": [
            "WebIntent"
        ]
    },
    {
        "file": "plugins/me.apla.cordova.app-preferences/www/apppreferences.js",
        "id": "me.apla.cordova.app-preferences.apppreferences",
        "clobbers": [
            "plugins.appPreferences"
        ]
    },
    {
        "file": "plugins/com.msopentech.indexedDB/www/IndexedDBShim.min.js",
        "id": "com.msopentech.indexedDB.IndexedDBShim",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.borismus.webintent": "1.0.0",
    "me.apla.cordova.app-preferences": "0.4.2",
    "com.msopentech.indexedDB": "0.1.1"
}
// BOTTOM OF METADATA
});