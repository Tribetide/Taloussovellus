import { useState } from 'react'
import Filter from './components/Filter'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm' 

// Alkuarvot
const initial = [ 
  { id: "1", paiva: "2025-10-07", tyyppi: "myynti", selite: "Konsultointi", vastapuoli: "Asiakas Oy", summa: 120, maksettu: true },
  { id: "2", paiva: "2025-10-06", tyyppi: "osto",   selite: "Sovellus", vastapuoli: "Kehittäjä Oy",   summa: 50,  maksettu: false },
];

// Pääkomponentti
export default function App() {
  const [transactions, setTransactions] = useState(initial); // tapahtumat
  const [filter, setFilter] = useState({ text: "", type: "all"}); // suodatin

  // Lisää tapahtuma
   const handleAdd = (tx) => {
    console.log("[App] add", tx);
    setTransactions(prev => [tx, ...prev]); // uusin ensin
  };

  // Suodatetaan tapahtumia filterillä
  const q = filter.text.toLowerCase().trim(); // haun termi pienaakkosina
  const visible = transactions.filter(t => { // suodatetaan
    const matchesType = filter.type === "all" || t.tyyppi === filter.type; // all tai tyyppi sopii
    const hay = `${t.selite} ${t.vastapuoli}`.toLowerCase(); // selite + vastapuoli pienaakkosina
    const matchesText = q === "" || hay.includes(q); // teksti sopii
    return matchesType && matchesText; // molemmat ehdot toteutuvat
  });

  // Debug-tulostukset
  console.log('<App> render',{
    transactionsCount: transactions.length, // kaikki tapahtumat
    filter, // suodatin
    visibleCount: visible.length, // näkyvissä olevat
  });


  return (
    <main className="container">
      <h1>Taloussovellus</h1>
      <TransactionForm onAdd={handleAdd} /> 
      <Filter value={filter} onChange={setFilter} />
      <TransactionList items={visible} />
    </main>
  );
  
}


