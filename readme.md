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


### #getGroups(fn(err, groups))
Get all groups

### #getPublications(group, fn(err, publications))
Get all publication of a group

### #getPublication(group, id, fn(err, publication))
Get a specific publication by id

### #createPublication(group, publication, fn(err, publication))
Create a publication
