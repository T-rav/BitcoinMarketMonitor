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
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification",
        "clobbers": [
            "plugin.notification.local"
        ]
    },
    {
        "file": "plugins/com.google.cordova.admob/www/AdMob.js",
        "id": "com.google.cordova.admob.AdMob",
        "clobbers": [
            "window.AdMob"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.borismus.webintent": "1.0.0",
    "me.apla.cordova.app-preferences": "0.4.2",
    "de.appplant.cordova.plugin.local-notification": "0.7.4",
    "com.google.cordova.admob": "1.1.1",
    "org.apache.cordova.device": "0.2.13-dev"
}
// BOTTOM OF METADATA
});