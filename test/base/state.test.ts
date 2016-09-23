import {expect} from 'chai';
import 'mocha';
import {State} from '../../lib';

describe('State', () => {
  describe('flatMap', () => {
    it('should use result of state to produce new state', () => {
      const resultState = State
        .point(5)
        .flatMap(n => new State('x', n + 5, 11, 45));

      expect(resultState.result).to.eql(10);
      expect(resultState.str).to.eql('x');
      expect(resultState.row).to.eql(11);
      expect(resultState.col).to.eql(45);
    });

    it('should join str, row and col', () => {
      const resultState = new State('y ', 5, 10, 15)
        .flatMap(n => new State('x', n + 5, 11, 45));

      expect(resultState.result).to.eql(10);
      expect(resultState.str).to.eql('y x');
      expect(resultState.row).to.eql(21);
      expect(resultState.col).to.eql(60);
    });
  });

  describe('map', () => {
    it('should transform result of state', () => {
      const resultState = State
        .point(5)
        .map(n => n + 1);

      expect(resultState.result).to.eql(6);
    });

    it('should not change str, row and col properties of state', () => {
      const str = 'x123x';
      const row = 11;
      const col = 54;
      const resultState = new State(str, 1, row, col)
        .map(n => n + 1);

      expect(resultState.str).to.eql(str);
      expect(resultState.row).to.eql(row);
      expect(resultState.col).to.eql(col);
    });
  });

  describe('point', () => {
    it('should create empty state with given result', () => {
      const state = State.point(34);

      expect(state.result).to.eql(34);
      expect(state.str).to.eql('');
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(0);
    });
  });
});