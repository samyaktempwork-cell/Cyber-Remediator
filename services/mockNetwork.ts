
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const randomLatency = (min = 500, max = 1500) => {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  return delay(ms);
};
