import { Lipwig } from './app/Lipwig';
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const commandLineOptions = [
  {
    name: 'config',
    alias: 'c',
    type: String,
    description: 'The location of your Lipwig configuration file (default: ./lipwig.config.js)'
  },
  {
    name: 'port',
    alias: 'p',
    type: Number,
    description: 'The port on which the Lipwig server should run'
  },
]

let options;
try {
  options = commandLineArgs(commandLineOptions);
} catch {
    const usageOptions = [
      /**{
      header: 'Load',
      content: 'A simple example demonstrating typical usage.'
    },*/
    {
      header: 'Options',
      optionList: commandLineOptions
    }/*,
    {
      content: 'Project home: {underline https://github.com/me/example}'
    }*/]
  const usage = commandLineUsage(usageOptions);
  console.log(usage);
  process.exit();
}

const configFileLocation = process.cwd() + '/lipwig.config.js';

//configFileLocation = options.config ? options.config : './lipwig.config.js';
// TODO: Args parsing here, keep the core classes clean
let config;
try {
  config = require(configFileLocation);
} catch {
  config = {};
}
console.log(config);
process.title = 'lipwig';
process.argv.forEach(function(value, index) {
    if (index === 0) {
        return;
    }
});

new Lipwig(config);

