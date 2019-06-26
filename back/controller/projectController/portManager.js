const ports = [9000, 9999];

class PortManager {
    constructor(obj) {
        this.dbClient = obj.dbClient;
    }

    async findPort(without) {
        const results = await this.dbClient.collection('apps').find().toArray();
        const all_ports = results.map((doc) => doc.app_port).concat(results.map((doc) => doc.webgrind_port));

        for (let port = ports[0]; port < ports[1]; ++port) {
            if (!all_ports.includes(port) && port !== without) {
                return port;
            }
        }

        return -1;
    }
}

module.exports = PortManager;
