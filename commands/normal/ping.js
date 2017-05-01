const { Command } = require('kawaii/src/Structures/Base');

class ping extends Command {
  constructor(...args) {
    super(...args);

    this.options = {
      description: 'Pings the bot',
      category: 'normal'
    };
  }

  execute() {
    return `**Pong!**`;
  }
}

module.exports = ping;
