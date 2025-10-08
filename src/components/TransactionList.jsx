
export default function TransactionList({ items = [], onDelete }) { // items = tapahtumat
  console.log('<TransactionList> render', { count: items.length });

  if (items.length === 0) return <p>Ei rivejä.</p>; //jos ei rivejä, näytetään viesti

  // taulukko, jossa rivit kartoitettu items-taulukosta
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Päivä</th>
          <th>Tyyppi</th>
          <th>Selite</th>
          <th>Vastapuoli</th>
          <th>Summa</th>
          <th>Maksettu</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map(t => (
          <tr key={t.id}>
            <td><time dateTime={t.paiva}>{t.paiva}</time></td>
            <td>{t.tyyppi}</td>
            <td>{t.selite}</td>
            <td>{t.vastapuoli}</td>
            <td className="summa">{t.summa.toFixed(2)}</td>
            <td>{t.maksettu ? <span className="badge-paid">✓</span> : "–"}</td>
            <td>
              <button onClick={() => onDelete?.(t)}>Poista</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

}
