# com-chilipeppr-workspace-nodemcu
A ChiliPeppr Workspace that lets you interact with the NodeMCU device. The NodeMCU device is an ESP8266 wifi module with an attached USB serial port bridge like the way Arduinos have an USB FTDI adapter connected to a micro-controller. Secondly, the NodeMCU has the Lua language preloaded onto the ESP8266 so you can easily program the device.This workspace gives you convenience methods for programming the NodeMCU device. 

![alt text](screenshot.png "Screenshot")

## ChiliPeppr Workspace / NodeMCU

All ChiliPeppr widgets/elements are defined using cpdefine() which is a method
that mimics require.js. Each defined object must have a unique ID so it does
not conflict with other ChiliPeppr widgets.

| Item                  | Value           |
| -------------         | ------------- | 
| ID                    | com-chilipeppr-workspace-nodemcu |
| Name                  | Workspace / NodeMCU |
| Description           | A ChiliPeppr Workspace that lets you interact with the NodeMCU device. The NodeMCU device is an ESP8266 wifi module with an attached USB serial port bridge like the way Arduinos have an USB FTDI adapter connected to a micro-controller. Secondly, the NodeMCU has the Lua language preloaded onto the ESP8266 so you can easily program the device.This workspace gives you convenience methods for programming the NodeMCU device.  |
| chilipeppr.load() URL | http://raw.githubusercontent.com/chilipeppr/workspace-nodemcu/master/auto-generated-workspace.html |
| Edit URL              | http://ide.c9.io/chilipeppr/workspace-nodemcu |
| Github URL            | http://github.com/chilipeppr/workspace-nodemcu |
| Test URL              | https://preview.c9users.io/chilipeppr/workspace-nodemcu/workspace.html |

## Example Code for chilipeppr.load() Statement

You can use the code below as a starting point for instantiating this widget 
inside a workspace or from another widget. The key is that you need to load 
your widget inlined into a div so the DOM can parse your HTML, CSS, and 
Javascript. Then you use cprequire() to find your widget's Javascript and get 
back the instance of it.

```javascript
// Inject new div to contain widget or use an existing div with an ID
$("body").append('<' + 'div id="myDivWorkspaceNodemcu"><' + '/div>');

chilipeppr.load(
  "#myDivWorkspaceNodemcu",
  "http://raw.githubusercontent.com/chilipeppr/workspace-nodemcu/master/auto-generated-workspace.html",
  function() {
    // Callback after widget loaded into #myDivWorkspaceNodemcu
    // Now use require.js to get reference to instantiated widget
    cprequire(
      ["inline:com-chilipeppr-workspace-nodemcu"], // the id you gave your widget
      function(myObjWorkspaceNodemcu) {
        // Callback that is passed reference to the newly loaded widget
        console.log("Workspace / NodeMCU just got loaded.", myObjWorkspaceNodemcu);
        myObjWorkspaceNodemcu.init();
      }
    );
  }
);

```

## Publish

This widget/element publishes the following signals. These signals are owned by this widget/element and are published to all objects inside the ChiliPeppr environment that listen to them via the 
chilipeppr.subscribe(signal, callback) method. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-pub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>    
      </tbody>
  </table>

## Subscribe

This widget/element subscribes to the following signals. These signals are owned by this widget/element. Other objects inside the ChiliPeppr environment can publish to these signals via the chilipeppr.publish(signal, data) method. 
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-sub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>    
      </tbody>
  </table>

## Foreign Publish

This widget/element publishes to the following signals that are owned by other objects. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignpub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>    
      </tbody>
  </table>

## Foreign Subscribe

This widget/element publishes to the following signals that are owned by other objects.
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignsub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>    
      </tbody>
  </table>

## Methods / Properties

The table below shows, in order, the methods and properties inside the widget/element.

  <table id="com-chilipeppr-elem-methodsprops" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Method / Property</th>
              <th>Type</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>id</td><td>string</td><td>"com-chilipeppr-workspace-nodemcu"<br><br>The ID of the widget. You must define this and make it unique.</td></tr><tr valign="top"><td>name</td><td>string</td><td>"Workspace / NodeMCU"</td></tr><tr valign="top"><td>desc</td><td>string</td><td>"A ChiliPeppr Workspace that lets you interact with the NodeMCU device. The NodeMCU device is an ESP8266 wifi module with an attached USB serial port bridge like the way Arduinos have an USB FTDI adapter connected to a micro-controller. Secondly, the NodeMCU has the Lua language preloaded onto the ESP8266 so you can easily program the device.This workspace gives you convenience methods for programming the NodeMCU device. "</td></tr><tr valign="top"><td>url</td><td>string</td><td>"http://raw.githubusercontent.com/chilipeppr/workspace-nodemcu/master/auto-generated-workspace.html"</td></tr><tr valign="top"><td>fiddleurl</td><td>string</td><td>"http://ide.c9.io/chilipeppr/workspace-nodemcu"</td></tr><tr valign="top"><td>githuburl</td><td>string</td><td>"http://github.com/chilipeppr/workspace-nodemcu"</td></tr><tr valign="top"><td>testurl</td><td>string</td><td>"http://workspace-nodemcu-chilipeppr.c9users.io/widget.html"</td></tr><tr valign="top"><td>widgetTerminal</td><td>object</td><td>Contains reference to the Terminal widget object.</td></tr><tr valign="top"><td>widgetSpjs</td><td>object</td><td>Contains reference to the Serial Port JSON Server object.</td></tr><tr valign="top"><td>init</td><td>function</td><td>function () <br><br>The workspace's init method. It loads the Terminal widget and then the SPJS widget.</td></tr><tr valign="top"><td>billboard</td><td>function</td><td>function () <br><br>Returns the billboard HTML, CSS, and Javascript for this Workspace. The billboard
is used by the home page, the workspace picker, and the fork pulldown to show a
consistent name/image/description tag for the workspace throughout the ChiliPeppr ecosystem.</td></tr><tr valign="top"><td>setupResize</td><td>function</td><td>function () <br><br>Listen to window resize event.</td></tr><tr valign="top"><td>onResize</td><td>function</td><td>function () <br><br>When browser window resizes, forcibly resize the Terminal window</td></tr><tr valign="top"><td>loadConsoleWidget</td><td>function</td><td>function (callback) <br><br>Load the Terminal widget via chilipeppr.load()</td></tr><tr valign="top"><td>loadSpjsWidget</td><td>function</td><td>function (callback) <br><br>Load the Serial Port JSON Server widget via chilipeppr.load()</td></tr>
      </tbody>
  </table>


## About ChiliPeppr

[ChiliPeppr](http://chilipeppr.com) is a hardware fiddle, meaning it is a 
website that lets you easily
create a workspace to fiddle with your hardware from software. ChiliPeppr provides
a [Serial Port JSON Server](https://github.com/johnlauer/serial-port-json-server) 
that you run locally on your computer, or remotely on another computer, to connect to 
the serial port of your hardware like an Arduino or other microcontroller.

You then create a workspace at ChiliPeppr.com that connects to your hardware 
by starting from scratch or forking somebody else's
workspace that is close to what you are after. Then you write widgets in
Javascript that interact with your hardware by forking the base template 
widget or forking another widget that
is similar to what you are trying to build.

ChiliPeppr is massively capable such that the workspaces for 
[TinyG](http://chilipeppr.com/tinyg) and [Grbl](http://chilipeppr.com/grbl) CNC 
controllers have become full-fledged CNC machine management software used by
tens of thousands.

ChiliPeppr has inspired many people in the hardware/software world to use the
browser and Javascript as the foundation for interacting with hardware. The
Arduino team in Italy caught wind of ChiliPeppr and now
ChiliPeppr's Serial Port JSON Server is the basis for the 
[Arduino's new web IDE](https://create.arduino.cc/). If the Arduino team is excited about building on top
of ChiliPeppr, what
will you build on top of it?

