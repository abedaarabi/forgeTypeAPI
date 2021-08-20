//https://gist.github.com/robinduckett/6e59aaadf0f74f1f68602a9ca8b0d202

export const flatten = <T>(arr: (T | (T | T[])[])[]) => {
  let flatArray: T[] = [];

  arr.forEach((element) => {
    if (Array.isArray(element)) {
      const flattened = flatten(element);
      flatArray = flatArray.concat(flattened);
    } else {
      flatArray.push(element);
    }
  });

  return flatArray;
};

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
