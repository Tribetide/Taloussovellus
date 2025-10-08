const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express(); // luo Express-sovellus
app.use(cors()); // salli CORS
app.use(express.json()); // json-käsittely

// Alkuarvo tapahtumat (id, paiva, tyyppi, selite, vastapuoli, summa, maksettu)
let transactions = [
  { id: '1', paiva: '2025-10-07', tyyppi: 'myynti', selite: 'Konsultointi', vastapuoli: 'Asiakas1 Oy', summa: 120, maksettu: true },
  { id: '2', paiva: '2025-10-06', tyyppi: 'osto',   selite: 'Sovellus',     vastapuoli: 'Kehittäjä Oy',   summa: 50,  maksettu: false },
  { id: '3', paiva: '2025-10-08', tyyppi: 'myynti', selite: 'Konsultointi', vastapuoli: 'Asiakas2 Oy', summa: 136.99, maksettu: true },
  { id: '4', paiva: '2025-10-05', tyyppi: 'osto',   selite: 'Lounas',     vastapuoli: 'Ravintola Oy',   summa: 22.49,  maksettu: true }
];

// Hae kaikki tapahtumat
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// Lisää tapahtuma
app.post('/api/transactions', (req, res) => {
  const { paiva, tyyppi, selite, vastapuoli = '', summa, maksettu = false } = req.body;

  if (!paiva || !selite || !['myynti','osto'].includes(tyyppi) || typeof summa !== 'number' || !(summa > 0)) {
    return res.status(400).json({ error: 'invalid transaction' });
  }
  // Luo uusi tapahtuma
  const tx = { id: randomUUID(), paiva, tyyppi, selite, vastapuoli, summa, maksettu: !!maksettu };
  transactions = [tx, ...transactions];
  res.status(201).json(tx);
});

// Poista tapahtuma id:llä
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const before = transactions.length;
  transactions = transactions.filter(t => t.id !== id);
  if (transactions.length === before) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

// Päivitä tapahtuma id:llä
app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const i = transactions.findIndex(t => t.id === id);
  if (i === -1) return res.status(404).json({ error: 'not found' });

  const { paiva, tyyppi, selite, vastapuoli = '', summa, maksettu = false } = req.body;
  if (!paiva || !selite || !['myynti','osto'].includes(tyyppi) || typeof summa !== 'number' || !(summa > 0)) {
    return res.status(400).json({ error: 'invalid transaction' });
  }

  const updated = { id, paiva, tyyppi, selite, vastapuoli, summa, maksettu: !!maksettu };
  transactions[i] = updated;
  res.json(updated);
});

// Käynnistä palvelin
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});

// 404: tuntematon reitti
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
});

// Virheenkäsittely
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'server error' });
});