// Yhteenveto komponentti, laskee ja näyttää yhteenvedon
const euro = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' });

// props: items = tapahtumat
const Summary = ({ items = [] }) => {
  // Kerää luvut yhdellä reduce-kierroksella
  const acc = items.reduce(
    (a, t) => {
      a.count += 1;
      if (t.tyyppi === 'myynti') a.sales += t.summa; // myynti
      else if (t.tyyppi === 'osto') a.purchases += t.summa; // ostot

      if (t.maksettu) a.paid += t.summa; // maksetut
      else a.unpaid += t.summa; // maksamattomat

      return a;
    },

    { count: 0, sales: 0, purchases: 0, paid: 0, unpaid: 0 } // alkutila
  );
  const net = acc.sales - acc.purchases; // netto = myynnit - ostot

  console.log('<Summary> render', { ...acc, net });

  return (
    <section className="summary">
      <div><span>Myynnit</span><strong>{euro.format(acc.sales)}</strong></div>
      <div><span>Ostot</span><strong>{euro.format(acc.purchases)}</strong></div>
      <div><span>Netto</span><strong>{euro.format(net)}</strong></div>
      <div><span>Rivejä</span><strong>{acc.count}</strong></div>
      <div><span>Maksettu</span><strong>{euro.format(acc.paid)}</strong></div>
      <div><span>Avoinna</span><strong>{euro.format(acc.unpaid)}</strong></div>
    </section>
  );
};

export default Summary;
