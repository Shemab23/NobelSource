This is the final piece of the puzzle. If the **Service Layer (.ts)** is the engine, the **Hook** is the dashboard. It connects the "dirty work" to your UI components while managing the emotional state of the app (Waiting, Success, or Failure).

---

## 6. Hydrate in Hooks (`hooks/detail.md`)

A custom hook is a function that uses React's `useState` and `useEffect` to manage data fetching. It ensures that your UI is always "Hydrated" with the latest information without the component having to know *how* that data was fetched.

### Why use a Hook?
* **Encapsulation**: Your UI component stays "calm." It doesn't care about `fetch`, `headers`, or `localStorage`.
* **Reusability**: You can use `useShipments()` in a dashboard, a sidebar, or a mobile view—it always works the same way.
* **Automatic Updates**: When the state inside the hook changes, React automatically re-renders the component.



---

### The Hook Structure (Example)

```typescript
import { useState, useEffect } from 'react';
import { chamberService } from '../services/chamber.ts';
import { Shipment } from '../types';

export function useShipments() {
  // 1. STATE: Memory for the UI
  const [data, setData] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. THE HYDRATOR: The bridge to the Service
  const hydrate = async () => {
    try {
      setLoading(true);
      // We call the orchestrator (dirty work file)
      const result = await chamberService.getShipments();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 3. LIFECYCLE: Auto-run when the page loads
  useEffect(() => {
    hydrate();
  }, []); // Run once on mount

  // 4. EXPORTS: What the UI gets to use
  return { data, loading, error, refresh: hydrate };
}
```

---

### How the UI Uses the Hook

Your `Chamber.tsx` remains clean and focused only on the layout.

```tsx
import { useShipments } from "@/hooks/useShipments";

export function ChamberView() {
  // The Orchestrator delivers everything ready-to-use
  const { data, loading, error, refresh } = useShipments();

  // Handle "Waiting" (Skeleton logic)
  if (loading) return <div className="chamber-surface animate-pulse h-40" />;

  // Handle "Failure"
  if (error) return <p className="text-destructive">Error: {error}</p>;

  // Handle "Success" (Rendering the hydrated object)
  return (
    <div className="space-y-4">
      <button onClick={refresh} className="interactive-quiet">Sync Data</button>
      {data.map(ship => (
        <div key={ship.id} className="chamber-surface p-4">
          <span className="label-serious">ID: {ship.id}</span>
          <p className="heading-chamber">{ship.status}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 🏛️ Summary Table: Hook vs. Service

| Feature | Service Layer (`.ts`) | Hook Layer (`useX.ts`) |
| :--- | :--- | :--- |
| **Responsibility** | API calls, Formatting, LS | UI State (Loading/Error/Data) |
| **Tools** | `fetch`, `localStorage` | `useState`, `useEffect` |
| **Context** | Pure Logic (No React) | React Environment |
| **Logic** | "How to get the data" | "When to show the data" |



### 📋 Mini Code Audit (Common Struggles)
1.  **Infinite Loops**: If you try to update the state inside the `hydrate` function and don't wrap it in `useEffect`, you might trigger a loop. Always keep your fetch calls inside `useEffect`.
2.  **Stale Data**: When you do a `POST` or `DELETE` in your Service, the Hook won't know unless you call `refresh()`. Always export a way to re-trigger the hydration.

This completes your architecture. You have a **Design System** (CSS), a **Type System** (Interfaces), a **Logic Layer** (Service), and a **State Manager** (Hooks). You're ready to build.
