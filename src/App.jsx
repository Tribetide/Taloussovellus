import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import transactionService from './services/transactions';


// Pääkomponentti
export default function App() {
  const [transactions, setTransactions] = useState([]); // tapahtumat
  const [filter, setFilter] = useState({ text: "", type: "all"}); // suodatin

  // Haetaan tapahtumat palvelimelta
  useEffect(() => {
  transactionService.getAll().then(setTransactions);
  }, []);

  // Lisää tapahtuma
   const handleAdd = async (tx) => {
    console.log("[App] add", tx);
    const saved = await transactionService.create(tx); // palvelimelta tallennettu
      setTransactions(prev => [saved, ...prev]); // lisätään alkuun
  };

  const handleDelete = async (tx) => {
    console.log("[App] delete", tx);
    await transactionService.remove(tx.id); // poistetaan palvelimelta
    setTransactions(prev => prev.filter(t => t.id !== tx.id)); // suodata pois
  }

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
      <TransactionList items={visible} onDelete={handleDelete} />
    </main>
  );
  
}


