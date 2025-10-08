// Pääkomponentti, sovelluksen juurikomponentti
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import transactionService from './services/transactions';
import Summary from './components/Summary';


// Pääkomponentti
export default function App() {
  const [transactions, setTransactions] = useState([]); // tapahtumat
  const [filter, setFilter] = useState({ text: "", type: "all"}); // suodatin
  const [loading, setLoading] = useState(true); // lataus-tila
  const [error, setError]   = useState(null); // virheviesti

  // Haetaan tapahtumat palvelimelta
  useEffect(() => { // komponentti renderöityi, lataa data
    let ignore = false;  // peruttu
    setLoading(true); // käynnissä
    transactionService.getAll() // hae kaikki
      .then(data => { if (!ignore) setTransactions(data); }) // asetetaan data tilaan
      .catch(error => { if (!ignore) { console.error(error); setError('Lataus epäonnistui'); }}) // virhe
      .finally(() => { if (!ignore) setLoading(false); }); // valmis
    return () => { ignore = true; }; // peruutus
  }, []);

  // Lisää tapahtuma
   const handleAdd = async (tx) => {
    try {
      const saved = await transactionService.create(tx); // tallenna palvelimelle
      setTransactions(prev => [saved, ...prev]); // lisää tilaan
    } catch (error) {
      console.error(error);
      alert('Tallennus epäonnistui');
    }
  };

  // Poista tapahtuma 
  const handleDelete = async (tx) => {
    const prev = transactions;                  // talleta vanha tila
    setTransactions(p => p.filter(t => t.id !== tx.id)); // poista tilasta
    try {
      await transactionService.remove(tx.id); // poista palvelimelta
    } catch (error) {
      console.error(error);
      alert('Poisto epäonnistui — peruutetaan');
      setTransactions(prev);                           // revert
    }
  };

  // Vaihda maksettu-tila 
  const handleTogglePaid = async (tx) => {
    const optimistic = { ...tx, maksettu: !tx.maksettu }; // käännä maksettu
    const prev = transactions; // talleta vanha tila
    setTransactions(p => p.map(t => (t.id === tx.id ? optimistic : t))); 
    try {
      const saved = await transactionService.update(tx.id, optimistic); // päivitä palvelimelle
      setTransactions(p => p.map(t => (t.id === tx.id ? saved : t))); // korjaa tila palvelimen vastauksella
    } catch (error) {
      console.error(error);
      alert('Päivitys epäonnistui — peruutetaan');
      setTransactions(prev);
    }
  };
  
  // Suodatetaan tapahtumia filterillä
  const q = filter.text.toLowerCase().trim(); // haun termi pienaakkosina
  const visible = transactions.filter(t => { // suodatetaan
    const matchesType = filter.type === "all" || t.tyyppi === filter.type; // all tai tyyppi sopii
    const hay = `${t.selite} ${t.vastapuoli}`.toLowerCase(); // selite + vastapuoli pienaakkosina
    const matchesText = q === "" || hay.includes(q); // teksti sopii
    return matchesType && matchesText; // molemmat ehdot toteutuvat
  });

  // Järjestetään tapahtumat päivämäärän mukaan (uusin ensin)
  const visibleSorted = [...visible].sort((a, b) => b.paiva.localeCompare(a.paiva));

  // Debug-tulostukset
  console.log('<App> render',{
    transactionsCount: transactions.length, // kaikki tapahtumat
    filter, // suodatin
    visibleCount: visible.length, // näkyvissä olevat
  });

  // JSX, UI, renderöinti

    if (loading) { // lataus
    return (
      <main className="container">
        <h1>Taloussovellus</h1>
        <p>Ladataan…</p>
      </main>
    );
  }
  
  return ( // Valmis UI
    <main className="container">
      <h1>Taloussovellus</h1>
      {error && <p>{error}</p>}
      <TransactionForm onAdd={handleAdd} /> 
      <Filter value={filter} onChange={setFilter} />
      <h3>Yhteenveto</h3>
      <Summary items={visible} />
      <h3>Tapahtumat ({visibleSorted.length})</h3>
      <TransactionList items={visibleSorted} onDelete={handleDelete} onTogglePaid={handleTogglePaid} />
    </main>
  );
  
}

