#Parser Lib

Goal of this library is to create enable easy and type safe creation of
parsers runable in all javascript environments. 
It is inspired by [haskell parsec](https://hackage.haskell.org/package/parsec) library.

[![Build Status](https://travis-ci.org/sielakos/parser-lib.svg?branch=master)](https://travis-ci.org/sielakos/parser-lib)
[![dependencies Status](https://david-dm.org/sielakos/parser-lib/status.svg)](https://david-dm.org/sielakos/parser-lib)
[![devDependencies Status](https://david-dm.org/sielakos/parser-lib/dev-status.svg)](https://david-dm.org/sielakos/parser-lib?type=dev)
[![npm](https://img.shields.io/npm/v/parser-lib.svg)](https://www.npmjs.com/package/parser-lib)

##Examples

###Parsing simple integer

```typescript
const num = integer
    .parseText('11')
    .map(state => state.result)
    .getOrElse(0);
    
console.log(num); // 11
```

###Simple mathematical interpreter

```typescript
let lvl3: Parser<any, number>;

const atom: Parser<any, number> = or(
  number,
  lazy(() =>
    between(
      keyword('(', false),
      keyword(')', false),
      lvl3
    )
  )
);

const lvl1: Parser<any, number> = chainRight(
  atom,
  operator('^', Math.pow)
);

const lvl2Op = or(
  operator('*', (a: number, b: number) => a * b),
  operator('/', (a: number, b: number) => a / b)
);

const lvl2: Parser<any, number> = chainLeft(lvl1, lvl2Op);

const lvl3Op = or(
  operator('+', (a: number, b: number) => a + b),
  operator('-', (a: number, b: number) => a - b)
);

lvl3 = chainLeft(lvl2, lvl3Op);
```

For more example look in test/ directory. Test cases should be simple enough to read.
