/* global cpdefine chilipeppr cprequire */
cprequire_test(["inline:com-chilipeppr-workspace-esp32-lua"], function(ws) {

    console.log("initting workspace");
    ws.init();
    ws.loadFlashMsg();
    $('title').html("Console Workspace");
    $('body').css('padding', '10px');

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-workspace-esp32-lua", ["chilipeppr_ready"], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-workspace-esp32-lua", // Make the id the same as the cpdefine id
        name: "Workspace / ESP32 for Lua (NodeMCU)", // The descriptive name of your widget.
        desc: `A ChiliPeppr Workspace that lets you interact with an ESP32 Lua device (NodeMCU for ESP32). \
The device is an ESP32 wifi module with an attached USB serial port bridge \
so you can easily use it and program it from your computer via the serial port. Thus, the esp32 \
works brilliantly with ChiliPeppr. Secondly, \
the esp32 has the Lua language preloaded onto it so you can easily program \
the device.This workspace gives you convenience methods for programming the esp32 device. \
You can buy the esp32 on ebay.com or aliexpress.com.`,
        url: "(auto fill by runme.js)", // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)", // The standalone working widget so can view it working by itself
        /**
         * Contains reference to the Console widget object.
         */
        widgetConsole: null,
        /**
         * Contains reference to the Serial Port JSON Server object.
         */
        widgetSpjs: null,
        /**
         * Contains reference to the Lua Editor widget.
         */
        widgetLuaEditor: null,
        /**
         * The workspace's init method. It loads the Console widget and then the SPJS widget.
         */
        init: function() {

            var that = this;

            $('#' + this.id).removeClass("hidden");

            
            
            // now we can load the SPJS widget
            that.loadSpjsWidget(function() {

                console.log("spjs widget loaded");
                
                // Load the console widget
                that.loadConsoleWidget(function() {
    
                    console.log("console widget loaded, now lets load spjs");
                
                    // if we get here, we can init the Console Widget
                    // (we are now initting the widget immediately)
                    that.widgetConsole.init(true, /chilipeppr heartbeat/);
                    //that.widgetConsole.resize();
    
                    that.setupResize();
                });
                
            });

            this.loadLuaEditor();
            this.loadXbmUploader();

            //this.loadFlashMsg();
            setTimeout(this.loadWorkspaceMenu.bind(this), 100);
            this.setupNodeMcuCommands();

            this.loadFileListWidget();
            // this.loadSampleCodeWidget();
            this.loadDocsWidget();
            
            this.addBillboardToWorkspaceMenu();
            
            this.loadCayennWidget();

        },
        /**
         * Setup all the command buttons to do their thing.
         */
        setupNodeMcuCommands: function() {
            var that = this;
            setTimeout(function() {
                console.log("doing btns");
                $('#' + that.id + ' .nodemcu-commands .btn').each(function(index) {
                    var el = $(this);
                    var dataClick = el.data('click');
                    console.log("btn el:", el, "data-click:", dataClick);
                    if (that[dataClick]) {
                        el.click(that[dataClick].bind(that));
                        console.log("bound to ", that[dataClick]);
                    }
                });

            }, 300);
        },
        onClickReset: function(evt) {
            console.log("got onClickReset. evt:", evt);
            this.send('node.restart()');
        },
        onClickHeap: function(evt) {
            console.log("got onClickHeap. evt:", evt);
            this.send('=node.heap()');
        },
        onClickChipId: function(evt) {
            console.log("got onClickChipId. evt:", evt);
            this.send('=node.chipid()');
        },
        onClickChipInfo: function(evt) {
            console.log("got onClickChipInfo. evt:", evt);
            this.send('=node.info()');
        },
        onClickFlashId: function(evt) {
            console.log("got onClickFlashId. evt:", evt);
            this.send('=node.flashid()');
        },
        onClickFsInfo: function(evt) {
            console.log("got onClickFsInfo. evt:", evt);
            this.send('r,u,t=file.fsinfo()\nprint("Total : " .. t .. " bytes\\r\\nUsed  : " .. u .. " bytes\\r\\nRemain: " .. r .. " bytes\\r\\n")\nr=nil u=nil t=nil');
        },
        onClickListFiles: function(evt) {
            console.log("got onClickListFiles. evt:", evt);
            this.send('l = file.list()\nfor k,v in pairs(l) do\nprint("name:" .. k .. ", size:" .. v)\nend\nl=nil');
        },
        onClickCreateTestFile: function(evt) {
            console.log("got onClickCreateTestFile. evt:", evt);
            this.send(`-- open 'test.lua' in 'a+' mode to append
file.open("test.lua", "a+")
-- write 'foo bar' to the end of the file
file.writeline('print("hello world")')
file.close()`);
        },
        onClickReadTestFile: function(evt) {
            console.log("got onClickReadTestFile. evt:", evt);
            this.send(`-- read 'test.lua' in 'r' mode for read-only
file.open("test.lua", "r")
-- read to the end of the file
txt = file.read()
print(txt)
file.close()
txt = nil`);
        },

        onClickReadInitFile: function(evt) {
            console.log("got onClickReadInitFile. evt:", evt);
            this.send(`-- read 'init.lua' in 'r' mode for read-only
file.open("init.lua", "r")
-- read to the end of the file
txt = file.read()
print(txt)
file.close()
txt = nil`);
        },
        onClickCreateInitFile: function(evt) {
            console.log("got onClickCreateInitFile. evt:", evt);
            this.send(`-- open 'init.lua' in 'w' mode to overwrite anything
file.open("init.lua", "w")
-- write a print statement to the auto-start init.lua file
file.writeline('print("Just ran auto-start init.lua. Put your own code here.")')
file.close()
-- do node.restart() to see init.lua run`);
        },

        onClickFormat: function(evt) {
            console.log("got onClickFormat. evt:", evt);
            this.send(`-- please wait after this runs as it takes about a minute
file.format()`);
        },
        onClickBlink: function(evt) {
            console.log("got onClickBlink. evt:", evt);
            this.send(`-- Blink built-in LED on Wemos
m = {}

-- Config
m.pin = 2 -- 2 on DOIT, 16 on Wemos
m.value = 0
m.duration = 500
m.ctr = 0

function m.toggleLED ()
  if m.value == 0 then
    m.value = 1
  else
    m.value = 0
  end
  
  gpio.write(m.pin, m.value)
  
  -- m.ctr = m.ctr + 1
  -- if m.ctr > 10 then
  --   m.mytimer:unregister()
  -- end
end
-- Initialise the pin
gpio.config( { gpio={m.pin}, dir=gpio.OUT } )
-- tmr.alarm(0, duration, 1, toggleLED)
m.mytimer = tmr.create()
m.mytimer:alarm(m.duration, tmr.ALARM_AUTO, m.toggleLED)`);
        },
        onClickReadVdd33: function(evt) {
            console.log("got onClickReadVdd33. evt:", evt);
            this.send(`v = adc.readvdd33() / 1000
print(v)
v=nil`);
        },
        onClickListAps: function(evt) {
            console.log("got onClickListAps. evt:", evt);
            this.send(`--register callback
wifi.sta.on("got_ip", function(ev, info)
  print("NodeMCU IP config:", info.ip, "netmask", info.netmask, "gw", info.gw)
end)

-- set as station
wifi.mode(1)
-- start wifi
wifi.start()

-- Scan and print all found APs, including hidden ones
wifi.sta.scan({ hidden = 1 }, function(err,arr)
  if err then
    print ("Scan failed:", err)
  else
    print(string.format("%-26s","SSID"),"Channel BSSID              RSSI Auth Bandwidth")
    for i,ap in ipairs(arr) do
      print(string.format("%-32s",ap.ssid),ap.channel,ap.bssid,ap.rssi,ap.auth,ap.bandwidth)
    end
    print("-- Total APs: ", #arr)
  end
end)`);
        },

        sendCtr: 0,
        /**
         * Send the script off to the serial port.
         */
        send: function(txt) {
            var cmds = txt.split(/\n/g);
            var ctr = 0;
            var that = this;

            for (var indx in cmds) {
                //setTimeout(function() {

                var cmd = cmds[ctr];

                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {
                    D: cmd + '\n',
                    Id: "nodemcu-" + that.sendCtr++
                });

                ctr++;

                //}, 10 * indx);
            }
        },
        /**
         * Returns the billboard HTML, CSS, and Javascript for this Workspace. The billboard
         * is used by the home page, the workspace picker, and the fork pulldown to show a
         * consistent name/image/description tag for the workspace throughout the ChiliPeppr ecosystem.
         */
        getBillboard: function() {
            var el = $('#' + this.id + '-billboard').clone();
            el.removeClass("hidden");
            el.find('.billboard-desc').text(this.desc);
            return el;
        },
        addBillboardToWorkspaceMenu: function() {
            // get copy of billboard
            var billboardEl = this.getBillboard();
            $('#' + this.id + ' .com-chilipeppr-ws-billboard').append(billboardEl);
        },
        /**
         * Listen to window resize event.
         */
        setupResize: function() {
            $(window).on('resize', this.onResize.bind(this));
        },
        /**
         * When browser window resizes, forcibly resize the Console window
         */
        onResize: function() {
            if (this.widgetConsole) this.widgetConsole.resize();
            if (this.widgetLuaEditor) this.widgetLuaEditor.resize();
        },
        /**
         * Load the Console widget via chilipeppr.load()
         */
        loadConsoleWidget: function(callback) {
            var that = this;
            chilipeppr.load(
                "#consoleWidget",
                // "http://fiddle.jshell.net/chilipeppr/rczajbx0/show/light/",
                "http://raw.githubusercontent.com/chilipeppr/widget-console/master/auto-generated-widget.html",
                // "http://widget-console-chilipeppr.c9users.io/widget.html",
                function() {
                    // Callback after widget loaded into #myDivWidgetInsertedInto
                    cprequire(
                        ["inline:com-chilipeppr-widget-spconsole"], // the id you gave your widget
                        function(mywidget) {
                            // Callback that is passed reference to your newly loaded widget
                            console.log("My widget just got loaded.", mywidget);

                            that.widgetConsole = mywidget;
                            // that.widgetConsole.init(true, /^{/);
                            
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
                //"http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",
                "http://raw.githubusercontent.com/chilipeppr/widget-spjs/master/auto-generated-widget.html",
                function() {
                    console.log("mycallback got called after loading spjs module");
                    cprequire(["inline:com-chilipeppr-widget-serialport"], function(spjs) {
                        //console.log("inside require of " + fm.id);
                        spjs.setSingleSelectMode();
                        //spjs.init(null, "timed", 9600);
                        spjs.init({
                            isSingleSelectMode: true,
                            defaultBuffer: "nodemcu",
                            defaultBaud: 115200, //9600,
                            bufferEncouragementMsg: 'For your NodeMCU device please choose the "nodemcu" buffer in the pulldown and a 115,200 baud rate before connecting.'
                        });
                        //spjs.showBody();
                        //spjs.consoleToggle();

                        that.widgetSpjs = spjs;

                        callback();

                    });
                }
            );
        },
        /**
         * Load Flash Module so we can show flash messages.
         */
        loadFlashMsg: function() {
            chilipeppr.load("#com-chilipeppr-widget-flash-instance",
                "http://raw.githubusercontent.com/chilipeppr/element-flash/master/auto-generated-widget.html",
                // "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
                function() {
                    console.log("mycallback got called after loading flash msg module");
                    cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                        //console.log("inside require of " + fm.id);
                        fm.init();
                    });
                }
            );
        },
        /**
         * Load the workspace menu.
         */
        loadWorkspaceMenu: function() {
            // Workspace Menu with Workspace Billboard
            var that = this;
            chilipeppr.load(
                "http://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html",
                // "http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/",
                function() {
                    require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {

                        var el = $('#' + that.id + ' .com-chilipeppr-ws-menu .dropdown-menu-ws');
                        console.log("got callback for attachto menu for workspace for nodemcu.. attaching to el:", el);

                        pubsubviewer.attachTo(
                            el,
                            that,
                            "Workspace"
                        );
                    });
                }
            );
        },
        loadXbmUploader: function() {
        
            chilipeppr.load(
              "#com-chilipeppr-widget-xbm-instance",
              "http://raw.githubusercontent.com/chilipeppr/widget-xbm/master/auto-generated-widget.html",
              function() {
                // Callback after widget loaded into #myDivWidgetXbm
                // Now use require.js to get reference to instantiated widget
                cprequire(
                  ["inline:com-chilipeppr-widget-xbm"], // the id you gave your widget
                  function(myObjWidgetXbm) {
                    // Callback that is passed reference to the newly loaded widget
                    console.log("Widget / XBM just got loaded.", myObjWidgetXbm);
                    myObjWidgetXbm.init();
                  }
                );
              }
            );    
        },
        /**
         * Load the widget for the Lua Editor which is based on the Macro widget from
         * the TinyG workspace.
         */
        loadLuaEditor: function() {
            // #com-chilipeppr-widget-luaeditor-instance
            var that = this;
            chilipeppr.load(
                "#com-chilipeppr-widget-luaeditor-instance",
                "http://raw.githubusercontent.com/chilipeppr/widget-luaeditor/master/auto-generated-widget.html",
                function() {
                    require(['inline:com-chilipeppr-widget-luaeditor'], function(luaeditor) {
                        that.widgetLuaEditor = luaeditor;
                        luaeditor.init();
                        luaeditor.resize();
                    });
                }
            );
        },
        /**
         * Load Sample Code Widget
         */
        loadSampleCodeWidget: function() {
            chilipeppr.load(
                "#nodemcu-sample-code",
                "http://raw.githubusercontent.com/chilipeppr/widget-nodemcusamples/master/auto-generated-widget.html",
                function() {
                    // Callback after widget loaded into #myDivWidgetNodemcusamples
                    // Now use require.js to get reference to instantiated widget
                    cprequire(
                        ["inline:com-chilipeppr-widget-nodemcusamples"], // the id you gave your widget
                        function(myObjWidgetNodemcusamples) {
                            // Callback that is passed reference to the newly loaded widget
                            console.log("Widget / NodeMCU Samples just got loaded.", myObjWidgetNodemcusamples);
                            myObjWidgetNodemcusamples.init();
                        }
                    );
                }
            );
        },
        /**
         * Load Files Widget
         */
        loadFileListWidget: function() {
            chilipeppr.load(
                "#nodemcu-filelist-instance",
                "http://raw.githubusercontent.com/chilipeppr/widget-nodemcu-files/master/auto-generated-widget.html",
                function() {
                    // Callback after widget loaded into #myDivWidgetNodemcusamples
                    // Now use require.js to get reference to instantiated widget
                    cprequire(
                        ["inline:com-chilipeppr-widget-nodemcu-files"], // the id you gave your widget
                        function(myObjWidgetNodemcuFiles) {
                            // Callback that is passed reference to the newly loaded widget
                            console.log("Widget / NodeMCU File List just got loaded.", myObjWidgetNodemcuFiles);
                            myObjWidgetNodemcuFiles.init();
                        }
                    );
                }
            );
        },
        /**
         * Load Firmware/Docs widget
         */
        loadDocsWidget: function() {
            chilipeppr.load(
              "#com-chilipeppr-widget-nodemcu-docs-instance",
              "http://raw.githubusercontent.com/chilipeppr/widget-esp32-docs/master/auto-generated-widget.html",
              function() {
                // Callback after widget loaded into #myDivWidgetEsp32Docs
                // Now use require.js to get reference to instantiated widget
                cprequire(
                  ["inline:com-chilipeppr-widget-esp32-docs"], // the id you gave your widget
                  function(myObjWidgetEsp32Docs) {
                    // Callback that is passed reference to the newly loaded widget
                    console.log("Widget / NodeMCU Docs & Install just got loaded.", myObjWidgetEsp32Docs);
                    myObjWidgetEsp32Docs.init();
                  }
                );
              }
            );
            
            // chilipeppr.load(
            //     "#com-chilipeppr-widget-nodemcu-docs-instance",
            //     "http://raw.githubusercontent.com/chilipeppr/widget-nodemcu-docs/master/auto-generated-widget.html",
            //     function() {
            //         // Callback after widget loaded into #myDivWidgetNodemcusamples
            //         // Now use require.js to get reference to instantiated widget
            //         cprequire(
            //             ["inline:com-chilipeppr-widget-nodemcu-docs"], // the id you gave your widget
            //             function(myObjWidgetNodemcuDocs) {
            //                 // Callback that is passed reference to the newly loaded widget
            //                 console.log("Widget / NodeMCU Docs & Install just got loaded.", myObjWidgetNodemcuDocs);
            //                 myObjWidgetNodemcuDocs.init();
            //               }
            //         );
            //     }
            // );
        },
        loadCayennWidget: function() {
            
            // Cayenn Widget
            chilipeppr.load(
              "#com-chilipeppr-widget-cayenn-instance",
              "http://raw.githubusercontent.com/chilipeppr/widget-cayenn/master/auto-generated-widget.html",
              function() {
                // Callback after widget loaded into #myDivWidgetCayenn
                // Now use require.js to get reference to instantiated widget
                cprequire(
                  ["inline:com-chilipeppr-widget-cayenn"], // the id you gave your widget
                  function(myObjWidgetCayenn) {
                    // Callback that is passed reference to the newly loaded widget
                    console.log("Widget / Cayenn just got loaded.", myObjWidgetCayenn);
                    
                    var options = {
                        enableEsp32Script: true // turns on button to let user send starter script to editor for esp32
                    }

                    // Ask for esp32 script button to be turned on
                    myObjWidgetCayenn.init(options);
                    
                    // this widget has a lot of modals that pop up whenever, so we need to make sure the parent div is
                    // not hidden. instead we'll hide the exact widget because the modals are outside the div of the widget
                    $('#com-chilipeppr-ws-cayenn').removeClass("hidden");
                    
                    /*
                    var btn = $('#com-chilipeppr-ws-menu .cayenn-button');
                    var div = $('#com-chilipeppr-widget-cayenn');
                    div.addClass("hidden");
                    btn.click(function() {
                        if (div.hasClass("hidden")) {
                            // show widget
                            div.removeClass("hidden");
                            btn.addClass("active");
                        } else {
                            // hide widget
                            div.addClass("hidden");
                            btn.removeClass("active");
                        }
                        setTimeout(function() {
                            $(window).trigger('resize');
                        }, 200);
                    });
                    */
                    
                  }
                );
              }
            );

        }
    }

});