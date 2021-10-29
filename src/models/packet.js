const packet = (index, data) => ({
  id: index,
  type: 'process:msg',
  data,
  topic: true,
});

export default packet;
