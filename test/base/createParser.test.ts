import {expect} from 'chai';
import 'mocha';
import {State, Parser, createParser, ParserError, Either} from '../../lib';

describe('createParser', () => {
  const msg = 'could not parse col';
  let parser: Parser<any, string | null>;

  beforeEach(() => {
    parser = createParser((state: State<any>) => {
      if (state.str.substr(0, 3) === 'col') {
        return Either.point(new State(
          state.str.substr(3),
          'col',
          state.row,
          state.col + 3
        ));
      }

      return Either.left(new ParserError(msg, state));
    });
  });

  it('should parse "col" string correctly', () => {
    const inputState = new State('colin', 23, 0, 0);
    const either = parser.parse(inputState);

    either.onRight(resultState => {
      expect(resultState.result).to.eql('col');
      expect(resultState.str).to.eql('in');
      expect(resultState.col).to.eql(3);
      expect(resultState.row).to.eql(0);
    });
  });

  it('should produce left either on failed parsin', () => {
    const inputState = new State('tolin', 23, 0, 0);
    const either = parser.parse(inputState);

    either.onLeft(parserError => {
      expect(parserError.msg).to.eql(msg);
      expect(parserError.state.str).to.eql('tolin');
      expect(parserError.state.col).to.eql(0);
      expect(parserError.state.row).to.eql(0);
    });
  });
});