module.exports = function (RED) {
    function IsHoliday(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.hebcalHelper = RED.nodes.getNode(config.configuration).hebcalHelper;

        node.on('input', (msg) => {
            if (this.hebcalHelper.issurMelachaStatus()) {
                node.status({ fill: 'orange', shape: 'ring', text: `True` });
                node.send([ null, msg ]);
            } else {
                node.status({ fill: 'green', shape: 'ring', text: `False` });
                node.send([ msg, null ]);
            }
        });
    }
    RED.nodes.registerType('is holiday', IsHoliday);
}