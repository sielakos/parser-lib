import {expect} from 'chai';
import 'mocha';
import {symbol, lazy} from '../../lib';

describe('lazy', () => {
  const parser = lazy(() => symbol('d'));
  
  it('should use given function to create parser and use it on input', () => {
    const result = parser.parseText('d1');
    
    expect(result.isRight());
    
    result.onRight(state => {
      expect(state.str).to.eql('1');
      expect(state.col).to.eql(1);
      expect(state.row).to.eql(0);
      expect(state.result).to.eql('d');
    });
  });
});