// services/mlAnalysis.js
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 800; const height = 450;
const canvas = new ChartJSNodeCanvas({ width, height });

export async function barFinanceChart({ cashCollected = 0, onlineCollected = 0 }) {
  const config = {
    type: "bar",
    data: {
      labels: ["Cash", "Online"],
      datasets: [{ label: "Collections (₹)", data: [cashCollected, onlineCollected] }]
    },
    options: { plugins: { legend: { display: false } } }
  };
  return canvas.renderToBuffer(config);
}

export async function piePaymentChart({ cashCollected = 0, onlineCollected = 0 }) {
  const config = {
    type: "pie",
    data: {
      labels: ["Cash", "Online"],
      datasets: [{ data: [cashCollected, onlineCollected] }]
    }
  };
  return canvas.renderToBuffer(config);
}

// sample for registrations over time (requires registration totals per day)
export async function lineRegistrationsChart({ dates = [], counts = [] }) {
  const config = {
    type: "line",
    data: {
      labels: dates,
      datasets: [{ label: "Registrations", data: counts, fill: false }],
    }
  };
  return canvas.renderToBuffer(config);
}
