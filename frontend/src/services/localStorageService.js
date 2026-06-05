// LocalStorage Service Layer
const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveData = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); return true; }
  catch { return false; }
};

const updateData = (key, id, updatedItem) => {
  const items = getData(key);
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem };
    saveData(key, items);
    return true;
  }
  return false;
};

const deleteData = (key, id) => {
  const items = getData(key);
  const filtered = items.filter(item => item.id !== id);
  saveData(key, filtered);
  return true;
};

const addData = (key, item) => {
  const items = getData(key);
  items.push(item);
  saveData(key, items);
  return item;
};

const getById = (key, id) => {
  const items = getData(key);
  return items.find(item => item.id === id) || null;
};

export { getData, saveData, updateData, deleteData, addData, getById };
