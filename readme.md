#Parser Lib

Goal of this library is to create enable easy and type safe creation of
parsers runable in all javascript environments. 
It is inspired by [haskell parsec](https://hackage.haskell.org/package/parsec) library.

##Examples

Parsing simple integer

```typescript
const num = integer
    .parseText('11')
    .map(state => state.result)
    .getOrElse(0);
    
console.log(num); // 11
```

For more example look in test/ directory. Test cases should be simple enough to read.