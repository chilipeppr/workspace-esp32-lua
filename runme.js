// ChiliPeppr Runme.js
// WORKSPACE EDITION

// You should right-click and choose "Run" inside Cloud9 to run this
// Node.js server script. Then choose "Preview" to load the main HTML page
// of the script in a new tab.

// When you run the main HTML page of this script it does all sorts 
// of convenient stuff for you like generate documenation, generate
// your final auto-generated-widget.html file, and push your latest
// changes to your backing github repo.

var http = require('http'),
  url = require('url'),
  path = require('path'),
  fs = require('fs');

var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png", 
  "js": "text/javascript",
  "css": "text/css"
};

http.createServer(function(req, res) {

  var uri = url.parse(req.url).pathname;
  console.log("URL being requested:", uri);
  
  if (uri == "/") {

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    //var html = getMainPage();
    var htmlDocs = generateWidgetDocs();
    
    var notes = "";
    notes += "<p>Click refresh to regenerate README.md, " + fileAutoGeneratePath + ", and push updates to Github.</p>";
    generateWidgetReadme();
    notes += "<p>Generated a new README.md file...</p>";
    generateInlinedFile();
    notes += "<p>Generated a new " + fileAutoGeneratePath + " file...</p>";
    //pushToGithub();
    //pushToGithubSync();
    pushToGithubAsync();
    notes += "<p>Pushed updates to Github...</p>";

    //html = html + htmlDocs;
    var finalHtml = htmlDocs.replace(/<!-- pre-notes -->/, notes);
    
    res.end(finalHtml);

  } 
  else if (uri == "/pushtogithub") {
    
    console.log("/pushtogithub called");
    
    var stdout = pushToGithubSync()
    
    var json = {
      success: true,
      desc: "Pushed to Github",
      log: stdout
    }
    
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(json));
  }    
  else if (uri == "/pullfromgithub") {
    
    console.log("/pullfromgithub called");
    
    var stdout = pullFromGithubSync();
    
    var json = {
      success: true,
      desc: "Pulled from Github",
      log: stdout
    }
    
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(json));
    
  }    
  else if (uri == "/mergeFromCpTemplateRepo") {
    
    console.log("/mergeFromCpTemplateRepo called");
    
    var stdout = mergeFromCpTemplateRepo();
    
    var json = {
      success: true,
      desc: "Merged the latest ChiliPeppr Template to this repo. Please check for merge conflicts. You can run \"git status\" for a summary of conflicts, if any.",
      log: stdout
    }
    
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(json));
    
  } else {

    var filename = path.join(process.cwd(), unescape(uri));
    var stats;
  
    try {
      stats = fs.lstatSync(filename); // throws if path doesn't exist
    }
    catch (e) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.write('404 Not Found\n');
      res.end();
      return;
    }
  
    if (stats.isFile()) {
      // path exists, is a file
      var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
      res.writeHead(200, {
        'Content-Type': mimeType
      });
  
      var fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);
    }
    else if (stats.isDirectory()) {
      // path exists, is a directory
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.write('Index of ' + uri + '\n');
      res.write('TODO, show index?\n');
      res.end();
    }
    else {
      // Symbolic link, other?
      // TODO: follow symlinks?  security?
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.write('500 Internal server error\n');
      res.end();
    }
    
  }

}).listen(process.env.PORT);

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

var fileAutoGeneratePath = "auto-generated-workspace.html"
var fileJsPath = "workspace.js"
var fileCssPath = "workspace.css"
var fileHtmlPath = "workspace.html"

var widgetUrl = 'http://' +
    process.env.C9_PROJECT + '-' + process.env.C9_USER +
    '.c9users.io/workspace.html';
var testUrl = 'https://preview.c9users.io/' +
    process.env.C9_USER + '/' +
    process.env.C9_PROJECT + '/' + fileHtmlPath;
var testUrlNoSsl = 'http://' + process.env.C9_PROJECT +
    '-' + process.env.C9_USER + '.c9users.io/' + fileHtmlPath;
var editUrl = 'http://ide.c9.io/' +
    process.env.C9_USER + '/' +
    process.env.C9_PROJECT;
var github;

var widgetSrc, widget, id, deps, cpdefine, requirejs, cprequire_test;
var widgetDocs = {};

var init = function() {
    github = getGithubUrl();
}

var isEvaled = false;
var evalWidgetJs = function() {
  
  if (isEvaled) return;
  
  // This method reads in your widget.js and evals it to
  // figure out all the info from it to generate docs and sample
  // code to make your life easy
  widgetSrc = fs.readFileSync(fileJsPath)+'';
  
  // fill in some auto fill stuff
  /*
  var widgetUrl = 'http://' +
    process.env.C9_PROJECT + '-' + process.env.C9_USER +
    '.c9users.io/widget.html';
  var editUrl = 'http://ide.c9.io/' +
    process.env.C9_USER + '/' +
    process.env.C9_PROJECT;
  var github = getGithubUrl();
  */

  var reUrl = /(url\s*:\s*['"]?)\(auto fill by runme\.js\)/;
  //console.log("reUrl:", reUrl);
  widgetSrc = widgetSrc.replace(reUrl, "$1" + github.rawurl);
  widgetSrc = widgetSrc.replace(/(fiddleurl\s*:\s*['"]?)\(auto fill by runme\.js\)/, "$1" + editUrl);
  widgetSrc = widgetSrc.replace(/(githuburl\s*:\s*['"]?)\(auto fill by runme\.js\)/, "$1" + github.url);
  widgetSrc = widgetSrc.replace(/(testurl\s*:\s*['"]?)\(auto fill by runme\.js\)/, "$1" + widgetUrl);
  
  // rewrite the javascript
  //fs.writeFileSync(fileJsPath, widgetSrc);
  
  console.log("before we eval here is the src:", widgetSrc);
  eval(widgetSrc);
  //console.log("evaled the widget.js");
  //isEvaled = true;
  
  // generate docs
  for (var key in widget) {
    
    var obj = widget[key];
    widgetDocs[key] = {
      type: typeof obj,
      property: false,
      method: false,
      descSrc: "",
      descHtml: "",
      descMd: "", // markdown
    };
    var objDoc = widgetDocs[key];
    
    if (typeof obj === 'function') {

      // grab first line of source code
      var srcFirstLine = obj.toString().substring(0, obj.toString().indexOf("\n"));
      // drop {
      srcFirstLine = srcFirstLine.replace(/\{/, "");
      //srcFirstLine = srcFirstLine.replace(/function\s*\(\s*\)\s*\{/, "");
      objDoc.descHtml = srcFirstLine; // + "<br><br>";
      objDoc.descMd = srcFirstLine; // + "\n\n";
      
      // we have the source code for the function, so go find it, but then
      // look at the comments above it
      //var indx = widgetSrc.indexOf(obj.toString());
      var indx = widgetSrc.regexIndexOf(new RegExp(key + "\\s*?:\\s*?function"));
      if (indx > 0) {
        
        //s += "found index " + indx;  
        
        // extract docs from above this method
        var docItem = extractDocs(indx);
        if (docItem.html.length > 0) {
          if (objDoc.descHtml.length > 0) objDoc.descHtml += '<br><br>';
          objDoc.descHtml += docItem.html;
        }
        if (docItem.md.length > 0) {
          if (objDoc.descMd.length > 0) objDoc.descMd += '\n\n';
          objDoc.descMd += docItem.md;
        }
        objDoc.descSrc += docItem.src;
      }
      
    } else if (typeof obj === 'string') {
      objDoc.descSrc = JSON.stringify(obj);
      
      // if there's a default value then put it in docs
      if (obj.length > 0) {
        //objDoc.descHtml += "Default value: " + JSON.stringify(obj);
        objDoc.descHtml += JSON.stringify(obj);
        objDoc.descMd += JSON.stringify(obj);
      }
      
      // see if any docs in src code
      var indx = widgetSrc.regexIndexOf(new RegExp(key + "\\s*?:"));
      if (indx > 0) {
        
        // extract docs from above this method
        var docItem = extractDocs(indx);
        if (docItem.html.length > 0) {
          if (objDoc.descHtml.length > 0) objDoc.descHtml += '<br><br>';
          objDoc.descHtml += docItem.html;
        }
        if (docItem.md.length > 0) {
          if (objDoc.descMd.length > 0) objDoc.descMd += '\n\n';
          objDoc.descMd += docItem.md;
        }
        objDoc.descSrc += docItem.src;
      }

      
    } else {
      objDoc.descSrc = JSON.stringify(obj, null, "  ");
      
      if (key.match(/publish|subscribe|foreignPublish|foreignSubscribe/)) {
        objDoc.descHtml += "Please see docs above.";
      } 
      
      // look for description above or at end of line of source code

      var indx = widgetSrc.regexIndexOf(new RegExp(key + "\\s*?:"));
      if (indx > 0) {
        
        // extract docs from above this method
        var docItem = extractDocs(indx);
        if (docItem.html.length > 0) {
          if (objDoc.descHtml.length > 0) objDoc.descHtml += '<br><br>';
          objDoc.descHtml += docItem.html;
        }
        if (docItem.md.length > 0) {
          if (objDoc.descMd.length > 0) objDoc.descMd += '\n\n';
          objDoc.descMd += docItem.md;
        }
        objDoc.descSrc += docItem.src;
      }

    }

  }
}

// We are passed in an indx which is where we start in the overall
// widgetSrc. We look backwards, i.e. line/lines above for comments
var extractDocs = function(indx) {
  
  var o = {
    html: "", // html docs
    src: "",  // src docs
    md: ""    // markdown docs
  }
  
  // if there is a */ up to this indx we've got a comment
  // reverse string to search backwards
  var partial = widgetSrc.substring(0, indx);
  var widgetSrcRev = reverseStr(partial);
  //console.log("candidate for " + key + ":", widgetSrcRev.substring(0, 100));
  
  // if the next item in rev str is /* then we have a comment
  if (widgetSrcRev.match(/^[\s\r\n]+\/\*/)) {
    
    // search to **/ which is /**
    var indx2 = widgetSrcRev.indexOf("**/");
    var comment = widgetSrcRev.substring(0, indx2);
    comment = reverseStr(comment);
    //console.log("comment for " + key + ":", comment);
    o.src = comment;
    
    // cleanup
    comment = comment.replace(/[\r\n\s\*\/]+$/, ""); // cleanup end
    var lines = comment.split(/\r?\n/);
    var newlines = [];
    for (var ctr in lines) {
      var line = lines[ctr];
      line = line.replace(/^[\s\*]+/g, "");
      newlines.push(line);
    }
    comment = newlines.join("\n");
    comment = comment.replace(/^[\s\r\n]/, ""); // cleanup beginning
    
    // convert two newlines to <br><br>
    comment = comment.replace(/\n\n/g, "<br><br>");
    
    // put more space in front of @param
    comment = comment.replace(/\@param\s+?(\S+)\s+?(\S+)\s*?\-?\s*?/g, "<br><br><b>$2</b> ($1) ");
    
    //console.log("clean comment for " + key + " " + comment);
    o.html += comment;
    // make it work for markdown
    o.md += comment.replace("<br><br>", "\n\n").replace(/<b>|<\/b>/g, "");
    
  }
  return o;
}

// create our own version of cpdefine so we can use the evalWidgetJs above
cpdefine = function(myid, mydeps, callback) {
  widget = callback();
  id = myid;
  deps = mydeps;
  //console.log("cool, our own cpdefine got called. id:", id, "deps:", deps);
}
// define other top-level methods just to avoid errors
requirejs = function() {}
requirejs.config = function() {};
cprequire_test = function() {};

var generateWidgetReadme = function() {

  // First we have to eval so stuff is in memory
  evalWidgetJs();
  
  // Spit out Markdown docs
  var md = `# $widget-id
$widget-desc

$widget-img

## ChiliPeppr $widget-name

All ChiliPeppr workspaces/widgets/elements are defined using cpdefine() which is a method
that mimics require.js. Each defined object must have a unique ID so it does
not conflict with other ChiliPeppr objects.

| Item                  | Value           |
| -------------         | ------------- | 
| ID                    | $widget-id |
| Name                  | $widget-name |
| Description           | $widget-desc |
| chilipeppr.load() URL | $widget-cpurl |
| Edit URL              | $widget-editurl |
| Github URL            | $widget-giturl |
| Test URL              | $widget-testurl |

## Example Code for chilipeppr.load() Statement

You can use the code below as a starting point for instantiating this workspace 
from ChiliPeppr's Edit Boot Script dialog box. The key is that you need to load 
your workspace inlined into the standard #pnlWorkspace div so the DOM can parse your HTML, CSS, and 
Javascript. Then you use cprequire() to find your workspace's Javascript and get 
back the instance of it to init() it.

\`\`\`javascript
$widget-cploadjs
\`\`\`

## Publish

This workspace publishes the following signals. These signals are owned by this workspace and are published to 
all objects inside the ChiliPeppr environment that listen to them via the 
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
      $row-publish-start    
      <tr valign="top"><td colspan="2">(No signals defined in this widget/element)</td></tr>
      $row-publish-end    
      </tbody>
  </table>

## Subscribe

This workspace subscribes to the following signals. These signals are owned by this workspace. 
Other objects inside the ChiliPeppr environment can publish to these signals via the chilipeppr.publish(signal, data) method. 
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-sub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      $row-subscribe-start    
      <tr valign="top"><td colspan="2">(No signals defined in this widget/element)</td></tr>
      $row-subscribe-end    
      </tbody>
  </table>

## Foreign Publish

This workspace publishes to the following signals that are owned by other objects. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignpub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      $row-foreign-publish-start    
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>
      $row-foreign-publish-end    
      </tbody>
  </table>

## Foreign Subscribe

This workspace publishes to the following signals that are owned by other objects.
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignsub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      $row-foreign-subscribe-start    
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>
      $row-foreign-subscribe-end    
      </tbody>
  </table>

## Methods / Properties

The table below shows, in order, the methods and properties inside the workspace object.

  <table id="com-chilipeppr-elem-methodsprops" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Method / Property</th>
              <th>Type</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      $row-methods-start
      <tr><td colspan="2">(No methods or properties defined in this widget/element)</td></tr>
      $row-methods-end
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

`

  /*
  var widgetUrl = 'http://' +
    process.env.C9_PROJECT + '-' + process.env.C9_USER +
    '.c9users.io/widget.html';
  var testUrl = 'https://preview.c9users.io/' +
    process.env.C9_USER + '/' +
    process.env.C9_PROJECT + '/widget.html';
  var editUrl = 'http://ide.c9.io/' +
    process.env.C9_USER + '/' +
    process.env.C9_PROJECT;
  var github = getGithubUrl();
  */

  md = md.replace(/\$widget-id/g, widget.id);
  md = md.replace(/\$widget-name/g, widget.name);
  md = md.replace(/\$widget-desc/g, widget.desc);
  md = md.replace(/\$widget-cpurl/g, github.rawurl);
  md = md.replace(/\$widget-editurl/g, editUrl);
  md = md.replace(/\$widget-giturl/g, github.url);
  md = md.replace(/\$widget-testurl/g, testUrl);
  
  var cpload = generateCpLoadStmt();
  md = md.replace(/\$widget-cploadjs/g, cpload);

  // see if there is a screenshot, if so use it
  var img = "";
  if (fs.existsSync("screenshot.png")) {
    img = "![alt text]" + 
    "(screenshot.png \"Screenshot\")";
  }
  md = md.replace(/\$widget-img/g, img);

  /*
  // now generate methods/properties
  //$widget-methprops
  var s = "";
  for (var key in widget) {
    var obj = widget[key];
    s += '| ' + key +
      ' | ' + typeof obj +
      ' | ';
    s += widgetDocs[key].descHtml.replace(/[\r\n]/g, "");
    s += ' |\n';
  }
  //console.log("adding markdown:", s);
  md = md.replace(/\$widget-methprops/g, s);


  // now do pubsub signals
  var s;
  s = appendKeyValForMarkdown(widget.publish);
  md = md.replace(/\$widget-publish/, s);
  s = appendKeyValForMarkdown(widget.subscribe);
  md = md.replace(/\$widget-subscribe/, s);
  s = appendKeyValForMarkdown(widget.foreignPublish);
  md = md.replace(/\$widget-foreignpublish/, s);
  s = appendKeyValForMarkdown(widget.foreignSubscribe);
  md = md.replace(/\$widget-foreignsubscribe/, s);
  */
  
    // do the properties and methods
  var s = "";
  for (var key in widget) {
    var txt = widgetDocs[key].descHtml + '';
    // get rid of spaces and returns after closing pre tags cuz it messes up github markdown
    txt = txt.replace(/<\/pre>[\s\r\n]*/ig, "</pre>");
    // convert double newlines to <br><br> tags
    txt = txt.replace(/\n\s*\n\s*/g, "<br><br>");

    var obj = widget[key];
    s += '<tr valign="top"><td>' + key +
      '</td><td>' + typeof obj +
      '</td><td>';
    s += txt;
    s += '</td></tr>';
  }
  md = md.replace(/\$row-methods-start[\s\S]+?\$row-methods-end/g, s);

  // now do pubsub signals
  var s;
  s = appendKeyVal(widget.publish);
  md = md.replace(/\$row-publish-start[\s\S]+?\$row-publish-end/, s);
  s = appendKeyVal(widget.subscribe);
  md = md.replace(/\$row-subscribe-start[\s\S]+?\$row-subscribe-end/g, s);
  s = appendKeyVal(widget.foreignPublish);
  md = md.replace(/\$row-foreign-publish-start[\s\S]+?\$row-foreign-publish-end/, s);
  s = appendKeyVal(widget.foreignSubscribe);
  md = md.replace(/\$row-foreign-subscribe-start[\s\S]+?\$row-foreign-subscribe-end/g, s);

  // now write out the auto-gen file
  fs.writeFileSync("README.md", md);
  console.log("Rewrote README.md");
  
}

var appendKeyValForMarkdown = function(data, id) {
  var str = "";
  if (data != null && typeof data === 'object' && Object.keys(data).length > 0) {
        
    //var keys = Object.keys(data);
    for (var key in data) {
      str += '| /' + widget.id + "" + key + ' | ' + data[key].replace(/\n/, "<br>") + ' |';
    }
  } else {
    str = '| (No signals defined in this widget/element) |';
  }
  return str;
}

var generateWidgetDocs = function() {
  
  // First we have to eval so stuff is in memory
  evalWidgetJs();
  
  // Spit out docs
  var html = "";
  
  html += `
    <html>
    <head>
    <title>$pubsub-name</title>

    <!-- ChiliPeppr is based on bootstrap CSS. -->
    <link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <script type="text/javascript" charset="utf-8" src="//code.jquery.com/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="//i2dcui.appspot.com/js/bootstrap/bootstrap_3_1_1.min.js"></script>
    
    <style type='text/css'>
    </style>
    
    <script type='text/javascript'>
      //<![CDATA[
      
      $(function() {
      
      function ajaxPushToGithub() {
        console.log("pushing to github...");
        $('.ajax-results').removeClass('hidden').html("Pushing your changes to Github");
        $.ajax({
          url: "pushtogithub"
        })
        .done(function( data ) {
          if ( console && console.log ) {
            console.log( "Data back from pushtogithub:", data );
            if (data && data.success) {
              // success
              $('.ajax-results').html(data.desc + "<br><br>" + "<pre>" + data.log + "</pre>");
            } else {
              // error 
              $('.ajax-results').html("<pre>ERROR:" + JSON.stringify(data, null, "\t") + "</pre>");
            }
          }
        });
      }
      
      function ajaxPullFromGithub() {
        console.log("pushing to github...");
        $('.ajax-results').removeClass('hidden').html("Pulling your changes from Github");
        $.ajax({
          url: "pullfromgithub"
        })
        .done(function( data ) {
          if ( console && console.log ) {
            console.log( "Data back from pushtogithub:", data );
            if (data && data.success) {
              // success
              $('.ajax-results').html(data.desc + "<br><br>" + "<pre>" + data.log + "</pre>");
            } else {
              // error 
              $('.ajax-results').html("<pre>ERROR:" + JSON.stringify(data, null, "\t") + "</pre>");
            }
          }
        });
      }
      
      function ajaxMergeFromCpTemplateRepo() {
        console.log("ajaxMergeFromCpTemplateRepo to github...");
        $('.ajax-results').removeClass('hidden').html("Merging the latest changes (if any) from the ChiliPeppr Template to your fork");
        $.ajax({
          url: "mergeFromCpTemplateRepo"
        })
        .done(function( data ) {
          if ( console && console.log ) {
            console.log( "Data back from ajaxMergeFromCpTemplateRepo:", data );
            if (data && data.success) {
              // success
              $('.ajax-results').html(data.desc + "<br><br>" + "<pre>" + data.log + "</pre>");
            } else {
              // error 
              $('.ajax-results').html("<pre>ERROR:" + JSON.stringify(data, null, "\t") + "</pre>");
            }
          }
        });
      }
      
      function init() {
        $('.btn-pushtogithub').click(ajaxPushToGithub);
        $('.btn-pullfromgithub').click(ajaxPullFromGithub);
        $('.btn-mergetemplate').click(ajaxMergeFromCpTemplateRepo);
        console.log("Init complete");
      }
      
      init();
      
      });
      
      //]]>
    </script>
    
    </head>
    <body style="padding:20px;">
    
      <!-- pre-notes -->
      
      <button class="btn btn-xs btn-default btn-pushtogithub">Push to Github</button>
      <button class="btn btn-xs btn-default btn-pullfromgithub">Pull from Github</button>
      <button class="btn btn-xs btn-default btn-mergetemplate">Merge the ChiliPeppr Template to this Repo</button>
      <div class="hidden well ajax-results" style="margin-bottom:0;">
        Results
      </div>
      
      <h1 class="page-header" style="margin-top:20px;">$pubsub-id</h1>
      
      <p>$pubsub-desc</p>

      <h2>ChiliPeppr Workspace Docs</h2>

      <p>The content below is auto generated as long as you follow the standard
      template for a ChiliPeppr workspace from 
      <a href="">http://github.com/chilipeppr/workspace-template</a>.</p>
      
      <table class="table table-bordered table-striped">
      <tbody>
          <tr>
              <td>ID</td>
              <td class="pubsub-id">
                  $pubsub-id
              </td>
          </tr>
          <tr>
              <td>Name</td>
              <td class="pubsub-name">
                  $pubsub-name
              </td>
          </tr>
          <tr>
              <td>Description</td>
              <td class="pubsub-desc">
                  $pubsub-desc
              </td>
          </tr>
          <tr>
              <td>chilipeppr.load() URL</td>
              <td class="pubsub-url">
                  <a target="_blank" href="$pubsub-url">$pubsub-url</a>
              </td>
          </tr>
          <tr>
              <td>Edit URL</td>
              <td class="pubsub-fiddleurl">
                  <a target="_blank" href="$pubsub-fiddleurl">$pubsub-fiddleurl</a>
              </td>
          </tr>
          <tr>
              <td>Github URL</td>
              <td class="pubsub-github">
                  <a target="_blank" href="$pubsub-github">$pubsub-github</a>
              </td>
          </tr>
          <tr>
              <td>Test URL</td>
              <td class="pubsub-testurl">
                  <a target="_blank" href="$pubsub-testurl">$pubsub-testurl</a>
              </td>
          </tr>
          <tr>
              <td>Test URL No SSL</td>
              <td class="pubsub-testurlnossl">
                  <a target="_blank" href="$pubsub-testurlnossl">$pubsub-testurlnossl</a>
                  <span style="font-size:9px">(Cloud9 runme.js must be running)</span>
              </td>
          </tr>
      </tbody>
  </table>
  
  <h2>Example Code for chilipeppr.load() Statement</h2>
  <p>You can use the code below as a starting point for instantiating
  this workspace from ChiliPeppr's Edit Boot Script dialog. The key is that
  you need to load your workspace inlined into the #pnlWorkspace div so the DOM can parse
  your HTML, CSS, and Javascript. Then you use cprequire() to find
  your workspace's Javascript and get back the instantiated instance of it.</p>
  
  <pre><code class="language-js" 
  data-lang="js">$cp-load-stmt</code></pre>
  
  <div class="xmodal-body">

  <div class="pubsub-interface hidden">
      <h2>Interface Implementation</h2>
      <p>This widget/element implements an interface specification. Since 
      Javascript does not have the notion of interfaces like the way languages 
      such as Java have native support for interfaces, ChiliPeppr has defined 
      its own loose version of an interface. If this widget/element has 
      implemented an interface, it means it has followed a general standard 
      set of pubsub signals that other widgets/elements should follow as well 
      to make them swappable.</p>
      
  <table id="com-chilipeppr-elem-pubsubviewer-interface" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Interface Implementation</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
          
      </tbody>
  </table>
  </div>
  
  <h2>Publish</h2>
  <p>This widget/element publishes the following signals. These signals are owned by this widget/element and are published to all objects inside the ChiliPeppr environment that listen to them via the chilipeppr.subscribe(signal, callback) method.</p>
  <table id="com-chilipeppr-elem-pubsubviewer-pub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
          
      $row-publish-start    
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>
      $row-publish-end    
      
      </tbody>
  </table>

  <h2>Subscribe</h2>
  <p>This widget/element subscribes to the following signals. These signals are owned by this widget/element. Other objects inside the ChiliPeppr environment can publish to these signals via the chilipeppr.publish(signal, data) method.</p>
  <table id="com-chilipeppr-elem-pubsubviewer-sub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
          
      $row-subscribe-start    
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>
      $row-subscribe-end    
      
      </tbody>
  </table>

  <h2>Foreign Publish</h2>
  <p>This widget/element publishes to the following signals that are owned by other objects.</p>
  <table id="com-chilipeppr-elem-pubsubviewer-foreignpub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
          
      $row-foreign-publish-start    
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>
      $row-foreign-publish-end    
      
      </tbody>
  </table>

  <h2>Foreign Subscribe</h2>
  <p>This widget/element subscribes to the following signals owned by other objects.</p>
  <table id="com-chilipeppr-elem-pubsubviewer-foreignsub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      
      $row-foreign-subscribe-start    
      <tr><td colspan="2">(No signals defined in this widget/element)</td></tr>
      $row-foreign-subscribe-end    
      
      </tbody>
  </table>
  
  <h2>Methods / Properties</h2>
  <p>The list below shows, in order, the methods and properties that exist
  inside this widget/element.</p>
  <table id="com-chilipeppr-elem-pubsubviewer-foreignsub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Method / Property</th>
              <th>Type</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
          
      $row-methods-start
      <tr><td colspan="2">(No methods or properties defined in this widget/element)</td></tr>
      $row-methods-end
      
      </tbody>
  </table>
  
</div>

  <h2>Structure of a Workspace</h2>
  <p>The standard structure of a ChiliPeppr workspace includes making 
  your workspace out of workspace.js, workspace.css, and workspace.html. The final
  workspace has everything inlined into one HTML file. It is important
  to have everything inlined so the chilipeppr.load() method succeeds
  because it only loads a single URL.
  </p>
      
  <p>When this NodeJs page is executed it will combine 
  your workspace.js, workspace.css, and workspace.html files into a monolithic 
  HTML file called auto-generated-workspace.html. You should use this file
  as your final workspace inlined file.</p>
  
  <p>This NodeJs script
  will also push your updated content to your forked repo on Github 
  whenever it is run so that Github is as up-to-date
  as possible. This script simply runs the git-push.sh script as if
  you ran it on your own from the command line.</p>
  
      
  </body>
  </html>
`;

  /*
  var widgetUrl = 'http://' +
    process.env.C9_PROJECT + '-' + process.env.C9_USER +
    '.c9users.io/widget.html';
  var testUrl = 'https://preview.c9users.io/' +
    process.env.C9_USER + '/' +
    process.env.C9_PROJECT + '/widget.html';
  var testUrlNoSsl = 'http://' + process.env.C9_PROJECT +
    '-' + process.env.C9_USER + '.c9users.io/widget.html';
  var editUrl = 'http://ide.c9.io/' +
    process.env.C9_USER + '/' +
    process.env.C9_PROJECT;
  var github = getGithubUrl();
  */
  
  html = html.replace(/\$pubsub-id/g, widget.id);
  html = html.replace(/\$pubsub-name/g, widget.name);
  html = html.replace(/\$pubsub-desc/g, widget.desc);
  html = html.replace(/\$pubsub-url/g, github.rawurl);
  html = html.replace(/\$pubsub-fiddleurl/g, editUrl);
  html = html.replace(/\$pubsub-github/g, github.url);
  html = html.replace(/\$pubsub-testurlnossl/g, testUrlNoSsl);
  html = html.replace(/\$pubsub-testurl/g, testUrl);
  
  var cpload = generateCpLoadStmt();
  html = html.replace(/\$cp-load-stmt/g, cpload);
  
  // do the properties and methods
  var s = "";
  for (var key in widget) {
    var obj = widget[key];
    s += '<tr><td>' + key +
      '</td><td>' + typeof obj +
      '</td><td>';
    s += widgetDocs[key].descHtml;
    s += '</td></tr>';
  }
  html = html.replace(/\$row-methods-start[\s\S]+?\$row-methods-end/g, s);

  // now do pubsub signals
  var s;
  s = appendKeyVal(widget.publish);
  html = html.replace(/\$row-publish-start[\s\S]+?\$row-publish-end/, s);
  s = appendKeyVal(widget.subscribe);
  html = html.replace(/\$row-subscribe-start[\s\S]+?\$row-subscribe-end/g, s);
  s = appendKeyVal(widget.foreignPublish);
  html = html.replace(/\$row-foreign-publish-start[\s\S]+?\$row-foreign-publish-end/, s);
  s = appendKeyVal(widget.foreignSubscribe);
  html = html.replace(/\$row-foreign-subscribe-start[\s\S]+?\$row-foreign-subscribe-end/g, s);
  
  // debug source for widget
  /*
  html = html.replace(
    /\$fullwidget/, 
    widget.toString().replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")
  );
  */

  return html;
}

var reverseStr = function(s) {
  var o = '';
  for (var i = s.length - 1; i >= 0; i--)
    o += s[i];
  return o;
}

var appendKeyVal = function(data, id) {
  var str = "";
  if (data != null && typeof data === 'object' && Object.keys(data).length > 0) {
        
    //var keys = Object.keys(data);
    for (var key in data) {
      
      // clean up the description text
      var txt = data[key] + '';
      // get rid of spaces and returns after closing pre tags cuz it messes up github markdown
      txt = txt.replace(/<\/pre>[\s\r\n]*/ig, "</pre>");
      // convert double newlines to <br><br> tags
      txt = txt.replace(/\n\s*\n\s*/g, "<br><br>");
      
      str += '<tr valign="top"><td>/' + 
        widget.id + "" + 
        key + 
        '</td><td>' +
        txt + 
        '</td></tr>';
    }
  } else {
    str = '<tr><td colspan="2">(No signals defined in this workspace)</td></tr>';
  }
  return str;
}

var generateCpLoadStmt = function() {
  
  // eval the widget.js so we have lots of data on it
  evalWidgetJs();
  
  // see if we have a backing github url
  // if we do, use it for the chilipeppr.load()
  // if not, we'll have to use the preview url from cloud9
  var github = getGithubUrl();
  
  var js = "";
  
  if (github != null) {
    
    var url = github.url;
    
    // since we have a github url, use the raw version
    // wa want something like https://raw.githubusercontent.com/chilipeppr/eagle-brd-import/master/auto-generated-widget.html";
    var rawurl = github.rawurl; //= url.replace(/\/github.com\//i, "/raw.githubusercontent.com/");
    //rawurl += '/master/auto-generated-widget.html';
    
    // create a camel case version of this name. split on dash
    var arr = widget.id.replace(/com-chilipeppr/i, "").split(/-/g);
    // now capitalize the first letter of each word
    for (var i in arr) {
      var s = arr[i];
      s = s.charAt(0).toUpperCase() + s.slice(1)
      arr[i] = s;
    }
    var idCamelCase = arr.join("");
    
    js = '' +
      '// This code should be pasted into the ChiliPeppr Edit Boot Javascript dialog box\n' +
      '// located in the upper right corner of any chilipeppr.com page.\n' +
      '// The ChiliPeppr environment has a standard div called #pnlWorkspace that\n' +
      '// this workspace should be loaded into.\n' +
      'chilipeppr.load(\n' +
      '  "#pnlWorkspace",\n' +
      '  "' + rawurl + '",\n' +
      '  function() {\n' +
      '    // Callback after workspace loaded into #pnlWorkspace\n' +
      '    // Now use require.js to get reference to instantiated workspace\n' +
      '    cprequire(\n' +
      '      ["' + id + '"], // the id you gave your workspace\n' +
      '      function(my' + idCamelCase + ') {\n' +
      '        // Callback that is passed reference to the newly loaded workspace\n' +
      '        console.log("' + widget.name + ' just got loaded.", my' + idCamelCase + ');\n' +
      '        my' + idCamelCase + '.init();\n' +
      '      }\n' +
      '    );\n' +
      '  }\n' +
      ');\n' +
      '';
      
  } else {
    // use preview url from cloud 9.
    // TODO
    js = "No Github backing URL. Not implemented yet.";
  }
  
  return js;
}

var pushToGithub = function() {
  var exec = require('child_process').execFile;
  var cmd = './git-push.sh';

  exec(cmd, null, null, function(error, stdout, stderr) {
    // command output is in stdout
    console.log("stdout:", stdout);
  });
  console.log("Pushed to github");
}

var pushToGithubSync = function() {
  
  var proc = require('child_process');
  
  // git add *
  // git commit -m "Made some changes to ChiliPeppr widget using Cloud9"
  // git push
  var stdout = "";
  stdout += "> git add *\n";
  stdout += '> git commit -m "Made some changes to ChiliPeppr myWorkspace using Cloud9"\n';
  stdout += "> git push\n";
  stdout += proc.execSync('git add *; git commit -m "Made some changes to ChiliPeppr myWorkspace using Cloud9"; git push;', { encoding: 'utf8' });
  console.log("Pushed to github sync. Stdout:", stdout);
  
  return stdout;
}

var pushToGithubAsync = function() {
  var exec = require('child_process').exec;

  exec('git add *', function(error1, stdout1, stderr1) {
    // command output is in stdout
    console.log("stdout:", stdout1, "stderr:", stderr1);
    exec('bash -c "git commit -m \\"Made some changes to ChiliPeppr myWorkspace using Cloud9\\""', function(error2, stdout2, stderr2) {
      // command output is in stdout
      console.log("stdout:", stdout2, "stderr:", stderr2);
      exec('git push', function(error3, stdout3, stderr3) {
        // command output is in stdout
        console.log("stdout:", stdout3, "stderr:", stderr3);
      });
    });
  });
  console.log("Pushed to github");
}

var pullFromGithubSync = function() {
  var proc = require('child_process');
  
  // git add *
  // git commit -m "Made some changes to ChiliPeppr widget using Cloud9"
  // git push
  var stdout = "";
  stdout += "> git pull\n";
  stdout += proc.execSync('git pull', { encoding: 'utf8' });
  console.log("Pulled from github sync. Stdout:", stdout);
  
  return stdout;
}

var mergeFromCpTemplateRepo = function() {
  var proc = require('child_process');
  
  // git add *
  // git commit -m "Made some changes to ChiliPeppr widget using Cloud9"
  // git push
  var stdout = "";
  stdout += pushToGithubSync();
  stdout += "> git checkout master\n";
  stdout += "> git pull https://github.com/chilipeppr/myWorkspace-template.git\n";
  try {
    stdout += proc.execSync('git checkout master; git pull https://github.com/chilipeppr/myWorkspace-template.git', { encoding: 'utf8' });
  } catch (ex) {
    console.log("error on merge:", ex);
    stdout += "Tiny little error on merge.\n";
  }
  console.log("Pulled from github sync. Stdout:", stdout);
  
  return stdout;
}

var forkYourOwnRepo = function() {
  /*
  Go create a from-scratch repo on github called <newrepo>
  Then...
  git clone https://github.com/<username>/<newrepo>.git
  git remote add upstream https://github.com/<username>/<oldrepo>.git
  git pull upstream master
  git push -u origin master
  */
}

var generateInlinedFile = function() {
  // We are developing a widget with 3 main files of css, html, and js
  // but ChiliPeppr really wants one monolithic file so we have to generate
  // it to make things clean when chilipeppr.load() is called with a single
  // URL to this widget. This file should get checked into Github and should
  // be the file that is loaded by ChiliPeppr.
  var fileCss = fs.readFileSync(fileCssPath).toString();
  var fileHtml = fs.readFileSync(fileHtmlPath).toString();
  var fileJs = widgetSrc; // fs.readFileSync("widget.js").toString();

  // auto fill title if they're asking for it
  if (widget) {
    var re = /<title>[\s\r\n]*<!--\(auto-fill by runme\.js-->[\s\r\n]*<\/title>/i;
    if (fileHtml.match(re)) {
    fileHtml = fileHtml.replace(re, "<title>" + widget.name + "</title>");
    console.log("Swapped in title for final HTML page.");
    } else {
      console.log('Went to swap in title, but the auto fill comment not found.');
    }
  } else {
    console.log("Could not auto-fill title of HTML page because widget object not defined.");
  }

  // now inline css
  var re = /<!-- widget.css[\s\S]*?end widget.css -->/i;
  fileHtml = fileHtml.replace(re,
    '<style type=\'text/css\'>\n' +
    fileCss +
    '\n    </style>'
  );

  // now inline javascript
  var re = /<!-- widget.js[\s\S]*?end widget.js -->/i;
  fileHtml = fileHtml.replace(re,
    '<script type=\'text/javascript\'>\n' +
    '    //<![CDATA[\n' +
    fileJs +
    '\n    //]]>\n    </script>'
  );

  // now write out the auto-gen file
  fs.writeFileSync(fileAutoGeneratePath, fileHtml);
  console.log("Updated " + fileAutoGeneratePath );

}

var getMainPage = function() {
  var html = "";

  var widgetUrl = 'http://' +
    process.env.C9_PROJECT + '-' + process.env.C9_USER +
    '.c9users.io/widget.html';
  var editUrl = 'http://ide.c9.io/' +
    process.env.C9_USER + '/' +
    process.env.C9_PROJECT;

  var giturl = getGithubUrl();

  html = '<html><body>' +
    'Your ChiliPeppr Workspace can be tested at ' +
    '<a target="_blank" href="' + widgetUrl + '">' +
    widgetUrl + '</a><br><br>\n\n' +
    'Your ChiliPeppr Workspace can be edited at ' +
    '<a target="_blank" href="' + editUrl + '">' +
    editUrl + '</a><br><br>\n\n' +
    'Your ChiliPeppr Workspace Github Url for forking ' +
    '<a target="_blank" href="' + giturl.url + '">' +
    giturl + '</a><br><br>\n\n' +
    'C9_PROJECT: ' + process.env.C9_PROJECT + '<br>\n' +
    'C9_USER: ' + process.env.C9_USER + '\n' +
    '';

  generateInlinedFile();
  html += '<br><br>Just updated your ' + fileAutoGeneratePath + ' file.';
    
  //pushToGithub();
  //html += '<br><br>Just pushed updates to your Github repo.';
  
  var jsLoad = generateCpLoadStmt();
  html += '<br><br>Sample chilipeppr.load() Javascript for Your Workspace\n<pre>' +
    jsLoad +
    '</pre>\n';
    
  var docs = generateWidgetDocs();
  html += '<br><br>Docs\n<pre>' +
    docs +
    '</pre>\n';
    
  return html;
}

var getGithubUrl = function(callback) {

  // new approach. use the command line from git
  // git config --get remote.origin.url
  
  var childproc = require('child_process');
  var cmd = 'git config --get remote.origin.url';

  var stdout = childproc.execSync(cmd, { encoding: 'utf8' });
  //console.log("Got the following Github URL:", stdout);

  var re = /.*github.com:/i;
  var url = stdout.replace(re, "");
  url = url.replace(/.git[\s\S]*$/i, ""); // remove end
  
  // prepend with clean githut url
  url = "http://github.com/" + url;
  
  var rawurl = url.replace(/\/github.com\//i, "/raw.githubusercontent.com/");
  rawurl += '/master/' + fileAutoGeneratePath;
  
  var ret = {
    url: url,
    rawurl : rawurl
  };
  
  //console.log("ret:", ret);
  return ret;
    
}

init();