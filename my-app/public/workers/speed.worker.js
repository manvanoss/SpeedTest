self.onmessage = async (e) => {
  if (e.data.action === 'start') {
    const testUrl = "http://localhost:8080/test.bin?nocache=" + Date.now();
    const startTime = performance.now();
    let loaded = 0;

    try {
      const response = await fetch(testUrl);
      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        loaded += value.byteLength;
        const elapsed = (performance.now() - startTime) / 1000;

        // Calculate Mbps: (Bytes * 8 bits) / (1024*1024) / seconds
        const mbps = (loaded * 8 / (1024 * 1024) / elapsed).toFixed(2);

        self.postMessage({ type: 'update', mbps });
      }
      self.postMessage({ type: 'done' });
    } catch (err) {
      self.postMessage({ type: 'error', message: err.message });
    }
  }
};