import {expect} from 'chai';
import 'mocha';
import {many1, symbol, number, transparent} from '../../lib';

describe('many1', () => {
  const parser = many1(
    number
      .next(
        transparent(
          symbol(',')
        )
      )
  );

  it('should parse list of values', () => {
    const result = parser.parseText('1,2,3,4,5,6,7,d');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(14);
      expect(state.str).to.eql('d');
      expect(state.result).to.deep.equal([1,2,3,4,5,6,7]);
    });
  });

  it('should fail when first value cannot be parsed', () => {
    const result = parser.parseText('dupa');

    expect(result.isLeft()).to.eql(true);

    result.onLeft(error => {
      expect(error.state.col).to.eql(0);
      expect(error.state.row).to.eql(0);
      expect(error.state.str).to.eql('dupa');
    });
  });
});
