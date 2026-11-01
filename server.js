
const express = require("express");
const { parsePhoneNumberFromString } = require("libphonenumber-js");

const app = express();

app.use(express.json({ limit: "3mb" }));

const PAGE = String.raw`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VORAX CHECK BAN</title>

<style>
*{box-sizing:border-box;margin:0;padding:0}
body{
 background:#000;color:#eee;min-height:100vh;
 font-family:Georgia,serif;padding:25px 15px;
}
.container{max-width:630px;margin:auto;text-align:center}
.header{position:relative;margin:30px 0 100px}
h1{font-size:27px;letter-spacing:4px;font-weight:normal}
.menu-btn{
 position:absolute;right:0;top:-8px;background:none;
 border:0;color:white;font-size:30px;margin:0;padding:0 8px;
}
.menu{
 display:none;position:absolute;right:0;top:35px;z-index:10;
 background:#171717;border:1px solid #aaa;border-radius:12px;
 width:210px;padding:8px;text-align:left;
}
.menu button{
 display:block;width:100%;margin:0;border:0;border-radius:7px;
 text-align:left;padding:12px;background:none;font-size:14px;
}
.menu button:hover{background:#333}
.panel{border:2px solid #ccc;border-radius:45px;overflow:hidden}
.panel-top{display:grid;grid-template-columns:1fr 1fr}
.panel-top div{
 padding:24px 5px;border-bottom:2px solid #ccc;
 font-size:17px;font-weight:bold;font-style:italic;
}
.panel-top div:first-child{border-right:2px solid #ccc}
.brand{padding:20px;font-size:22px;letter-spacing:3px;color:#aaa}
.mode{display:flex;justify-content:center;gap:22px;margin:35px 0}
.mode label{font-family:Arial;cursor:pointer}
.form{
 border:2px solid #ccc;border-top:0;border-radius:0 0 45px 45px;
 padding:18px 12px;display:flex;gap:12px;align-items:center;
 max-width:500px;margin:auto;
}
.prefix,.number{
 background:transparent;color:white;border:0;
 border-bottom:2px solid #aaa;padding:12px 4px;
 font-size:19px;outline:none;
}
.prefix{width:105px}
.number{flex:1;min-width:0}
.number::placeholder{color:#777}
button.action{
 background:transparent;color:white;border:1px solid #aaa;
 padding:14px 25px;border-radius:30px;font-size:15px;
 margin-top:25px;letter-spacing:1px;cursor:pointer;
}
button:disabled{opacity:.5}
.progress{
 width:80%;height:5px;background:#333;margin:20px auto;
 display:none;overflow:hidden
}
.progress-bar{height:100%;width:0;background:#eee;transition:.3s}
.result{
 display:none;margin:25px auto;padding:20px;
 border:1px solid #777;border-radius:20px;max-width:500px;
 line-height:1.8
}
.result strong{display:block;font-size:20px;margin-bottom:8px}
.art{
 width:min(75%,420px);min-height:150px;margin:50px auto 20px;
 display:flex;flex-direction:column;gap:12px;
}
.art img,.art video{
 width:100%;max-height:260px;object-fit:contain;
 border:1px solid #333;border-radius:5px;
}
.footer{color:#777;font:12px Arial;margin-top:25px}
.batch{display:none;max-width:500px;margin:auto}
.batch textarea{
 width:100%;height:130px;background:#080808;color:white;
 border:1px solid #888;border-radius:15px;padding:15px;font-size:16px
}
.editor{
 display:none;position:fixed;inset:0;background:#000c;
 z-index:20;align-items:center;justify-content:center;padding:15px
}
.editor-box{
 background:#171717;border:1px solid #aaa;border-radius:18px;
 padding:22px;width:100%;max-width:420px;text-align:left
}
.editor-box h2{text-align:center;margin-bottom:20px}
.editor-box label{display:block;margin:12px 0 6px}
.editor-box input{
 width:100%;padding:12px;background:#080808;color:white;
 border:1px solid #777;border-radius:8px
}
.editor-box button{margin:12px 5px 0 0}
.media-note{font-size:12px;color:#aaa;margin-top:12px;line-height:1.5}
@media(max-width:450px){
 h1{font-size:23px}
 .panel-top div{font-size:14px}
 .brand{font-size:18px}
 .prefix{width:80px;font-size:17px}
 .number{font-size:17px}
}
</style>
</head>

<body>
<div class="container">

 <header class="header">
  <h1 id="siteTitle">VORAX CHECK BAN</h1>

  <button class="menu-btn" onclick="toggleMenu()">⋮</button>

  <div class="menu" id="menu">
   <button onclick="openEditor()">✎ Modifier le site</button>
   <button onclick="document.getElementById('mediaInput').click()">＋ Ajouter image/vidéo</button>
   <button onclick="resetMedia()">Supprimer les médias</button>
  </div>
 </header>

 <div class="panel">
  <div class="panel-top">
   <div id="leftText">YOUR NUMBER ♡</div>
   <div id="rightText">VORAX CHECKER</div>
  </div>
  <div class="brand" id="brandText">CHECK BAN</div>
 </div>

 <div class="mode">
  <label><input type="radio" name="mode" value="single" checked> Individuel</label>
  <label><input type="radio" name="mode" value="batch"> Multiple (4 max.)</label>
 </div>

 <section id="single">
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
   <input class="number" id="number" type="tel" placeholder="Number">
  </div>
  <button class="action" id="checkBtn" onclick="checkNumber()">ANALYSER</button>
 </section>

 <section id="batch" class="batch">
  <textarea id="numbers" placeholder="Un numéro par ligne&#10;+2250700000000"></textarea>
  <button class="action" id="batchBtn" onclick="checkBatch()">ANALYSER</button>
 </section>

 <div class="progress" id="progress">
  <div class="progress-bar" id="progressBar"></div>
 </div>

 <div class="result" id="result"></div>

 <div class="art" id="mediaArea"></div>

 <div class="footer">NUMBER ANALYSIS</div>
</div>

<input type="file" id="mediaInput" accept="image/*,video/*" multiple hidden>

<div class="editor" id="editor">
 <div class="editor-box">
  <h2>MODIFIER LE SITE</h2>

  <label>Titre principal</label>
  <input id="editTitle" maxlength="45">

  <label>Texte de gauche</label>
  <input id="editLeft" maxlength="35">

  <label>Texte de droite</label>
  <input id="editRight" maxlength="35">

  <label>Texte central</label>
  <input id="editBrand" maxlength="35">

  <button class="action" onclick="saveEditor()">ENREGISTRER</button>
  <button class="action" onclick="closeEditor()">FERMER</button>
 </div>
</div>

<script>
const $ = id => document.getElementById(id);

document.querySelectorAll('input[name="mode"]').forEach(radio=>{
 radio.addEventListener("change",()=>{
  $("single").style.display=radio.value==="single"?"block":"none";
  $("batch").style.display=radio.value==="batch"?"block":"none";
  $("result").style.display="none";
 });
});

function toggleMenu(){
 const menu=$("menu");
 menu.style.display=menu.style.display==="block"?"none":"block";
}

document.addEventListener("click",e=>{
 if(!e.target.closest(".header")) $("menu").style.display="none";
});

function openEditor(){
 $("editTitle").value=$("siteTitle").textContent;
 $("editLeft").value=$("leftText").textContent;
 $("editRight").value=$("rightText").textContent;
 $("editBrand").value=$("brandText").textContent;
 $("editor").style.display="flex";
 $("menu").style.display="none";
}

function closeEditor(){$("editor").style.display="none"}

function saveEditor(){
 const fields={
  siteTitle:"editTitle",
  leftText:"editLeft",
  rightText:"editRight",
  brandText:"editBrand"
 };

 for(const [target,source] of Object.entries(fields)){
  $(target).textContent=$(source).value.trim();
  localStorage.setItem("vorax_"+target,$(target).textContent);
 }
 closeEditor();
}

function loadTexts(){
 ["siteTitle","leftText","rightText","brandText"].forEach(id=>{
  const value=localStorage.getItem("vorax_"+id);
  if(value) $(id).textContent=value;
 });
}
loadTexts();

$("mediaInput").addEventListener("change",event=>{
 const files=Array.from(event.target.files);
 for(const file of files){
  if(!file.type.startsWith("image/") && !file.type.startsWith("video/")) continue;
  if(file.size>20*1024*1024){
   alert("Fichier trop volumineux : maximum 20 Mo.");
   continue;
  }

  const url=URL.createObjectURL(file);
  let element;

  if(file.type.startsWith("image/")){
   element=document.createElement("img");
   element.alt="Image ajoutée";
  }else{
   element=document.createElement("video");
   element.controls=true;
   element.playsInline=true;
  }

  element.src=url;
  $("mediaArea").appendChild(element);
 }
 event.target.value="";
});

function resetMedia(){
 $("mediaArea").replaceChildren();
 $("menu").style.display="none";
}

function loading(active){
 $("progress").style.display=active?"block":"none";
 $("progressBar").style.width=active?"70%":"0%";
}

function showResult(title,message){
 const result=$("result");
 result.replaceChildren();
 const strong=document.createElement("strong");
 strong.textContent=title;
 const text=document.createElement("p");
 text.textContent=message;
 result.append(strong,text);
 result.style.display="block";
}

async function checkNumber(){
 const number=$("number").value.trim();
 const prefix=$("prefix").value;

 if(!number){showResult("NUMÉRO MANQUANT","Entre un numéro.");return}

 $("checkBtn").disabled=true;
 loading(true);

 try{
  const response=await fetch("/api/check",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({number,prefix})
  });
  const data=await response.json();
  showResult(data.title,data.message);
 }catch(e){
  showResult("ERREUR","Impossible de contacter le serveur.");
 }

 loading(false);
 $("checkBtn").disabled=false;
}

async function checkBatch(){
 const numbers=$("numbers").value.split("\n").map(n=>n.trim()).filter(Boolean);

 if(!numbers.length){showResult("ERREUR","Entre au moins un numéro.");return}
 if(numbers.length>4){showResult("LIMITE ATTEINTE","Maximum 4 numéros.");return}

 $("batchBtn").disabled=true;
 loading(true);

 try{
  const response=await fetch("/api/check-batch",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({numbers})
  });
  const data=await response.json();

  const result=$("result");
  result.replaceChildren();

  data.results.forEach(item=>{
   const line=document.createElement("p");
   line.style.margin="12px 0";
   line.textContent=item.number+" : "+item.message;
   result.appendChild(line);
  });
  result.style.display="block";
 }catch(e){
  showResult("ERREUR","Impossible de contacter le serveur.");
 }

 loading(false);
 $("batchBtn").disabled=false;
}
</script>
</body>
</html>`;

function analyze(number, country) {
  const parsed = parsePhoneNumberFromString(number, country);

  if (!parsed || !parsed.isValid()) {
    return {
      valid: false,
      message: "Format téléphonique invalide."
    };
  }

  return {
    valid: true,
    message:
      "Format valide : " + parsed.number +
      ". Statut WhatsApp et bannissement non vérifiés."
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

  if (!/^\+?\d{5,15}$/.test(cleaned)) {
    return res.json({
      title: "FORMAT INVALIDE",
      message: "Vérifie le numéro saisi."
    });
  }

  const fullNumber = cleaned.startsWith("+")
    ? cleaned
    : prefix + cleaned;

  const countries = {
    "+225": "CI",
    "+33": "FR",
    "+229": "BJ",
    "+226": "BF",
    "+223": "ML",
    "+221": "SN",
    "+237": "CM",
    "+1": "US"
  };

  const result = analyze(fullNumber, countries[prefix] || "CI");

  res.json({
    title: result.valid ? "FORMAT VALIDE" : "FORMAT INVALIDE",
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

  res.json({
    results: numbers.map(number => {
      const result = analyze(number, "CI");
      return {
        number,
        valid: result.valid,
        message: result.message
      };
    })
  });
});

module.exports = app;

// Lancement local uniquement
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("VORAX CHECK BAN lancé sur " + PORT);
  });
}
