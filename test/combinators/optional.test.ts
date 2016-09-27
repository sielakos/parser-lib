import {expect} from 'chai';
import 'mocha';
import {optional, symbol, number} from '../../lib';

describe('optional', () => {
  const parser = optional(
    symbol('x')
  ).next(number);

  it('should pass if both parser pass', () => {
    expect(
      parser
        .parseText('x122')
        .map(state => state.result)
        .getOrElse(0)
    ).to.eql(122);
  });

  it('should pass if optional parser fails', () => {
    expect(
      parser
        .parseText('12.2')
        .map(state => state.result)
        .getOrElse(0)
    ).to.eql(12.2);
  });
});
