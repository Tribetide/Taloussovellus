# Taloussovellus (React + Express)

Yksinkertainen taloussovellus, jossa voi lisätä **myynti/osto**-kirjauksia, suodattaa niitä ja hallita “Maksettu”-tilaa. Selain on tehty Reactilla (Vite), palvelin Expressillä. Data on tämän MVP-version ajan **palvelimen muistissa**.

## Ominaisuudet (MVP)
- Kontrolloitu **lomake** uuden kirjauksen lisäämiseen
- **Lista** + **tekstifiltteri** (selite/vastapuoli) + **tyyppifiltteri** (myynti/osto)
- **Maksettu-toggle** (PUT) ja **poisto** (DELETE, optimistinen päivitys + revert virheessä)
- **Yhteenveto** (rivit, myynnit, ostot, netto, maksettu, avoinna) `Array.reduce`-laskennalla
- Datan haku `useEffect`illa + **axios**in kautta erillisessä **services/**-kerroksessa
- **Express-API**, **CORS**, **404 unknown endpoint** ja **virheenkäsittely-middleware**

## Rakenne
```
.
├─ src/
│ ├─ components/
│ │ ├─ TransactionForm.jsx
│ │ ├─ TransactionList.jsx
│ │ ├─ Filter.jsx
│ │ └─ Summary.jsx
│ ├─ services/
│ │ └─ transactions.js
│ ├─ App.jsx
│ ├─ main.jsx
│ └─ index.css
├─ server/
│ ├─ index.js
│ ├─ package.json
│ └─ .env.example
├─ requests.http
├─ .env.example
├─ package.json
└─ README.md
```

## Teknologiat
React 18, Vite, axios · Express 4, cors, nodemon

## Käynnistys
**1) Frontend (juuri):**
```bash
npm install
npm run dev
```
Sovellus: http://localhost:5173

**2) Backend (server/):**
```bash

cd server
npm install
npm run dev
```
API: http://localhost:3001/api/transactions

## Testaus
APIn nopea testaus `requests.http`-tiedoston avulla (VSCode-laajennus: REST Client). Muista ensin käynnistää palvelin (katso yllä).

### API-pyynnöt

### Hae kaikki kirjaukset
GET {{base}}/api/transactions

### Hae yksittäinen kirjaus
GET {{base}}/api/transactions/{{id}}

### Poista kirjaus
DELETE {{base}}/api/transactions/{{id}}

### Luo uusi kirjaus
POST {{base}}/api/transactions
Content-Type: application/json
{
  "paiva": "2025-10-08",
  "tyyppi": "myynti",
  "selite": "Testimyynti",
  "vastapuoli": "Testi Oy",
  "summa": 123.45,
  "maksettu": false
}

### Päivitä kirjaus (muuta arvoja)
PUT {{base}}/api/transactions/{{id}}
Content-Type: application/json
{
  "paiva": "2025-10-08",
  "tyyppi": "myynti",
  "selite": "Testimyynti",
  "vastapuoli": "Testi Oy",
  "summa": 126.45,
  "maksettu": false
}



