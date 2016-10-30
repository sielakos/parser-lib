import {expect} from 'chai';
import {namedSequence, keyword} from '../../lib';

describe('namedSequence', () => {
  const parser = namedSequence({
    a1: keyword('a1', false),
    a2: keyword('a2', false),
    a3: keyword('a3', false)
  });

  it('should run parsers in sequence', () => {
    const input = 'a1 a2 a3';
    const result = parser.parseText(input);

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.result).to.eql({
        a1: 'a1',
        a2: 'a2',
        a3: 'a3'
      });
      expect(state.str).to.eql('');
      expect(state.col).to.eql(input.length);
      expect(state.row).to.eql(0);
    });
  });

  it('should fail if any of parsers fail', () => {
    const input = ' a1 a3 a3 ';
    const result = parser.parseText(input);

    expect(result.isRight()).to.eql(false);

    result.onLeft(error => {
      const state = error.state;

      expect(error.msg).to.contain('a2');
      expect(state.str).to.eql(input);
      expect(state.col).to.eql(0);
      expect(state.row).to.eql(0);
    });
  });
});