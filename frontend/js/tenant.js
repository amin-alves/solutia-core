// Detecta órgão pelo subdomínio
const hostname = window.location.hostname;
let tenant = "ami"; // default
if(hostname.includes("poxoreu")) tenant = "poxoreu";
if(hostname.includes("prefeitura")) tenant = "prefeitura";

// Logos e nomes
const orgaoLogo = {
  ami: "assets/logos/ami.png",
  poxoreu: "assets/logos/poxoreu.png",
  prefeitura: "assets/logos/prefeitura.png"
};

const orgaoNome = {
  ami: "A.M.I.",
  poxoreu: "POXOREU",
  prefeitura: "Prefeitura"
};

// Aplica dinamicamente
const logoEl = document.getElementById("orgao-logo");
const nomeEl = document.getElementById("orgao-nome");

if(logoEl) logoEl.src = orgaoLogo[tenant];
if(nomeEl) nomeEl.innerText = orgaoNome[tenant];
