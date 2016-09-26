import {expect} from 'chai';
import 'mocha';
import {or, symbol, number} from '../../lib';

describe('or', () => {
  const parser = or<any, string>(
    symbol('a'),
    number
      .filter(n => n > 10)
      .map(n => n.toString())
  );

  it('should pass if any of given parsers matches', () => {
     expect(
       parser
         .parseText('a')
         .map(state => state.result)
         .getOrElse('')
     ).to.eql('a');

    expect(
      parser
        .parseText('12')
        .map(state => state.result)
        .getOrElse('')
    ).to.eql('12');
  });

  it('should fail if all given parsers fail', () => {
    expect(
      parser
        .parseText('b')
        .isLeft()
    ).to.eql(true);
  });

  it('should match first parser', () => {
    const parser = or(
      symbol('a'),
      symbol('alina')
    );

    expect(
      parser
        .parseText('alina')
        .map(state => state.result)
        .getOrElse('')
    ).to.eql('a');
  });
});
