const brokers = ["Zerodha", "Upstox", "Angel One", "Groww", "ICICI Direct", "HDFC Securities", "Sharekhan"];
const segments = ["Intraday", "Delivery"];

document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("root");
  root.innerHTML = \`
    <h2>Brokerage Calculator</h2>
    <label>Broker: <select id="broker">\${brokers.map(b => \`<option>\${b}</option>\`).join('')}</select></label><br/>
    <label>Segment: <select id="segment">\${segments.map(s => \`<option>\${s}</option>\`).join('')}</select></label><br/>
    <label>Buy Price: <input type="number" id="buy" /></label><br/>
    <label>Sell Price: <input type="number" id="sell" /></label><br/>
    <label>Quantity: <input type="number" id="qty" /></label><br/>
    <button onclick="calculate()">Calculate</button>
    <div id="result" style="margin-top: 10px;"></div>
  \`;
});

function calculate() {
  const broker = document.getElementById("broker").value;
  const segment = document.getElementById("segment").value;
  const buy = parseFloat(document.getElementById("buy").value);
  const sell = parseFloat(document.getElementById("sell").value);
  const qty = parseInt(document.getElementById("qty").value);

  const turnover = (buy + sell) * qty;
  let brokerage = 0;
  if (["Zerodha", "Upstox", "Groww", "Angel One"].includes(broker)) {
    brokerage = segment === "Delivery" ? 0 : Math.min(20, 0.0003 * turnover);
  } else {
    brokerage = 0.0055 * turnover;
  }

  const stt = segment === "Delivery" ? 0.001 * sell * qty : 0.00025 * sell * qty;
  const exchange = 0.0000325 * turnover;
  const sebi = 0.000001 * turnover;
  const gst = 0.18 * (brokerage + exchange);
  const stamp = segment === "Delivery" ? 0.00015 * buy * qty : 0.00003 * buy * qty;
  const totalCharges = brokerage + stt + exchange + sebi + gst + stamp;
  const profit = (sell - buy) * qty - totalCharges;

  document.getElementById("result").innerHTML = \`
    <p>Brokerage: ₹\${brokerage.toFixed(2)}</p>
    <p>STT: ₹\${stt.toFixed(2)}</p>
    <p>Exchange Charges: ₹\${exchange.toFixed(2)}</p>
    <p>SEBI Charges: ₹\${sebi.toFixed(2)}</p>
    <p>GST: ₹\${gst.toFixed(2)}</p>
    <p>Stamp Duty: ₹\${stamp.toFixed(2)}</p>
    <hr/>
    <p><strong>Total Charges: ₹\${totalCharges.toFixed(2)}</strong></p>
    <p><strong>Net Profit/Loss: ₹\${profit.toFixed(2)}</strong></p>
  \`;
}