// Test this element. This code is auto-removed by the chilipeppr.load()
cprequire_test(["inline:com-chilipeppr-ws-billboard-tinyg"], function (bbtinyg) {
    console.log("test running of " + bbtinyg.id);
    bbtinyg.init();

} /*end_test*/ );

cpdefine("inline:com-chilipeppr-ws-billboard-tinyg", ["chilipeppr_ready"], function () {
    return {
        id: "com-chilipeppr-ws-billboard-tinyg",
        url: "http://fiddle.jshell.net/chilipeppr/Guvv4/show/light",
        fiddleurl: "http://fiddle.jshell.net/chilipeppr/Guvv4/",
        name: "Element / Billboard / TinyG Workspace",
        desc: "This is the billboard for TinyG Workspace.",
        init: function() {
            console.log("TinyG billboard initted, but really there is nothing to init on a billboard.");
        }
    }
});
