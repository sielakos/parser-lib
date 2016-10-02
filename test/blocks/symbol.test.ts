import {expect} from 'chai';
import 'mocha';
import {symbol} from '../../lib';

describe('symbol', () => {
  const parser = symbol('x11');

  it('should return right state when matching', () => {
    const result = parser.parseText('x112x');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.str).to.eql('2x');
      expect(state.result).to.eql('x11');
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(3);
    });
  });

  it('should return left state when not matching', () => {
    const result = parser.parseText('x12x2');

    expect(result.isLeft()).to.eql(true);

    result.onLeft(error => {
      expect(error.msg).to.contain('x11');
      expect(error.state.str).to.eql('x12x2');
      expect(error.state.row).to.eql(0);
      expect(error.state.col).to.eql(0);
    });
  });
});
