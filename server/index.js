const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Alkuarvo tapahtumat (id, paiva, tyyppi, selite, vastapuoli, summa, maksettu)
let transactions = [
  { id: '1', paiva: '2025-10-07', tyyppi: 'myynti', selite: 'Konsultointi', vastapuoli: 'Asiakas Oy', summa: 120, maksettu: true },
  { id: '2', paiva: '2025-10-06', tyyppi: 'osto',   selite: 'Sovellus',     vastapuoli: 'Kehittäjä Oy',   summa: 50,  maksettu: false }
];

app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
  const { paiva, tyyppi, selite, vastapuoli = '', summa, maksettu = false } = req.body;

  if (!paiva || !selite || !['myynti','osto'].includes(tyyppi) || typeof summa !== 'number' || !(summa > 0)) {
    return res.status(400).json({ error: 'invalid transaction' });
  }

  const tx = { id: randomUUID(), paiva, tyyppi, selite, vastapuoli, summa, maksettu: !!maksettu };
  transactions = [tx, ...transactions];
  res.status(201).json(tx);
});

app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const before = transactions.length;
  transactions = transactions.filter(t => t.id !== id);
  if (transactions.length === before) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
