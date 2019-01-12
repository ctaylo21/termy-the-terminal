// Make common library methods available on global object
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

global.assert = chai.assert;
global.sinon = require('sinon');
