import {expect} from 'chai';
import 'mocha';
import {State, Parser, createParser} from '../../lib';

describe('createParser', () => {
  let parser: Parser<any, string | null>;

  beforeEach(() => {
    parser = createParser((state: State<any>): State<string | null> => {
      if (state.str.substr(0, 3) === 'col') {
        return new State(
          state.str.substr(3),
          'col',
          state.row,
          state.col + 3
        );
      }

      return state.map(() => null);
    });
  });

  it('should parse "col" string correctly', () => {
    const inputState = new State('colin', 23, 0, 0);
    const resultState = parser.parse(inputState);

    expect(resultState.result).to.eql('col');
    expect(resultState.str).to.eql('in');
    expect(resultState.col).to.eql(3);
    expect(resultState.row).to.eql(0);
  });

  it('should should map incorrect state result to null', () => {
    const inputState = new State('tolin', 23, 0, 0);
    const resultState = parser.parse(inputState);

    expect(resultState.result).to.eql(null);
    expect(resultState.str).to.eql('tolin');
    expect(resultState.col).to.eql(0);
    expect(resultState.row).to.eql(0);
  });
});