// eslint-disable-next-line no-unused-vars
const packet = (id, filename) => ({
  id: id,
  type: 'process:msg',
  data: { filename: filename },
  topic: true,
});

export default packet;
