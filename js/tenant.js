// Detecta órgão pelo subdomínio
const hostname = window.location.hostname;
let tenant = "ami"; // default
if(hostname.includes("agersinop")) tenant = "agersinop";
if(hostname.includes("poxoreu")) tenant = "poxoreu";
if(hostname.includes("pref-sal")) tenant = "pref-sal";

// Logos e nomes
const orgaoLogo = {
  ami: "assets/logos/ami.png",
  agersinop: "assets/logos/agersinop.png",
  poxoreu: "assets/logos/poxoreu.png",
  "pref-sal": "assets/logos/pref-sal.png"
};

const orgaoNome = {
  ami: "A.M.I.",
  agersinop: "AGERSINOP",
  poxoreu: "POXOREU",
  "pref-sal": "Prefeitura SAL"
};

// Aplica dinamicamente
const logoEl = document.getElementById("orgao-logo");
const nomeEl = document.getElementById("orgao-nome");

if(logoEl) logoEl.src = orgaoLogo[tenant];
if(nomeEl) nomeEl.innerText = orgaoNome[tenant];
