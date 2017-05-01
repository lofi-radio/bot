const Framework = require('kawaii');

class ReadyEvent extends Framework.Structures.Base.Event {
  constructor(client) {
    super(client, 'ready');
    this.music = Framework.plugins.get('music');
    this.context = {};
  }

  handle(client) {
    console.log(`[READY]: (Guilds): ${client.guilds.size} | (Users): ${client.users.size}`)
    this.music.join(client);
  }
}

module.exports = ReadyEvent;
