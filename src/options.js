// @flow
import type {Options} from './types';
import path from 'path';
import minimist from 'minimist';
import inquirer from 'inquirer';

const allowed = ['_', 'u', 'h', 'd', 'p', 'x'];

const options: Object = {
  db: {
    user: 'root',
    password: null,
    host: 'localhost',
    database: null,
    prefix: 'wp_'
  },
  processors: {
    post: (o, p) => p,
    category: (o, c) => c,
    author: (o, a) => a,
    page: (o, p) => p
  }
};

export default function getOptions() {
  const argv = minimist(process.argv.slice(2), {boolean: 'p'});

  if (argv._.length < 1 || argv._.length > 2 || !argv.d) {
    return Promise.reject(
      'Usage: make-wp-epic -d database [-u user] [-h host] [-x prefix] path-to/my/victor-hugo [custom-processors.js]'
    );
  }

  for (const arg in argv) {
    if (allowed.indexOf(arg) < 0) {
      return Promise.reject(`Unkown option -${arg}`);
    }
  }

  options.hugoPath = path.join(argv._[0], 'site');

  if (argv.x) { options.db.prefix = argv.x; }
  if (argv.u) { options.db.user = argv.u; }
  if (argv.h) { options.db.host = argv.h; }
  options.db.database = argv.d;

  if (argv._.length === 2) {
    const lib = path.resolve(argv._[1]);
    console.log('Loading custom processors from ', lib);
    try {
      // $FlowFixMe -- we needa dynamic require here
      var processors = require(lib);
      console.log('processors loaded: ', processors);
      [
        ['post', 'processPost'],
        ['author', 'processAuthor'],
        ['category', 'processCategory'],
        ['page', 'processPage']
      ].forEach(([type, processor]) => {
        if (processors[processor]) {
          console.log('Enabling custom processor for ', type, ' processing');
          options.processors[type] = processors[processor];
        }
      });
    } catch (e) {
      throw(`Failed to load custom processors: ${e.toString()}`);
    }
  }

  const pw = argv.p ?
    inquirer.prompt([{type: 'password', message: 'DB Password', name: 'password'}]) :
    Promise.resolve({});

  return pw.then(({password}) => {
    return {...options, db: {...options.db, password}};
  });
}
