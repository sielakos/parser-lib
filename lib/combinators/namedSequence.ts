import {Parser} from '../base';
import {assign} from '../utils';
import {sequence} from './sequence';

export function namedSequence<R>(parsers: {[name: string]: Parser<any, R>}): Parser<any, {[name: string]: R}> {
  const parsersList = Object
    .keys(parsers)
    .map(name => {
      const parser = parsers[name];

      return parser.map(value => ({[name]: value}));
    });

  return sequence(...parsersList)
    .map((results: Array<{[name: string]: R}>) => {
      return results.reduce((current, next) => {
        return assign(current, next);
      }, {});
    });
}