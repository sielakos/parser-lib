import {expect} from 'chai';
import 'mocha';
import {transparent, Parser, number, State} from '../../lib';

describe('transparent', () => {
  it('should not change result', () => {
    expect(
      Parser
        .point('alina')
        .next(
          transparent(number)
        )
        .parseText('12')
        .map(state => state.result)
        .getOrElse('x')
    ).to.equal('alina');
  });

  it('should consume input', () => {
    const state = Parser
      .point('alina')
      .next(
        transparent(number)
      )
      .parseText('12d')
      .getOrElse(State.point('x'));

    expect(state.str).to.eql('d');
    expect(state.row).to.eql(0);
    expect(state.col).to.eql(2);
  });
});
