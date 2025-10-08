import { useState } from 'react';

// Tyhjä tapahtuma
const empty = {
  paiva: "",
  tyyppi: "myynti",
  selite: "",
  vastapuoli: "",
  summa: "", // string, muunnetaan numeroksi 
  maksettu: false,
};

// Lomakekomponentti
export default function TransactionForm({ onAdd }) { // onAdd = lisäysfunktio
  console.log('<TransactionForm> render');
  const [form, setForm] = useState(empty); // lomakedata

  // Lomakkeen kenttien muutokset
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value })); // checkboxin arvo checked, muut value
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // validointi
    const summaNum = Number(form.summa); // yritä muuntaa numeroksi
    if (!form.paiva) return alert("Anna päivä");
    if (!form.tyyppi) return alert("Anna tyyppi.");
    if (!form.selite) return alert("Anna selite");
    if (!(summaNum > 0)) return alert("Anna positiivinen summa");
    if (!form.vastapuoli) return alert("Anna vastapuoli");

    // luo uusi tapahtuma, kutsu yläkomponentin funktiota
    const tx = {
      paiva: form.paiva,
      tyyppi: form.tyyppi,
      selite: form.selite.trim(),
      vastapuoli: form.vastapuoli.trim(),
      summa: summaNum,          // numero, ei string
      maksettu: form.maksettu
    };

    // debug-tulostus
    console.log("[submit] add tx", tx);
    onAdd(tx); // kutsu yläkomponentin funktiota
    setForm(empty); // tyhjennä lomake
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <input type='date' name='paiva' value={form.paiva} onChange={handleChange} 
      required 
      />
      <select name="tyyppi" value={form.tyyppi} onChange={handleChange}>
        <option value="myynti">Myynti</option>
        <option value="osto">Osto</option>
      </select>
      <input
        name="selite" placeholder="Selite" value={form.selite} onChange={handleChange}
        required
      />
      <input
        name="vastapuoli" placeholder="Vastapuoli" value={form.vastapuoli} onChange={handleChange}
      />
      <input
        type="number" step="0.01" name="summa" placeholder="0.00"
        value={form.summa} onChange={handleChange} required
      />
      <label style={{ display:"flex", alignItems:"center", gap:6 }}>
        <input type="checkbox" name="maksettu" checked={form.maksettu} onChange={handleChange}/>
        Maksettu
      </label>

      <button type="submit">Lisää</button>
    </form>
  );
}

