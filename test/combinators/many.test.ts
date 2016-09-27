import {expect} from 'chai';
import 'mocha';
import {many, symbol, number} from '../../lib';

describe('many', () => {
  const parser = many(
    number
      .flatMap(n =>
        symbol(',').map(() => n)
      )
  );

  it('should produce list of results', () => {
    const input = '1,2,3,';
    const result = parser.parseText(input);

    expect(result.isRight());
    expect(
      result
        .map(state => state.result)
        .getOrElse([])
    ).to.deep.equal([1, 2, 3]);
  });

  it('should produce empty list when child parser fails', () => {
    const input = 'dupa';
    const result = parser.parseText(input);

    expect(result.isRight());
    expect(
      result
        .map(state => state.result)
        .getOrElse([1])
    ).to.deep.equal([]);
  })
});
