import { useEffect, useState } from "react";

const API = "http://localhost:3001/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    itemName: "",
    itemCategory: "",
    itemPrice: "",
    status: ""
  });

  const fetchItems = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const submitItem = async () => {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ itemName: "", itemCategory: "", itemPrice: "", status: "" });
    fetchItems();
  };

  const deleteItem = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Item Manager</h2>

      <input placeholder="Name" value={form.itemName}
        onChange={e => setForm({ ...form, itemName: e.target.value })} />

      <input placeholder="Category" value={form.itemCategory}
        onChange={e => setForm({ ...form, itemCategory: e.target.value })} />

      <input placeholder="Price" value={form.itemPrice}
        onChange={e => setForm({ ...form, itemPrice: e.target.value })} />

      <input placeholder="Status" value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })} />

      <button onClick={submitItem}>Add Item</button>

      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.itemName} - {item.itemCategory} - {item.itemPrice} - {item.status}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
