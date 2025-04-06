
const tempImageStore = new Map();

function saveTempAvatar(buffer) {
  const id = `${Date.now()}-${Math.random()}`;
  tempImageStore.set(id, buffer);
  return id;
}

function getTempAvatar(id) {
  return tempImageStore.get(id);
}

function deleteTempAvatar(id) {
  return tempImageStore.delete(id);
}

module.exports = {
  saveTempAvatar,
  getTempAvatar,
  deleteTempAvatar,
};
