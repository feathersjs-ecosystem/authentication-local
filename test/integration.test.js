/* eslint-disable no-unused-expressions */
const feathers = require('feathers');
const authentication = require('feathers-authentication');
const memory = require('feathers-memory');
const hooks = require('feathers-hooks');
const local = require('../lib');

const { expect } = require('chai');

describe('integration', () => {
  it('verifies', () => {
    const User = {
      email: 'admin@feathersjs.com',
      password: 'password'
    };

    const req = {
      query: {},
      body: Object.assign({}, User),
      headers: {},
      cookies: {},
      params: {
        query: {},
        provider: 'socketio',
        headers: {},
        session: {},
        cookies: {},
        data: 'Hello, world'
      }
    };

    const app = feathers();
    let paramsReceived = false;
    let dataReceived;

    app.configure(hooks())
      .configure(authentication({ secret: 'secret' }))
      .configure(local())
      .use('/users', memory());

    app.service('users').hooks({
      before: {
        find: (hook) => {
          paramsReceived = Object.keys(hook.params);
          dataReceived = hook.params.data;
        },
        create: local.hooks.hashPassword({ passwordField: 'password' })
      }
    });

    app.setup();

    return app.service('users').create(User).then(() => {
      return app.authenticate('local')(req).then(result => {
        expect(result.success).to.equal(true);
        expect(result.data.user.email).to.equal(User.email);
        expect(result.data.user.password).to.not.equal(undefined);
        expect(paramsReceived).to.have.members(['data', 'query']);
        expect(dataReceived).to.equal('Hello, world');
      });
    });
  });
});
