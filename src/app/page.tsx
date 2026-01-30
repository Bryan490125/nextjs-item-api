"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    itemName: "",
    itemCategory: "",
    itemPrice: "",
    status: "",
  });

  const loadItems = async () => {
    const res = await fetch(`/api/items?page=${page}`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, [page]);

  const addItem = async () => {
    await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify(form),
    });
    loadItems();
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    loadItems();
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Item CRUD</h1>

      <input placeholder="Name" onChange={e => setForm({...form, itemName: e.target.value})} />
      <input placeholder="Category" onChange={e => setForm({...form, itemCategory: e.target.value})} />
      <input placeholder="Price" onChange={e => setForm({...form, itemPrice: e.target.value})} />
      <input placeholder="Status" onChange={e => setForm({...form, status: e.target.value})} />
      <button onClick={addItem}>Add Item</button>

      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.itemName} - {item.itemPrice}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </main>
  );
}
