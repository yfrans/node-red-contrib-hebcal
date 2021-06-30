const HebcalHelper = require('./HebcalHelper');

module.exports = function(RED) {
    function HebcalConfig(config) {
        RED.nodes.createNode(this, config);
        this.hebcalHelper = new HebcalHelper(config.latitude, config.longitude, config.isil === '1');
        this.hebcalHelper.startHolidayCheckInterval();
    }
    RED.nodes.registerType('hebcal-config', HebcalConfig);
}