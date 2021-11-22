// eslint-disable-next-line no-unused-vars
export const packet = (id, filename) => ({
  id: id,
  type: 'process:msg',
  data: { filename: filename },
  topic: true,
});

export const signal = (id, filename) => ({
  id: id,
  type: 'process:msg',
  data: { signal: filename },
  topic: true,
});
