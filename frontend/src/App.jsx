import { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [input, setInput] = useState('["A->B","A->C","B->D"]');
  const [data, setData] = useState(null);

  const send = async () => {
    try {
      const res = await axios.post("http://localhost:3000/bfhl", {
        data: JSON.parse(input),
      });
      setData(res.data);
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="container">
      <h1>Hierarchy Builder</h1>

      <div className="card">
        <h3>Input</h3>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={send}>Submit</button>
      </div>

      {data && (
        <>
          <div className="card">
            <h3>Summary</h3>
            <p>Total Trees: {data.summary.total_trees}</p>
            <p>Total Cycles: {data.summary.total_cycles}</p>
            <p>Largest Root: {data.summary.largest_tree_root}</p>
          </div>

          {data.hierarchies.map((h, i) => (
            <div key={i} className="card">
              <h3>Root: {h.root}</h3>
              {h.has_cycle ? (
                <p style={{ color: "red" }}>Cycle detected</p>
              ) : (
                <>
                  <p>Depth: {h.depth}</p>
                  <Tree tree={h.tree} />
                </>
              )}
            </div>
          ))}

          <div className="card">
            <h3>Invalid Entries</h3>
            <p>{data.invalid_entries.join(", ") || "None"}</p>
          </div>

          <div className="card">
            <h3>Duplicate Edges</h3>
            <p>{data.duplicate_edges.join(", ") || "None"}</p>
          </div>
        </>
      )}
    </div>
  );
}

function Tree({ tree }) {
  return (
    <div className="tree">
      {Object.entries(tree).map(([key, value]) => (
        <div key={key} className="node">
          ▸ {key}
          <Tree tree={value} />
        </div>
      ))}
    </div>
  );
}