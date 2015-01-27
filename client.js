var request = require('then-request');
var base    = 'https://api.publitas.com/v2/';
var errors  = {
  '400': 'Unknown Error',
  '402': 'Payment Required – You have reached your publishing limit',
  '404': 'Not Found – The path or document could not be found',
  '405': 'Method Not Allowed – You tried to access the API with an invalid method',
  '406': 'Not Acceptable – You requested a format that isn’t json',
  '418': 'I’m a teapot',
  '422': 'Unprocessable Entity – We found validation errors on one or more fields',
  '500': 'Internal Server Error – We had a problem with our server. Try again later',
  '503': 'Service Unavailable – We’re temporarially offline for maintenance. Please try again later'
};

module.exports = Client;

function Client(apiKey) {
  this.apiKey = apiKey;
}

/**
 * Call publitas API
 *
 * @param   method      the HTTP method
 * @param   path        the path
 * @param   attributes  query string attributes
 * @returns promise
 */
Client.prototype.request = function (method, path, prefix, attributes) {

  var qs = { api_key: this.apiKey };
  for (var k in attributes || {}) {
    qs[prefix + '[' + k +']'] = attributes[k];
  }

  return request(method, base + path, { qs: qs })
    .then(function (res) {
      if (res.statusCode in errors) throw new Error(errors[res.statusCode] + ' ' + res.body);
      return JSON.parse(res.getBody());
    });
}

/**
 * Create group not defined error
 */
function noGroupError() {
  return new Error('Group not defined');
}

/**
 * Group API method
 *
 * @param   attributes  optional attributes
 * @param   callback    optional node style callback
 * @returns promise
 */
Client.prototype.getGroups = function (attributes, callback) {
  if (typeof attributes === 'function') {
    callback  = attributes;
    options   = {};
  }
  return this.request('GET', 'groups', attributes)
    .then(function (res) {
      return res.groups;
    })
    .nodeify(callback);
};


/**
 * Publications API method
 *
 * @param   group       the group
 * @param   attributes  optional attributes
 * @param   callback    optional node style callback
 * @returns promise
 */
Client.prototype.getPublications = function (group, attributes, callback) {
  if (typeof group != 'number') throw noGroupError();
  if (typeof attributes === 'function') {
    callback    = attributes;
    attributes  = {};
  }
  return this.request('GET', 'groups/' + group + '/publications', attributes)
    .then(function (res) {
      return res.publications;
    })
    .nodeify(callback);
};


/**
 * Create publication API method
 *
 * @param   group       the group
 * @param   attributes  optional attributes
 * @param   callback    optional node style callback
 * @returns promise
 */
Client.prototype.createPublication = function (group, attributes, callback) {
  if (!group) throw noGroupError();
  if (typeof attributes === 'function') {
    callback    = attributes;
    attributes  = {};
  }
  return this.request('POST', 'groups/' + group + '/publications', 'publication', attributes)
    .nodeify(callback);
};
