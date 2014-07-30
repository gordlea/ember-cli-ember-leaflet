var path = require('path');
var fs = require('fs');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

function EmberCLIEmberLeaflet(project) {
  this.project = project;
  this.name = 'Ember-leaflet for Ember CLI';
}

EmberCLIEmberLeaflet.prototype.treeFor = function treeFor(name) {
  var treePath =  path.join('node_modules', 'ember-cli-ember-leaflet', name);
  
  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberCLIEmberLeaflet.prototype.included = function included(app) {
  var data = fs.readFileSync('node_modules/ember-cli-ember-leaflet/vendor/ember-leaflet/dist/ember-leaflet.js', {encoding: 'utf8'});

  var replacedDefine = data.replace(/@module ember-leaflet/g,
    '@module ember-leaflet\n' +
    '*/\n' +
    '    define("ember-leaflet", [], function() {\n' +
    '        var ret = new Array ();\n' +
    '        ret["default"] = EmberLeaflet;\n' +
    '        return ret;\n' +
    '    });\n' +
    '/*');
  fs.writeFileSync('node_modules/ember-cli-ember-leaflet/vendor/ember-leaflet/dist/ember-leaflet-es6.js', replacedDefine, {encoding: 'utf8'});


  app.import('vendor/ember-leaflet/dist/ember-leaflet-es6.js', {
    exports: {
      'ember-leaflet': 'default'
    }
  });
  app.import('vendor/leaflet.markerclusterer/dist/MarkerCluster.Default.css');
};

module.exports = EmberCLIEmberLeaflet;
