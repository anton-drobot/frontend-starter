#!/usr/bin/env node

require('babel-register');

const CommandLineInterface = require('./cli/index').default;
new CommandLineInterface;