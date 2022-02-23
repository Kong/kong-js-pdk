'use strict';

const {
  Command,
  Option
} = require('commander')

const {version} = require('./package.json')

const program = new Command()
program.version(version, '--version')

const logLevel = ["info", "debug"]

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

function parse(dedicated) {
  program
    .option('-p, --kong-prefix, -kong-prefix <prefix>',
      'unix domain socket path to listen',
      '/usr/local/kong')
    .option('-v, --verbose', 'verbose logging', increaseVerbosity, 0)
    .option('--sock-name <sock_name>', 'socket name to listen on', 'js_pluginserver.sock')

  if (dedicated) {
    program.option('--dump, -dump', 'dump current plugin info into stdout')
  } else {
    program
      .requiredOption('-d, --plugins-directory, -plugins-directory <dir>',
        'plugins directory for .js files')
      .option('--dump-plugin-info, -dump-plugin-info <name>',
        'dump specific plugin info into stdout')
      .option('--dump-all-plugins, -dump-all-plugins', 'dump all plugins info into stdout')
  }

  program.parse(process.argv)

  let opts = program.opts()
  opts.verbose = opts.verbose || 0
  opts.logLevel = logLevel[opts.verbose > 1 ? 1 : opts.verbose]

  return opts
}

module.exports.parse = parse
