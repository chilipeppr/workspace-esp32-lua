/* global cpdefine chilipeppr cprequire */
cprequire_test(["inline:com-chilipeppr-workspace-terminal"], function(termWs) {

    termWs.init();
    
} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-workspace-terminal", ["chilipeppr_ready"], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-workspace-terminal", // Make the id the same as the cpdefine id
        name: "Workspace / Terminal", // The descriptive name of your widget.
        desc: "A terminal session with the host running SPJS. As of version 1.87 of SPJS you can send/receive basic terminal commands to host operating system. This widget is a front-end UI for the terminal from ChiliPeppr.",
        url: "(auto fill by runme.js)", // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)", // The standalone working widget so can view it working by itself
        /**
         * Contains reference to the Terminal widget object.
         */
        widgetTerminal: null,
        /**
         * Contains reference to the Serial Port JSON Server object.
         */
        widgetSpjs: null,
        /**
         * The workspace's init method. It loads the Terminal widget and then the SPJS widget.
         */
        init: function() {
            
            var that = this;

            // Load the terminal widget
            this.loadTerminalWidget(function() {
                
                // now we can load the SPJS widget
                that.loadSpjsWidget(function() {
                    
                    // if we get here, we can init the Terminal Widget
                    that.widgetTerminal.init();
                    that.widgetTerminal.resize();

                })
                
            })
            
        }, 
        /**
         * Load the Terminal widget via chilipeppr.load()
         */
        loadTerminalWidget: function(callback) {
            var that = this;
            chilipeppr.load(
                "#terminalWidget",
                "http://raw.githubusercontent.com/chilipeppr/widget-terminal/master/auto-generated-widget.html",
                function() {
                    // Callback after widget loaded into #myDivWidgetInsertedInto
                    cprequire(
                        ["inline:com-chilipeppr-widget-terminal"], // the id you gave your widget
                        function(mywidget) {
                            // Callback that is passed reference to your newly loaded widget
                            console.log("My widget just got loaded.", mywidget);

                            that.widgetTerminal = mywidget;
                            
                            // load spjs widget so we can test
                            //http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/
                            callback();
                            

                        }
                    );
                }
            );
        },
        /**
         * Load the Serial Port JSON Server widget via chilipeppr.load()
         */
        loadSpjsWidget: function(callback) {
            
            var that = this;
            
            chilipeppr.load(
                "#spjsWidget",
                "http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",
                function() {
                    console.log("mycallback got called after loading spjs module");
                    cprequire(["inline:com-chilipeppr-widget-serialport"], function(spjs) {
                        //console.log("inside require of " + fm.id);
                        spjs.init();
                        spjs.consoleToggle();

                        that.widgetSpjs = spjs;
                        
                        callback();
                        
                    });
                }
            );
        }
    };
});