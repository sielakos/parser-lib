import {expect} from 'chai';
import 'mocha';
import {operator, symbol} from '../../lib';

describe('operator', () => {
  const fn = (a: number, b: number) => a + b;
  
  describe('with string as first argument', () => {
    const parser = operator('+', fn);
    
    it('should parse given keyword and return fn as state.result', () => {
      const result = parser.parseText('\n + d');
      
      expect(result.isRight()).to.eql(true);
      
      result.onRight(state => {
        expect(state.str).to.eql('d');
        expect(state.result).to.eql(fn);
        expect(state.col).to.eql(3);
        expect(state.row).to.eql(1);
      });
    });
    
    it('should fail when keyword does not match', () => {
      const result = parser.parseText(' - ');
      
      expect(result.isLeft()).to.eql(true);
      
      result.onLeft(error => {
        expect(error.msg).to.contain('+');
        expect(error.state.str).to.eql('- ');
        expect(error.state.col).to.eql(1);
        expect(error.state.row).to.eql(0);
      });
    });
  });
  
  describe('with parser as first argument', () => {
    const parser = operator(symbol('+'), fn);
  
    it('should run given parser and return fn as state.result', () => {
      const result = parser.parseText('+d');
    
      expect(result.isRight()).to.eql(true);
    
      result.onRight(state => {
        expect(state.str).to.eql('d');
        expect(state.result).to.eql(fn);
        expect(state.col).to.eql(1);
        expect(state.row).to.eql(0);
      });
    });
  
    it('should fail when given parser fails', () => {
      const result = parser.parseText('-');
    
      expect(result.isLeft()).to.eql(true);
    
      result.onLeft(error => {
        expect(error.msg).to.contain('+');
        expect(error.state.str).to.eql('-');
        expect(error.state.col).to.eql(0);
        expect(error.state.row).to.eql(0);
      });
    });
  });
});