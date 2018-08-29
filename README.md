# @feathersjs/authentication-local

> __Important:__ The code for this module has been moved into the main Feathers repository at [feathersjs/feathers](https://github.com/feathersjs/feathers) ([package direct link](https://github.com/feathersjs/feathers/tree/master/packages/authentication-local)). Please open issues and pull requests there. No changes are required in your existing Feathers applications.

[![Build Status](https://travis-ci.org/feathersjs/authentication-local.png?branch=master)](https://travis-ci.org/feathersjs/authentication-local)

Local authentication strategy for feathers-authentication using Passport without all the boilerplate.

## Installation

```
npm install @feathersjs/authentication-local --save
```

## Quick example

```js
const feathers = require('@feathersjs/feathers');
const authentication = require('feathers-authentication');
const local = require('@feathersjs/authentication-local');
const app = feathers();

// Setup authentication
app.configure(authentication(settings));
app.configure(local());

// Setup a hook to only allow valid JWTs or successful 
// local auth to authenticate and get new JWT access tokens
app.service('authentication').hooks({
  before: {
    create: [
      authentication.hooks.authenticate(['local', 'jwt'])
    ]
  }
});
```

## Documentation

Please refer to the [@feathersjs/authentication-local API documentation](https://docs.feathersjs.com/api/authentication/local.html) for more details.

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
