// @flow
import type {Options} from './types';
import path from 'path';
import minimist from 'minimist';
import inquirer from 'inquirer';

const allowed = ['_', 'u', 'h', 'd', 'p'];

const options: Object = {
  db: {
    user: 'root',
    password: null,
    host: 'localhost',
    database: null
  }
};

export default function getOptions() {
  const argv = minimist(process.argv.slice(2), {boolean: 'p'});

  if (argv._.length !== 1 || !argv.d) {
    return Promise.reject(
      'Usage: make-wp-epic -d database [-u user] [-h host] path-to/my/victor-hugo [custom-processors.js]'
    );
  }

  for (const arg in argv) {
    if (allowed.indexOf(arg) < 0) {
      return Promise.reject(`Unkown option -${arg}`);
    }
  }

  options.hugoPath = path.join(argv._[0], 'site');

  if (argv.u) { options.db.user = argv.u; }
  if (argv.h) { options.db.host = argv.h; }
  options.db.database = argv.d;

  const pw = argv.p ?
    inquirer.prompt([{type: 'password', message: 'DB Password', name: 'password'}]) :
    Promise.resolve({});

  return pw.then(({password}) => {
    return {...options, password};
  });
}
