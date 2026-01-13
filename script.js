// ====== EMAILJS CONFIG ======
(function(){
 emailjs.init("SUA_PUBLIC_KEY_AQUI");
})();

// ====== SALVAR ALUNO ======
function salvarAluno(e){
  e.preventDefault();

  let alunos = JSON.parse(localStorage.getItem("alunos") || "[]");

  let aluno = {
    nome: document.getElementById("nome").value,
    inicio: document.getElementById("inicio").value,
    valor: document.getElementById("valor").value
  };

  alunos.push(aluno);
  localStorage.setItem("alunos", JSON.stringify(alunos));

  alert("Aluno cadastrado!");
  window.location.href = "index.html";
}

// ====== CARREGAR TABELA ======
function carregarAlunos(){
  let alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
  let tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  alunos.forEach(aluno => {
    let hoje = new Date();
    let inicio = new Date(aluno.inicio);

    // Próximo pagamento
    let proximo = new Date(inicio);
    while(proximo < hoje){
      proximo.setMonth(proximo.getMonth()+1);
    }

    // Diferença em dias
    let diff = Math.ceil((proximo - hoje)/(1000*60*60*24));

    let status = "";
    let classe = "";

    if(diff > 3){
      status = "Em dia";
      classe = "status-ok";
    }
    else if(diff <= 3 && diff >= 0){
      status = "Faltam " + diff + " dias";
      classe = "status-alerta";
      enviarEmailAviso(aluno, proximo, diff);
    }
    else {
      status = "Vencido";
      classe = "status-vencido";
    }

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.inicio}</td>
      <td>R$ ${aluno.valor}</td>
      <td>${proximo.toLocaleDateString()}</td>
      <td class="${classe}">${status}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ====== ENVIO DE EMAIL ======
function enviarEmailAviso(aluno, data, dias){
  // evita enviar múltiplos emails repetidos no mesmo dia
  let hoje = new Date().toLocaleDateString();
  let controle = localStorage.getItem("email_"+aluno.nome);

  if(controle == hoje) return;

  emailjs.send("SEU_SERVICE_ID","SEU_TEMPLATE_ID",{
    aluno: aluno.nome,
    vencimento: data.toLocaleDateString(),
    dias: dias,
    email_destino: "alex.castro@educacao.mg.gov.br"
  });

  localStorage.setItem("email_"+aluno.nome, hoje);
}
