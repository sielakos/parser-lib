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

    it('should adjust str, row and col', () => {
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

  describe('fromText', () => {
    it('should create new state with given text', () => {
      expect(State.fromText('alina').str).to.eql('alina');
    });
  });

  describe('changePosition', () => {
    let newState: State<number>;

    beforeEach(() => {
      const state = new State('x', 10, 54, 56);

      newState = state.changePosition({row: 5, col: 10});
    });

    it('should change position state by given row and col', () => {
      expect(newState.row).to.eql(59);
      expect(newState.col).to.eql(10);
    });

    it('should not change str and result', () => {
      expect(newState.result).to.eql(10);
      expect(newState.str).to.eql('x');
    });

    it('should not reset col if row is 0', () => {
      const state = new State('x', 10, 54, 56)
        .changePosition({col: 4});

      expect(state.col).to.eql(60);
      expect(state.row).to.eql(54);
    });
  });

  describe('consumeText', () => {
    const text = 'alina\nma';
    let state: State<string>;

    beforeEach(() => {
      state = State
        .fromText('alina\nma kota')
        .consumeText(text);
    });

    it('should have given text as result', () => {
      expect(state.result).to.eql(text);
    });

    it('should have col and row adjusted', () => {
      expect(state.col).to.eql(2);
      expect(state.row).to.eql(1);
    });

    it('should have str cut by length of given text', () => {
      expect(state.str).to.eql(' kota');
    });
  });

  describe('withPositionFromState', () => {
    it('should take position from other state and leave result intact', () => {
      const source = new State('s', 12, 101, 23);
      const result = [1, 2];
      const newState = new State('d', result, 0, 0)
        .withPositionFromState(source);

      expect(newState.col).to.eql(source.col);
      expect(newState.row).to.eql(source.row);
      expect(newState.str).to.eql(source.str);
      expect(newState.result).to.eql(result);
    });
  });
});
