let btn_adicionar = document.getElementById('btn_adicionar');
let input_alimento = document.getElementById('alimento');
let input_peso_bruto = document.getElementById('peso_bruto');
let input_peso_liquido = document.getElementById('peso_liquido');
let table = document.getElementById('table');
let tbody = table.getElementsByTagName('tbody')[0];

let tabela_proporcional = document.getElementById('tabela_proporcional');
let tbody_proporcional = document.getElementById('tbody_proporcional');

let tabela_total = document.getElementById('tabela_total');
let tbody_total = document.getElementById('tbody_total');

let lista_compras = document.getElementById('tbody_lista_compras')
let btn_compras = document.getElementById('btn_lista_compras')

let qnt_ingredientes = 0;
let lista = new Object();

let td_total_bruto = document.getElementById('total_bruto')
let td_total_liquido = document.getElementById('total_liquido')

let btn_calcular = document.getElementById('btn_proporcao')


let total_bruto = 0;
let total_liquido = 0;
let restricoes = {}

fetch('/get_restricoes',{
    method: 'GET'
}).then(res=>{
    return res.json();
}).then(data=>{
    restricoes = data;   
})

function calcular_tabela_proporcional(porcoes){

    if(qnt_ingredientes > 0){
        fetch('/calcular_tabela_proporcional',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'ingredientes': lista, 'porcoes':porcoes})
        })
        .then(res=>{
            return res.json()
        })
        .then(data=>{ 
            let data_json = JSON.parse(data['tabela_proporcional'])[0]
            atualizar_tabela(tbody_proporcional, data_json)
        });
    }else{
        tabela_proporcional.innerHTML = ""
    }

}



btn_adicionar.addEventListener('click',()=>{
    
    lista[input_alimento.value] = {}
    lista[input_alimento.value]["bruto"] = input_peso_bruto.value;
    lista[input_alimento.value]["liquido"] = input_peso_liquido.value;

    total_bruto += Number(input_peso_bruto.value)
    total_liquido += Number(input_peso_liquido.value)

    atualizar_totais()    

    let classe_restricao = ""
    switch(restricoes[input_alimento.value]){
        case 1:
            classe_restricao = 'table-danger'; // #f8d7da
            break;
        case 2:
            classe_restricao = 'table-warning'; // #fff3cd
            break;
        case 3:
            classe_restricao = 'table-info'; // #cff4fc
            break;
    }

    tbody.insertAdjacentHTML('beforeEnd', 
    `<tr id = "row_${qnt_ingredientes}" class = ${classe_restricao} >
        <th scope="row">${qnt_ingredientes+1}</th>
        <td id="alimento_${qnt_ingredientes}">${input_alimento.value}</td>
        <td id="p_bruto_${qnt_ingredientes}">${input_peso_bruto.value}</td>
        <td id="p_liquido_${qnt_ingredientes}">${input_peso_liquido.value}</td>
        <td onClick = "deleteRow(${qnt_ingredientes})"> <i data-feather="trash-2"> </i> </td>
    </tr>`);
    feather.replace()


    lista_compras.insertAdjacentHTML('beforeEnd', 
    `<tr id = "row_compras_${qnt_ingredientes}">
        <th scope="row">${qnt_ingredientes+1}</th>
        <td id="ingrediente_${qnt_ingredientes}">${input_alimento.value}</td>
        <td id="peso_pp_${qnt_ingredientes}">${input_peso_bruto.value}</td>
        <td> <input type="text" class="form-control" id="peso_emb_${qnt_ingredientes}" value="">  </td>
        <td> <input type="text" class="form-control" id="preco_${qnt_ingredientes}" value="">  </td>
    </tr>`);

    
    input_peso_bruto.value = "";
    input_peso_liquido.value = "";
    input_alimento.value = "";
    qnt_ingredientes++;

    calcular_tabela_total()

});

function calcular_tabela_total(){
    if(qnt_ingredientes > 0){
        fetch('/calcular_tabela_total',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lista)
        })
        .then(res=>{
            return res.json()
        })
        .then(data=>{ 
            let data_json_total = JSON.parse(data['tabela_total'])[0]
            atualizar_tabela(tbody_total, data_json_total)
            
        });
    }else{
        tabela_total.innerHTML = ""
    }
}


function atualizar_tabela(tabelaHTML, dados){
    let tabela = ""
    tabelaHTML.innerHTML = tabela
    for(let d in dados){
        tabela += `<tr><th scope="row">${d}</th><td>${Number(dados[d]).toFixed(2)}</td></tr>\n`
    }
    tabelaHTML.insertAdjacentHTML('beforeend',tabela);
}

function deleteRow(pos,alimento){
    qnt_ingredientes--

    let alimento_td = document.getElementById("alimento_"+pos)
    alimento = alimento_td.innerText
    delete lista[alimento]
    
    let p_bruto = document.getElementById("p_bruto_"+pos).innerText
    let p_liquido = document.getElementById("p_liquido_"+pos).innerText

    total_bruto -= Number(p_bruto)
    total_liquido -= Number(p_liquido)

    atualizar_totais()

    let row = document.getElementById("row_"+pos)
    row.remove()

    let row_compras = document.getElementById("row_compras_"+pos)
    row_compras.remove()

    document.getElementById("tbody_lista_compras_resultado").innerHTML = ""
    document.getElementById("total_porcao").innerText = ""
    document.getElementById("total_servico").innerText = ""

    calcular_tabela_total()    

}

function atualizar_totais(){
    td_total_bruto.innerText = total_bruto
    td_total_liquido.innerText = total_liquido    
}

btn_compras.addEventListener('click',()=>{

    let ingrediente

    for(let i = 0; i < qnt_ingredientes; i++){

        ingrediente = document.getElementById("ingrediente_"+i).innerText
        lista[ingrediente]["preco"] = Number(document.getElementById("preco_"+i).value)
        lista[ingrediente]["peso_emb"] = Number(document.getElementById("peso_emb_"+i).value)

    }

    atualizar_lista_compras()

})

btn_calcular.addEventListener('click',()=>{
    porcoes = Number(document.getElementById('quantidade_porcoes').value)
    calcular_tabela_proporcional(porcoes)
    let titulo = document.getElementById('titulo_tabela_proporcional')
    titulo.innerText = `Informação Nutricional por ${(total_liquido/porcoes).toFixed(2)} (gramas) da preparação/receita`

    let ingrediente
    let value
    for(let i = 0; i < qnt_ingredientes; i++){
        ingrediente = document.getElementById("ingrediente_"+i).innerText
        value = lista[ingrediente]["bruto"]  / porcoes
        document.getElementById("peso_pp_"+i).innerText = value.toFixed(2)
    }
})


function atualizar_lista_compras(){
    
    let lista_final = document.getElementById("tbody_lista_compras_resultado")
    let per_capita = Number(document.getElementById('per_capita').value)
    let valor_porcao = 0
    let valor_servico = 0
    let total_porcao = 0
    let total_servico = 0

    lista_final.innerHTML = ""

    for(let ingr in lista){
        valor_porcao = (lista[ingr]["preco"] * lista[ingr]["bruto"] / porcoes) / lista[ingr]["peso_emb"]
        valor_servico = valor_porcao * per_capita

        total_porcao += valor_porcao
        total_servico += valor_servico

        lista_final.insertAdjacentHTML('beforeEnd',
        `<tr>
            <td>${ingr}</td>
            <td>${valor_porcao.toFixed(2)}</td>
            <td>${lista[ingr]["bruto"] / porcoes * per_capita}</td>
            <td>${valor_servico.toFixed(2)}</td>
        </tr>`
        )
    }
    document.getElementById("total_porcao").innerText = "R$ " + total_porcao.toFixed(2)
    document.getElementById("total_servico").innerText = "R$ " + total_servico.toFixed(2)
}

