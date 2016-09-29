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

    result.onRight(({result, row, col, str}) => {
      expect(result).to.deep.equal([1, 2, 3]);
      expect(row).to.eql(0);
      expect(col).to.eql(6);
      expect(str).to.eql('');
    });
  });

  it('should produce empty list when child parser fails', () => {
    const input = 'dupa';
    const result = parser.parseText(input);

    expect(result.isRight());

    result.onRight(({result, row, col, str}) => {
      expect(result).to.deep.equal([]);
      expect(row).to.eql(0);
      expect(col).to.eql(0);
      expect(str).to.eql('dupa');
    });
  })
});
