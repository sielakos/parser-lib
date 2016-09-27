import {expect} from 'chai';
import 'mocha';
import {State, Parser, createParser, Either, symbol, number} from '../../lib';
import {ParserError} from '../../lib/base/parserError';

const point = Parser.point;

describe('Parser', () => {
  describe('flatMap', () => {
    let parser: Parser<number, number>;

    beforeEach(() => {
      parser = point(12);
    });

    it('should increment n by 1', () => {
      const newParser = parser.flatMap(n => {
        return point(n + 1);
      });
      const state = newParser.parse(new State('', 0));

      state.onRight(state =>
        expect(state.result).to.eq(13)
      );
    });

    it('should change result to string', () => {
      const newParser = parser.flatMap(n => {
        return point(n + '-t');
      });
      const state = newParser.parse(new State('', 0));

      state.onRight(state =>
        expect(state.result).to.eql('12-t')
      );
    });

    it('should keep other state parameters', () => {
      const text = 'ala ma kota';
      const row = 10;
      const col = 36;
      const newParser = parser.flatMap(n => {
        return point(n + 1);
      });
      const state = newParser.parse(new State(text, 0, row, col));

      state.onRight(state => {
        expect(state.str).to.eql(text);
        expect(state.row).to.eql(row);
        expect(state.col).to.eql(col);
      });
    });

    it('should use custom parser', () => {
      const expectedState = new State('ala', 0, 10, 10);
      const newParser = parser.flatMap(() => {
        return createParser(() => Either.point(expectedState))
      });
      const state = newParser.parse(new State('', 0));

      state.onRight(state => {
        expect(state).to.be.eql(expectedState);
      });
    });

    it('should not map failed parsing result', () => {
      const newParser: Parser<any, any> = createParser((state) =>
        Either.left(
          new ParserError('error', state)
        )
      ).flatMap(n =>
        createParser(() =>
          Either.point(
            State.point(10)
          )
        )
      );
      const result = newParser.parse(State.point(null));

      expect(result.isLeft()).to.eql(true);
    });
  });

  describe('map', () => {
    let parser: Parser<number, number>;

    beforeEach(() => {
      parser = point(12);
    });

    it('should increment n by 1', () => {
      const newParser = parser.map(n => n + 1);
      const state = newParser.parse(new State('', 0));

      state.onRight(state =>
        expect(state.result).to.eq(13)
      );
    });

    it('should change result to string', () => {
      const newParser = parser.map(n => n + '-t');
      const state = newParser.parse(new State('', 0));

      state.onRight(state =>
        expect(state.result).to.eql('12-t')
      );
    });

    it('should keep other state parameters', () => {
      const text = 'ala ma kota';
      const row = 10;
      const col = 36;
      const newParser = parser.map(n => n + 1);
      const state = newParser.parse(new State(text, 0, row, col));

      state.onRight(state => {
        expect(state.str).to.eql(text);
        expect(state.row).to.eql(row);
        expect(state.col).to.eql(col);
      });
    });

    it('should not map failed parsing result', () => {
      const newParser: Parser<any, any> = createParser((state) =>
        Either.left(
          new ParserError('error', state)
        )
      ).map(() => 10);
      const result = newParser.parse(State.point(null));

      expect(result.isLeft()).to.eql(true);
    });
  });

  describe('point', () => {
    it('should create parser that does not changes input and sets result of given type', () => {
      const text = 'ala';
      const row = 12;
      const col = 14;
      const result = {a: 11};
      const inputState = new State(text, null, row, col);
      const parser = point(result);

      const resultState = parser.parse(inputState);

      resultState.onRight(resultState => {
        expect(resultState.str).to.eql(text);
        expect(resultState.row).to.eql(row);
        expect(resultState.col).to.eql(col);
        expect(resultState.result.a).to.eql(result.a);
      });
    });
  });

  describe('parseText', () => {
    it('should parse new state with given text', () => {
      const parser = symbol('karol');
      const result = parser.parseText('karol');
      const value = result
        .getOrElse(
          State.point('dupa')
        )
        .result;

      expect(result.isRight()).to.eql(true);
      expect(value).to.eql('karol');
    });
  });

  describe('fail', () => {
    it('should produce parser that fails with given message', () => {
      const msg = 'fail';
      const parser = Parser.fail(msg);

      expect(
        parser
          .parseText('')
          .swap()
          .map(error => error.msg)
          .getOrElse('')
      ).to.eql(msg);
    });
  });

  describe('orElse', () => {
    const parser = symbol('ala')
      .orElse(() => symbol('beata'));

    it('should return result of first parsers if it works', () => {
      expect(
        parser
          .parseText('ala')
          .map(state => state.result)
          .getOrElse('')
      ).to.eql('ala');
    });

    it('should fail if both parser fail', () => {
       expect(
         parser
           .parseText('dd2')
           .isLeft()
       ).to.eql(true);
    });

    it('should catch parser error and use new parser to try parsing the state again', () => {
      expect(
        parser
          .parseText('beata')
          .map(state => state.result)
          .getOrElse('')
      ).to.eql('beata');
    });
  });

  describe('filter', () => {
    const parser = number.filter(n => n < 100 && n >= 0);

    it('should pass when condition is met', () => {
       expect(
         parser
           .parseText('88')
           .map(state => state.result)
           .getOrElse(0)
       ).to.eql(88);
    });

    it('should fail when condition is not met', () => {
      expect(
        parser
          .parseText('868')
          .isLeft()
      ).to.eql(true);
    });

    it('should fail with given message', () => {
      const msg = 'fail';

      expect(
        parser
          .filter(() => false, msg)
          .parseText('86')
          .swap()
          .map(error => error.msg)
          .getOrElse('')
      ).to.eql(msg);
    });

    it('should fail when base parser fails', () => {
      expect(
        parser
          .parseText('d8')
          .isLeft()
      ).to.eql(true);
    });
  });

  describe('changeErrorMessage', () => {
    it('should change error message', () => {
      expect(
        Parser
          .fail('x')
          .changeErrorMessage('y')
          .parseText('')
          .swap()
          .map(error => error.msg)
          .getOrElse('')
      ).to.eql('y');
    });
  });
});
