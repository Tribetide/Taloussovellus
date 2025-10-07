export default function Filter({ value, onChange }) {
    console.log('<Filter> render', value);

    const onText = (e) => onChange({ ...value, text: e.target.value });

    const onType = (e) => onChange({ ...value, type: e.target.value });

    return (
    <section className="filter">
        <input
            placeholder="Haku (selite tai vastapuoli)"
            value={value.text}
            onChange={onText}
        />
        <select value={value.type} onChange={onType}>
            <option value="all">Kaikki</option>
            <option value="myynti">Myynti</option>
            <option value="osto">Osto</option>
            </select>
        </section>
    );
}