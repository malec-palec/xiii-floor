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

export function logDebug(...messages: unknown[]): void {
  l.value += [...messages].map((o) => (typeof o === "object" ? JSON.stringify(o, null, 2) : o)).join(" ") + "\n";
  l.scrollTop = l.scrollHeight;
}
