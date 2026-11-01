
const express = require("express");
const {
  parsePhoneNumberFromString
} = require("libphonenumber-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const PAGE = String.raw`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VORAX CHECK BAN</title>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #000;
  color: #eee;
  font-family: Georgia, serif;
  min-height: 100vh;
  padding: 35px 15px;
}

.container {
  width: 100%;
  max-width: 630px;
  margin: 0 auto;
  text-align: center;
}

.top-title {
  font-size: 27px;
  letter-spacing: 3px;
  margin: 25px 0 110px;
  font-weight: normal;
}

.panel {
  border: 2px solid #d6d6d6;
  border-radius: 45px;
  overflow: hidden;
}

.panel-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.panel-top div {
  padding: 24px 5px;
  font-size: 18px;
  font-weight: bold;
  font-style: italic;
  border-bottom: 2px solid #d6d6d6;
}

.panel-top div:first-child {
  border-right: 2px solid #d6d6d6;
}

.brand {
  padding: 20px 5px;
  font-size: 24px;
  letter-spacing: 3px;
  color: #aaa;
}

.form {
  border: 2px solid #ccc;
  border-top: 0;
  border-radius: 0 0 45px 45px;
  padding: 18px 10px;
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 0 auto;
  max-width: 500px;
}

.prefix {
  width: 105px;
  background: transparent;
  color: white;
  border: 0;
  border-bottom: 2px solid #aaa;
  padding: 10px 0;
  font-size: 20px;
  outline: none;
}

.number {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  border-bottom: 2px solid #aaa;
  padding: 10px 4px;
  color: white;
  font-size: 20px;
  outline: none;
}

.number::placeholder {
  color: #777;
}

button {
  background: transparent;
  color: white;
  border: 1px solid #aaa;
  padding: 13px 20px;
  border-radius: 25px;
  font-size: 15px;
  margin-top: 22px;
  cursor: pointer;
  letter-spacing: 1px;
}

button:disabled {
  opacity: .5;
}

.progress {
  width: 80%;
  height: 5px;
  background: #333;
  margin: 20px auto;
  overflow: hidden;
  display: none;
}

.progress-bar {
  height: 100%;
  width: 0;
  background: #ddd;
  transition: width .3s;
}

.result {
  display: none;
  margin: 25px auto;
  padding: 18px;
  border: 1px solid #777;
  border-radius: 20px;
  max-width: 500px;
  line-height: 1.8;
}

.result strong {
  display: block;
  font-size: 20px;
  margin-bottom: 8px;
}

.art {
  width: min(75%, 420px);
  height: 190px;
  margin: 55px auto 20px;
  border: 1px solid #333;
  border-radius: 4px;
  background:
    radial-gradient(ellipse at 50% 50%, #333 0%, #111 45%, #000 75%);
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 5px;
  font-size: 25px;
  color: #aaa;
}

.footer {
  color: #777;
  font-family: Arial, sans-serif;
  font-size: 13px;
  margin-top: 25px;
}

.mode {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin: 20px 0;
  font-family: Arial, sans-serif;
  font-size: 13px;
}

.mode label {
  cursor: pointer;
}

.batch {
  display: none;
  max-width: 500px;
  margin: auto;
}

.batch textarea {
  width: 100%;
  min-height: 130px;
  background: #080808;
  color: white;
  border: 1px solid #888;
  border-radius: 15px;
  padding: 15px;
  font-size: 16px;
  resize: vertical;
}

.batch-results {
  margin-top: 20px;
  text-align: left;
  line-height: 2;
}

@media(max-width: 450px) {
  .top-title {
    margin-bottom: 90px;
    font-size: 23px;
  }

  .panel-top div {
    font-size: 14px;
  }

  .brand {
    font-size: 19px;
  }

  .form {
    gap: 8px;
  }

  .prefix {
    width: 80px;
    font-size: 17px;
  }

  .number {
    font-size: 17px;
  }

  .art {
    height: 150px;
  }
}
</style>
</head>

<body>
<div class="container">

  <div class="top-title">VORAX CHECK BAN</div>

  <div class="panel">
    <div class="panel-top">
      <div>YOUR NUMBER ♡</div>
      <div>VORAX CHECKER</div>
    </div>
    <div class="brand">THE SUPREMARCY</div>
  </div>

  <div class="mode">
    <label>
      <input type="radio" name="mode" value="single" checked>
      Individuel
    </label>
    <label>
      <input type="radio" name="mode" value="batch">
      Multiple (4 max.)
    </label>
  </div>

  <div id="single">
    <div class="form">
      <select class="prefix" id="prefix">
        <option value="+225">+225</option>
        <option value="+33">+33</option>
        <option value="+229">+229</option>
        <option value="+226">+226</option>
        <option value="+223">+223</option>
        <option value="+221">+221</option>
        <option value="+237">+237</option>
        <option value="+1">+1</option>
      </select>

      <input
        class="number"
        id="number"
        type="tel"
        placeholder="Number"
        autocomplete="off"
      >
    </div>

    <button id="checkBtn" onclick="checkNumber()">
      ANALYSER
    </button>
  </div>

  <div id="batch" class="batch">
    <textarea id="numbers"
      placeholder="Un numéro par ligne&#10;Exemple :&#10;+2250700000000&#10;+33600000000"></textarea>
    <button id="batchBtn" onclick="checkBatch()">
      ANALYSER LES NUMÉROS
    </button>
  </div>

  <div class="progress" id="progress">
    <div class="progress-bar" id="progressBar"></div>
  </div>

  <div class="result" id="result"></div>

  <div class="art">V O R A X</div>

  <div class="footer">
    VORAX CHECK BAN • NUMBER ANALYSIS
    <br><br>
    Le statut de bannissement n'est pas vérifié.
  </div>

</div>

<script>
const modes = document.querySelectorAll('input[name="mode"]');

modes.forEach(mode => {
  mode.addEventListener("change", () => {
    document.getElementById("single").style.display =
      mode.value === "single" ? "block" : "none";

    document.getElementById("batch").style.display =
      mode.value === "batch" ? "block" : "none";

    document.getElementById("result").style.display = "none";
  });
});

function loading(active) {
  const progress = document.getElementById("progress");
  const bar = document.getElementById("progressBar");

  progress.style.display = active ? "block" : "none";
  bar.style.width = active ? "65%" : "0%";
}

function showResult(html) {
  const result = document.getElementById("result");
  result.innerHTML = html;
  result.style.display = "block";
}

async function checkNumber() {
  const number = document.getElementById("number").value.trim();
  const prefix = document.getElementById("prefix").value;

  if (!number) {
    showResult("Entre un numéro pour commencer.");
    return;
  }

  const btn = document.getElementById("checkBtn");
  btn.disabled = true;
  loading(true);

  try {
    const response = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, prefix })
    });

    const data = await response.json();

    showResult(
      "<strong>" + data.title + "</strong>" +
      data.message
    );
  } catch (error) {
    showResult("Une erreur est survenue. Réessaie.");
  }

  loading(false);
  btn.disabled = false;
}

async function checkBatch() {
  const values = document.getElementById("numbers")
    .value.split("\n")
    .map(x => x.trim())
    .filter(Boolean);

  if (!values.length) {
    showResult("Entre au moins un numéro.");
    return;
  }

  if (values.length > 4) {
    showResult("Maximum : 4 numéros par analyse.");
    return;
  }

  const btn = document.getElementById("batchBtn");
  btn.disabled = true;
  loading(true);

  try {
    const response = await fetch("/api/check-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numbers: values })
    });

    const data = await response.json();

    const html = data.results.map(item =>
      "<div><strong>" + item.number + "</strong>" +
      item.message + "</div><hr>"
    ).join("");

    showResult(html);
  } catch (error) {
    showResult("Erreur pendant l'analyse.");
  }

  loading(false);
  btn.disabled = false;
}
</script>
</body>
</html>`;

function analyze(number, defaultCountry) {
  const parsed = parsePhoneNumberFromString(
    number,
    defaultCountry
  );

  if (!parsed || !parsed.isValid()) {
    return {
      valid: false,
      title: "FORMAT INVALIDE",
      message: "Le numéro ne correspond pas à un format téléphonique valide."
    };
  }

  return {
    valid: true,
    title: "FORMAT VALIDE",
    message:
      "Numéro international : " + parsed.number +
      ". Le statut WhatsApp et le bannissement ne sont pas vérifiés."
  };
}

app.get("/", (req, res) => {
  res.type("html").send(PAGE);
});

app.post("/api/check", (req, res) => {
  const { number, prefix } = req.body || {};

  if (typeof number !== "string" ||
      typeof prefix !== "string") {
    return res.status(400).json({
      title: "ERREUR",
      message: "Données incorrectes."
    });
  }

  const cleaned = number.replace(/[\s()-]/g, "");

  if (!/^\+?\d{5,15}$/.test(cleaned) ||
      !/^\+\d{1,4}$/.test(prefix)) {
    return res.json({
      title: "FORMAT INVALIDE",
      message: "Vérifie le numéro saisi."
    });
  }

  const fullNumber = cleaned.startsWith("+")
    ? cleaned
    : prefix + cleaned.replace(/^0+/, "");

  const country = {
    "+225": "CI",
    "+33": "FR",
    "+229": "BJ",
    "+226": "BF",
    "+223": "ML",
    "+221": "SN",
    "+237": "CM",
    "+1": "US"
  }[prefix] || "CI";

  const result = analyze(fullNumber, country);

  res.json({
    title: result.title,
    message: result.message
  });
});

app.post("/api/check-batch", (req, res) => {
  const numbers = req.body?.numbers;

  if (!Array.isArray(numbers) ||
      numbers.length < 1 ||
      numbers.length > 4 ||
      numbers.some(n => typeof n !== "string")) {
    return res.status(400).json({
      error: "Maximum 4 numéros."
    });
  }

  const results = numbers.map(number => {
    const result = analyze(number, "CI");

    return {
      number,
      valid: result.valid,
      message: result.message
    };
  });

  res.json({ results });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("VORAX CHECK BAN lancé sur le port " + PORT);
});
