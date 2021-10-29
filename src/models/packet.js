const packet = (id, data) => ({
  id: id,
  type: 'process:msg',
  data: { data: data },
  topic: true,
});

export default packet;
