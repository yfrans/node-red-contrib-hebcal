module.exports = function (RED) {
    function HebcalEvent(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.hebcalHelper = RED.nodes.getNode(config.configuration).hebcalHelper;

        function onIssurMelachaChanged(issurMelacha, holiday) {
            node.send({ payload: {
                issurMelacha, holiday
            }});
        }
        
        this.hebcalHelper.on('issur-melacha', onIssurMelachaChanged);

        node.on('close', () => {
            this.hebcalHelper.off('issur-melacha', onIssurMelachaChanged);
        });

        let nextHoliday = this.hebcalHelper.getNextHoliday();
        if (nextHoliday) {
            node.status({ fill: 'green', shape: 'dot', text: `next: ${nextHoliday.name} @ ${nextHoliday.from}` });
        } else {
            node.error('Cannot determine next holiday, please check your settings');
            node.status({ fill: 'red', shape: 'ring', text: 'cannot determine next holiday' });
        }
    }
    RED.nodes.registerType('hebcal event', HebcalEvent);
}