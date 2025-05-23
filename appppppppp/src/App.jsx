import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  addDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAepH5AQMWa8JJ-DucbgU8X3RyJUFKsEMA",
  authDomain: "essenapp.firebaseapp.com",
  projectId: "essenapp",
  storageBucket: "essenapp.firebasestorage.app",
  messagingSenderId: "164518584114",
  appId: "1:164518584114:web:4f76c259c289602fa5012b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [dish, setDish] = useState("");
  const [currentDish, setCurrentDish] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [hostKey, setHostKey] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "essen", "heute"), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentDish(docSnap.data().gericht || "");
      }
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      const all = [];
      snap.forEach((doc) => all.push(doc.data()));
      setOrders(all);
    });

    return () => {
      unsub();
      unsubOrders();
    };
  }, []);

  const setDishInFirestore = async () => {
    await setDoc(doc(db, "essen", "heute"), { gericht: dish });
    setDish("");
  };

  const submitOrder = async () => {
    if (!name.trim() || quantity < 1) return;
    await addDoc(collection(db, "orders"), { name, quantity });
    setName("");
    setQuantity(1);
  };

  const total = orders.reduce((sum, o) => sum + o.quantity, 0);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">🍽️ Essensbestellung</h1>

      {!isHost && (
        <div className="p-4 bg-yellow-100 rounded-xl shadow">
          <h2 className="font-semibold">Host-Zugang</h2>
          <input
            type="password"
            className="w-full mt-2 p-2 border rounded"
            placeholder="Passwort eingeben"
            value={hostKey}
            onChange={(e) => setHostKey(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={() => {
              if (hostKey === "geheim") {
                setIsHost(true);
              } else {
                alert("Falsches Passwort");
              }
              setHostKey("");
            }}
          >
            Anmelden
          </button>
        </div>
      )}

      {isHost && (
        <div className="p-4 bg-gray-100 rounded-xl shadow">
          <h2 className="font-semibold">Gericht des Tages festlegen</h2>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded"
            placeholder="z.B. Spaghetti Bolognese"
            value={dish}
            onChange={(e) => setDish(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={setDishInFirestore}
          >
            Gericht einstellen
          </button>
        </div>
      )}

      {currentDish && (
        <div className="p-4 bg-white border rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold">Gericht des Tages: {currentDish}</h2>

          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Dein Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              min={1}
              className="w-full p-2 border rounded"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={submitOrder}
            >
              Bestellung abschicken
            </button>
          </div>

          <div className="pt-4">
            <h3 className="font-semibold">Bestellungen:</h3>
            <ul className="list-disc list-inside">
              {orders.map((order, i) => (
                <li key={i}>
                  {order.name} bestellt {order.quantity} Portion(en)
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Gesamt: {total} Portion(en)</p>
          </div>
        </div>
      )}
    </div>
  );
}