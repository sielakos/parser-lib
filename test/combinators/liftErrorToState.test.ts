import {expect} from 'chai';
import 'mocha';
import {liftErrorToState, symbol, State} from '../../lib';

describe('liftErrorToState', () => {
  const parser = liftErrorToState(
    symbol('Falin')
  );

  it('should result in state with right either as value on success', () => {
    const result = parser.parseText('Falind');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(5);
      expect(state.str).to.eql('d');
      expect(state.result.isRight()).to.equal(true);
      expect(state.result.getOrElse('')).to.eql('Falin');
    });
  });

  it('should result in state with left either as value on fail', () => {
    const result = parser.parseText('Dupa');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(0);
      expect(state.str).to.eql('Dupa');
      expect(state.result.isLeft()).to.equal(true);

      state.result.onLeft((error) => {
        expect(error.state).to.deep.equal(State.fromText('Dupa'));
        expect(error.msg).to.eql(`Couldn't parse symbol 'Falin'`);
      });
    });
  });
});
