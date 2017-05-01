const Framework = require('kawaii');
const config = require('./config.json');
const { resolve } = require('path');
const client = new Framework.Core.Client(config.token, {
  maxShards: config.MAX_SHARDS,
}, { prefixes: config.prefixes });

Framework.Helpers.Loader.loadCategories(resolve('./categories'), client)
Framework.Helpers.Loader.loadEvents(resolve('./events'), client)
Framework.Helpers.Loader.loadPlugins(resolve('./plugins'), client)
Framework.Helpers.Loader.loadCommands(resolve('./commands/normal'), client)

client.handler.on('commandError', (err) => {
  console.error(err.stack);

  return err.ctx.m.channel.createMessage(`${err.message}`);
});

client.connect();

process.on('SIGINT', () => {
  console.log('Exiting');
  client.disconnect({
    reconnect: false
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on('uncaughtException', err => {
  console.error(`Unhandled exception, shutting down:\n`, err);
  process.exit(1);
});
