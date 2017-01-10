const ES6Utils = {

  /**
   * @params o - object to which the methods should be bound
   * @params ...methods - zero or more method values that will also be bound
   */
  bind: function(o, ...methods) {
    methods.forEach(method => o[method] = o[method].bind(o)); // eslint-disable-line no-return-assign
  }
};

module.exports = ES6Utils;
