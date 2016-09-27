import {expect} from 'chai';
import 'mocha';
import {between, symbol, number} from '../../lib';

describe('between', () => {
  const parser = between(
    symbol('('),
    symbol(')'),
    number
  );

  it('should enclose parser in open and close parsers', () => {
    const result = parser.parseText('(12.2)x');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.str).to.eql('x');
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(6);
      expect(state.result).to.eql(12.2);
    });
  });

  it('should fail if any of parsers fails', () => {
    expect(parser.parseText('[12)').isLeft()).to.eql(true);
    expect(parser.parseText('(d)').isLeft()).to.eql(true);
    expect(parser.parseText('(12]').isLeft()).to.eql(true);
  });
});
