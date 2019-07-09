# PiHome-EMON-Zwave

Create config.js file in order to run this.
The config file should contain the following:

const COM_WINDOWS = '';
const COM_DARWIN = '';
const COM_LINUX = '';
const brokerUrl = 'mqtts://example.nl';
const brokerOptions = {port: 8883, username: 'username', password: '1234'};
const zwaveTopic = 'topic';
module.exports = {
  COM_WINDOWS,
  COM_DARWIN,
  COM_LINUX,
  brokerUrl,
  brokerOptions,
  zwaveTopic
};