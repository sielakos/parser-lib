import {expect} from 'chai';
import 'mocha';
import {keyword} from '../../lib';

describe('keyword', () => {
  const parser = keyword('ala');

  it('should parse given keyword', () => {
    const result = parser.parseText(' ala d');

    expect(result.isRight());

    result.onRight(state => {
      expect(state.result).to.eql('ala');
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(5);
      expect(state.str).to.eql('d');
    });
  });

  it('should fail when whitespaces around word are missing', () => {
    expect(parser.parseText('ala').isLeft()).to.eql(true);
  });

  it('should fail when word does not match', () => {
    expect(parser.parseText('ata').isLeft()).to.eql(true);
  });
});
