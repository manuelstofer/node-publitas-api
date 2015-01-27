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
    if (prefix) {
      qs[prefix + '[' + k +']'] = attributes[k];
    } else {
      qs[k] = attributes[k];  
    }
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
  return new Error('Group is not a number');
}

/**
 * Create id not defined error
 */
function noIdError() {
  return new Error('Id is not a number');
}

/**
 * Group API method
 *
 * @param   callback    optional node style callback
 * @returns promise
 */
Client.prototype.getGroups = function (callback) {
  return this.request('GET', 'groups')
    .then(function (res) {
      return res.groups;
    })
    .nodeify(callback);
};


/**
 * Publications API method
 *
 * @param   group       the group
 * @param   callback    optional node style callback
 * @returns promise
 */
Client.prototype.getPublications = function (group, callback) {
  if (typeof group != 'number') throw noGroupError();

  return this.request('GET', ['groups', group, 'publications'].join('/'))
    .then(function (res) {
      return res.publications;
    })
    .nodeify(callback);
};

/**
 * Get a specific publication
 *
 * @param   group       the group
 * @param   id          the publication id
 * @param   callback    optional node style callback
 * @returns promise
 */
Client.prototype.getPublication = function (group, id, callback) {
  if (typeof group != 'number') throw noGroupError();
  if (typeof id    != 'number') throw noIdError();

  return this.request('GET', ['groups', group, 'publications', id].join('/'))
    .then(function (res) {
      return res.publication;
    })
    .nodeify(callback);
};


/**
 * Create publication API method
 *
 * @param   group       the group
 * @param   publication the publication
 * @param   callback    optional node style callback
 * @returns promise
 */
Client.prototype.createPublication = function (group, publication, callback) {
  if (!group) throw noGroupError();
  
  return this.request('POST', ['groups', group, 'publications'].join('/'), 'publication', publication)
    .then(function (res) {
      return res.publication;
    })
    .nodeify(callback);
};
