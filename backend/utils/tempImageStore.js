// const Redis = require('ioredis');
// const redis = new Redis(); 

// const TEMP_IMAGE_EXPIRATION = 60 * 15; // 15 minutes in seconds

const tempImageStore = new Map();

function saveTempAvatar(buffer) {
  const id = `${Date.now()}-${Math.random()}`;
  tempImageStore.set(id, buffer);
  return id;
}

// async function saveTempAvatar(buffer) {
//   const id = `${Date.now()}-${Math.random()}`;
//   await redis.set(id, buffer.toString('base64'), 'EX', TEMP_IMAGE_EXPIRATION);
//   return id;
// }

function getTempAvatar(id) {
  return tempImageStore.get(id);
}

// async function getTempAvatar(id) {
//   const base64 = await redis.get(id);
//   return base64 ? Buffer.from(base64, 'base64') : null;
// }
function deleteTempAvatar(id) {
  return tempImageStore.delete(id);
}
// async function deleteTempAvatar(id) {
//   const result = await redis.del(id);
//   return result === 1;
// }

module.exports = {
  saveTempAvatar,
  getTempAvatar,
  deleteTempAvatar,
};




