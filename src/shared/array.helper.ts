//https://gist.github.com/robinduckett/6e59aaadf0f74f1f68602a9ca8b0d202

export type MultiDimensionalArray<T> = (T | (T | T[])[])[];

export const flatten = <T>(arr: MultiDimensionalArray<T>): T[] => {
  let flatArray: T[] = [];

  arr.forEach((element) => {
    if (Array.isArray(element)) {
      flatArray = flatArray.concat(flatten(element));
    } else {
      flatArray.push(element);
    }
  });

  return flatArray;
};
