const moduleAlias = require('module-alias');

const { getAliases } = require('../dist/utils/moduleAliases');

moduleAlias.addAliases(getAliases());

moduleAlias();

module.exports = require('../dist/app');
