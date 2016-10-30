export function assign<T>(...objects: Array<{[key: string]: T}>): {[key: string]: T} {
  return objects.reduce((current, next) => {
    const result: {[key: string]: T} = {};

    Object
      .keys(current)
      .forEach(key => {
        result[key] = current[key];
      });

    Object
      .keys(next)
      .forEach(key => {
        result[key] = next[key];
      });

    return result;
  }, {});
}