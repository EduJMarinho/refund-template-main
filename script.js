// Elementos do formulário.
const form       = document.querySelector("form")
const amount  = document.getElementById("amount")
const expense  = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista.
const expenseList           = document.querySelector("ul")
const expensesTotal       = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

//Captura o evento de input para formatar o valor.
amount.oninput = () => {
  // Obtem o valor do input e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "")

  // Transforma o valor em centavos (ex: 150/100 = 1.5 que é equivalente a R$ 1,50).
  value = Number(value)  / 100
  
  // atualiza o valor do input. 
  amount.value = formatCurrrencyBRL(value)
}

function formatCurrrencyBRL(value){

  // Formata o valor no padrão BRL ( Real Brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  // Retorna o valor formatado.
  return value
}

//Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
  // previne o comportamento padrão de recarregar a página.
  event.preventDefault()

  // Cria um objeto com os detalhes da nova despesa.
  const newExpense = {
    id: new Date() .getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value, 
    created_at: new Date(),
  }

  // Chama a função que irá adicionar o item na lista.
  expenseAdd(newExpense)
}
// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {        
    // Cria o elemento para adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
     expenseIcon.setAttribute("alt", newExpense.category_name)

     // Cria a info da despesa. 
     const expenseInfo = document.createElement("div")
     expenseInfo.classList.add("expense-info")

     // Cria o nome da despesa.
     const expenseName = document.createElement("strong")
     expenseName.textContent = newExpense.expense

     // Cria a categoria da despesa.
     const expenseCategory = document.createElement("span")
     expenseCategory.textContent = newExpense.category_name

     // Adicionar nome e categoria na div das informações da despesa.
     expenseInfo.append(expenseName, expenseCategory)

     // Cria o valor da despesa.
     const expenseAmount = document.createElement("span")     
     expenseAmount.classList.add("expense-amount")
     expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase()
      .replace("R$", "")}`

      // Cria um ícone de remover.
      const removeIcon = document.createElement("img")
      removeIcon.classList.add("remove-icon")
      removeIcon.setAttribute("src", "img/remove.svg")
      removeIcon.setAttribute("alt", "remover")

     // Adiciona as informações no item.
     expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

     // Adiciona o item na lista.
     expenseList.append(expenseItem)

     // Limpa o formulário para adicionar um novo item.
     formClear()

     // Atualiza os totais.
     updateTotals()

  }catch (error){
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os totais.
function  updateTotals(){
try{

  // Recupera todos os itens (li)  da lits (ul)
  const items = expenseList.children
  
  //Atualiza a quantidade de itens da lista.
  expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"
  }`
// Variavel pra incrementar o total.
let total = 0

// Percorre cada item (li) da lista (ul).
for(let item = 0; item < items.length;  item++) {
  const itemAmount = items[item].querySelector(".expense-amount")

  // Remover caracteres não numéricos e substitui a vírgula pelo ponto.
let value = itemAmount.textContent.replace(/[^\d,]/g, "").
replace(",","." )  

// Converte o valor para float.
value = parseFloat(value)

// Verificar se é um número válido (por garantia).
if(isNaN(value)){
  return alert("Não foi possível calcular o total. O valor não parece ser um número")
}
// Incrementar o valor total.
total += Number(value)
}
// Cria a span para asicionar o R$ formatado.
const symbolBRL = document.createElement("small")
symbolBRL.textContent = "R$"

// Formata o valor e remove o R$ que será exibido pelo small com um estilo customizado.
total = formatCurrrencyBRL(total).toUpperCase().
replace("R$, ")

// Limpa o conteúdo do elemento.
expensesTotal.innerHTML = ""

// Adiciona o símbolo da moeda e o valor total formatado.
expensesTotal.append(symbolBRL, total)

}catch (error) {
  console.log(error)
  alert("Não foi possível atualizar os totais.")
}
}

//Evento que captura o clique na lista.
expenseList.addEventListener("click", function(event){
  // Verifica se o elemento clicado é o ícone de remover.

  if (event.target.classList.contains("remove-icon")){
    
    //Obtem a li  'pai' do elemento clicado.
    const item = event.target.closest(".expense")

    //Remove o item da lista
    item.remove()
  }

  // Atualiza os totais.
  updateTotals()
})

function formClear(){
  // Limpa os inputs.
  expense.value = ""
  category.value = ""
  amount.value = ""

  //Coloca o foco no input de amount.
  expense.focus()
}
