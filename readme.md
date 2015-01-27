# publitas-api

Node.js wrapper for the publitas api

```
$ npm install publitas-api
```

## Example

```Javascript
var Client   = require('publitas-api');
var publitas = new Client('api-key');

publitas.getGroups(function log (err, res) {
  if (err) throw err;
  console.dir(res);
});
```

## API

- All API methods return a promise and provide a node style callback.
- The supported attributes can be found in the [api documentation](http://publitas.github.io/docs/v2.html).

```
Groups:
publitas.getGroups(attributes, fn(err, groups))

Publications:
publitas.getPublications(attributes, fn(err, publications))

Create:
publitas.createPublication(attributes, fn(err, publication))

```

