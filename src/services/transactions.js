import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/transactions';

const getAll = async () => {
  const res = await axios.get(baseUrl);
  console.log('[GET]', res.data);
  return res.data;
};

const create = async (tx) => {
  const res = await axios.post(baseUrl, tx);
  console.log('[POST]', res.data);
  return res.data;
};

const remove = async (id) => {
  const res = await axios.delete(`${baseUrl}/${id}`);
  console.log('[DELETE]', id, res.status);
  return res.status === 204;
};

export default { getAll, create, remove };
