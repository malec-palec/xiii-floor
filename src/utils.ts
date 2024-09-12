export const delay = (ms: number): Promise<unknown> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const createObjectPool = <T>(
  create: () => T,
  reset?: (obj: T) => void,
): {
  free(obj: T): void;
  alloc(): T;
  getSize(): number;
  dispose(): void;
} => {
  const objects: Array<T> = [];
  // let allocCount = 0;
  // let freeCount = 0;
  return {
    free(obj: T) {
      if (reset) reset(obj);
      // freeCount++;
      objects.push(obj);
    },
    alloc(): T {
      if (objects.length > 0) {
        return objects.pop()!;
      }
      // allocCount++;
      return create();
    },
    getSize() {
      return objects.length;
    },
    dispose() {
      objects.length = 0;
    },
  };
};

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

// https://github.com/eliasku/13/blob/master/packages/client/src/utils/raf.ts
export const setupRAF = (callback: (now: DOMHighResTimeStamp) => void): void => {
  let then = performance.now();
  const animateLoop = (now: DOMHighResTimeStamp, frameRateCap = 60) => {
    requestAnimationFrame(animateLoop);
    const delta = now - then;
    const tolerance = 0.1;
    const interval = 1000 / frameRateCap;
    if (delta >= interval - tolerance) {
      then = now - (delta % interval);
      callback(now);
    }
  };
  requestAnimationFrame(animateLoop);
};
