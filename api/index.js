const moduleAlias = require('module-alias');

moduleAlias();

const app = require('../dist/app');

module.exports = app;
