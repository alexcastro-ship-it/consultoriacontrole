emailjs.init("JNVI8jZIGfR6kgF9s");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

function salvarLocal() {
 localStorage.setItem("alunos", JSON.stringify(alunos));
 carregarTabela();
}

function cadastrarAluno(){
 let nome = document.getElementById("nome").value;
 let inicio = document.getElementById("inicio").value;
 let valor = document.getElementById("valor").value;

 if(!nome || !inicio || !valor){
   alert("Preencha todos os campos");
   return;
 }

 alunos.push({nome,inicio,valor});
 salvarLocal();

 document.getElementById("nome").value="";
 document.getElementById("inicio").value="";
 document.getElementById("valor").value="";
}

function calcularVencimento(dataInicio){
 let d = new Date(dataInicio);
 let hoje = new Date();
 while(d < hoje){
   d.setMonth(d.getMonth()+1);
 }
 return d;
}

function diasPara(d){
 let hoje = new Date();
 let diff = Math.ceil((d-hoje)/(1000*60*60*24));
 return diff;
}

function enviarEmail(aluno, vencimento, dias){
 emailjs.send("service_qgqzxy9","template_440jpdr",{
   aluno: aluno,
   vencimento: vencimento,
   dias: dias
 });
}

function carregarTabela(){
 let tbody = document.querySelector("#tabela tbody");
 tbody.innerHTML="";

 alunos.forEach(a=>{
   let venc = calcularVencimento(a.inicio);
   let dias = diasPara(venc);

   let status = "Em dia";

   if(dias <=3 && dias >=0){
     status = "⚠️ Aviso enviado";
     enviarEmail(a.nome, venc.toLocaleDateString(), dias);
   }

   if(dias <0){
     status = "❌ Vencido";
   }

   let tr = document.createElement("tr");
   tr.innerHTML = `
     <td>${a.nome}</td>
     <td>${new Date(a.inicio).toLocaleDateString()}</td>
     <td>R$ ${a.valor}</td>
     <td>${venc.toLocaleDateString()}</td>
     <td>${status}</td>
   `;
   tbody.appendChild(tr);
 });
}

carregarTabela();
