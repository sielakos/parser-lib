import {withDefault, symbol} from '../../lib';
import {expect} from 'chai';

describe('withDefault', () => {
  const parser = withDefault(
    symbol('karolina'),
    'ala'
  );

  it('should return successful result of child parser', () => {
    const result = parser.parseText('karolina d');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.result).to.eql('karolina');
      expect(state.col).to.eql(8);
      expect(state.row).to.eql(0);
      expect(state.str).to.eql(' d');
    });
  });

  it('should return default value and original state in case of failure of child parser', () => {
    const result = parser.parseText('adam');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.str).to.eql('adam');
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(0);
      expect(state.result).to.eql('ala');
    });
  });
});