"use client";
import { useState, useEffect, useRef } from 'react';

export default function SpeedTest() {
  const [mbps, setMbps] = useState("0.00");
  const [status, setStatus] = useState("Idle");
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Worker from the public folder
    workerRef.current = new Worker('/workers/speed.worker.js');

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'update') setMbps(e.data.mbps);
      if (e.data.type === 'done') setStatus("Finished");
    };

    return () => workerRef.current?.terminate();
  }, []);

  const runTest = () => {
    setStatus("Testing...");
    workerRef.current?.postMessage({ action: 'start' });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-10">Network Speed Test</h1>

      <div className="w-64 h-64 rounded-full border-8 border-blue-500 flex flex-col items-center justify-center">
        <span className="text-5xl font-mono">{mbps}</span>
        <span className="text-blue-400 font-bold">Mbps</span>
      </div>

      <button 
        onClick={runTest}
        className="mt-12 px-10 py-4 bg-blue-600 rounded-full font-bold hover:bg-blue-500 transition"
      >
        {status === "Testing..." ? "Testing..." : "Begin Test"}
      </button>
    </main>
  );
}