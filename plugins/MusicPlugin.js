const { Plugin } = require('kawaii/src/Structures/Base');

class MusicPlugin extends Plugin {
  constructor(...args) {
    super(...args);

    this.name = 'music';
    this.connections = [];
    this.url = 'http://lofi.jakeoid.com:8000/stream';
  }

  *join(client) {
    try {
      const connection = yield client.joinVoiceChannel(config.defaultVC);
      yield connections.push(connection);
      yield this.play(connection, client);
    } catch (e) {
      console.error(e);
    }
  }
  *play(connection, client) {
    yield connection.play(this.url, {inlineVolume: true});
    connection.once('end', () => {
      let i = this.connections.indexOf(connection);
      if(i !== -1) connection.splice(i, 1);
      this.join(client);
    })
  }
  *request() {
    try {
      const res = yield request.get('http://lofi.jakeoid.com:8000/status-json.xsl');
      const data = JSON.parse(res);
      return data;
    } catch (e) {
      console.error(e);
    }
  }
  *updateStatus() {
    try {
      const data = yield this.request();
      yield client.editStatus("online", {name: `${data.icestats.source.artist} - ${data.icestats.source.title}`});
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = MusicPlugin;
