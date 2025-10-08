import axios from 'axios';

const baseUrl =
import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/transactions'; // palvelimen osoite

const getAll = async () => { // hae kaikki
  const res = await axios.get(baseUrl); // axios palauttaa vastauksen oliona
  console.log('[GET]', res.data);
  return res.data;
};

const create = async (tx) => { // luo uusi
  const res = await axios.post(baseUrl, tx); // tx = lähetettävä tapahtuma
  console.log('[POST]', res.data);
  return res.data;
};

const remove = async (id) => { // poista id:llä
  const res = await axios.delete(`${baseUrl}/${id}`); // ei dataa
  console.log('[DELETE]', id, res.status);
  return res.status === 204;
};

export default { getAll, create, remove };
