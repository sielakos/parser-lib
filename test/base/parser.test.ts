import {expect} from 'chai';
import 'mocha';
import {State, Parser, createParser} from '../../lib';

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

      expect(state.result).to.eq(13);
    });

    it('should change result to string', () => {
      const newParser = parser.flatMap(n => {
        return point(n + '-t');
      });
      const state = newParser.parse(new State('', 0));

      expect(state.result).to.eql('12-t');
    });

    it('should keep other state parameters', () => {
      const text = 'ala ma kota';
      const row = 10;
      const col = 36;
      const newParser = parser.flatMap(n => {
        return point(n + 1);
      });
      const state = newParser.parse(new State(text, 0, row, col));

      expect(state.str).to.eql(text);
      expect(state.row).to.eql(row);
      expect(state.col).to.eql(col);
    });

    it('should use custom parser', () => {
      const expectedState = new State('ala', 0, 10, 10);
      const newParser = parser.flatMap(() => {
        return createParser(() => expectedState)
      });
      const state = newParser.parse(new State('', 0));

      expect(state).to.be.eql(expectedState);
    })
  });

  describe('map', () => {
    let parser: Parser<number, number>;

    beforeEach(() => {
      parser = point(12);
    });

    it('should increment n by 1', () => {
      const newParser = parser.map(n => n + 1);
      const state = newParser.parse(new State('', 0));

      expect(state.result).to.eq(13);
    });

    it('should change result to string', () => {
      const newParser = parser.map(n => n + '-t');
      const state = newParser.parse(new State('', 0));

      expect(state.result).to.eql('12-t');
    });

    it('should keep other state parameters', () => {
      const text = 'ala ma kota';
      const row = 10;
      const col = 36;
      const newParser = parser.map(n => n + 1);
      const state = newParser.parse(new State(text, 0, row, col));

      expect(state.str).to.eql(text);
      expect(state.row).to.eql(row);
      expect(state.col).to.eql(col);
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

      expect(resultState.str).to.eql(text);
      expect(resultState.row).to.eql(row);
      expect(resultState.col).to.eql(col);
      expect(resultState.result.a).to.eql(result.a);
    });
  });
});