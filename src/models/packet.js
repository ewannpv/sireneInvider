const packet = (id, data) => ({
  type: 'process:msg',
  data: { data: data },
  id: id,
});

export default packet;
