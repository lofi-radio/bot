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
}

module.exports = MusicPlugin;
