export const throttle = (fn: () => void, ms: number = 500) => {
  let timerId: NodeJS.Timeout | null = null;

  return () => {
    if (timerId) {
      return;
    }

    timerId = setTimeout(() => {
      fn();
      timerId && clearTimeout(timerId);
    }, ms);
  };
};
