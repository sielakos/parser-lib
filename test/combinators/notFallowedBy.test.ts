import {expect} from 'chai';
import 'mocha';
import {symbol, notFallowedBy} from '../../lib';

describe('notFallowedBy', () => {
  const parser = notFallowedBy(symbol(']'));
  
  it('should fail when given parser passes', () => {
    const result = parser.parseText(']');
    
    expect(result.isLeft()).to.eql(true);
    
    result.onLeft(error => {
      expect(error.msg).to.contain('Expected');
      expect(error.msg).to.contain('to fail');
      expect(error.state.str).to.eql(']');
      expect(error.state.col).to.eql(0);
      expect(error.state.row).to.eql(0);
      expect(error.additionalInfo.result).to.eql(']');
      expect(error.additionalInfo.col).to.eql(1);
      expect(error.additionalInfo.row).to.eql(0);
    });
  });
  
  it('should pass when given parser fails', () => {
    const result = parser.parseText('}');
    
    expect(result.isRight()).to.eql(true);
    
    result.onRight(state => {
      expect(state.col).to.eql(0);
      expect(state.row).to.eql(0);
      expect(state.str).to.eql('}');
    });
  });
});