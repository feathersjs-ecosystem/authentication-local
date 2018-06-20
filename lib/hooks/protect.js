const { omit, isRegExp, each, union } = require('lodash');

module.exports = function (...fields) {
  return function protect (context) {
    const result = context.dispatch || context.result;
    const o = current => {
      const data = typeof current.toJSON === 'function'
        ? current.toJSON() : current;
      const regexFields = [];
      fields.map(field => {
        if (isRegExp(field)) {
          each(data, (val, ind) => {
            if (new RegExp(field).test(ind)) {
              regexFields.push(ind);
            }
          });
        }
      });

      return omit(data, union(fields, regexFields));
    };

    if (!result) {
      return context;
    }

    if (Array.isArray(result)) {
      context.dispatch = result.map(o);
    } else if (result.data && context.method === 'find') {
      context.dispatch = Object.assign({}, result, {
        data: result.data.map(o)
      });
    } else {
      context.dispatch = o(result);
    }

    if (context.params && context.params.provider) {
      context.result = context.dispatch;
    }

    return context;
  };
};
