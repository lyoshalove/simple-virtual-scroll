export const debounce = (fn: () => void, ms: number = 500) => {
  let timerId: NodeJS.Timeout | null = null;

  return () => {
    timerId && clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn();
      timerId = null;
    }, ms);
  };
};
