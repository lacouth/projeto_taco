let btn_adicionar = document.getElementById('btn_adicionar');
let btn_calcular = document.getElementById('btn_calcular');
let input_alimento = document.getElementById('alimento');
let input_peso_bruto = document.getElementById('peso_bruto');
let input_peso_liquido = document.getElementById('peso_liquido');
let table = document.getElementById('table');
let tbody = table.getElementsByTagName('tbody')[0];

let tabela_proporcional = document.getElementById('tabela_proporcional');
let tbody_proporcional = document.getElementById('tbody_proporcional');

let tabela_total = document.getElementById('tabela_total');
let tbody_total = document.getElementById('tbody_total');

let cont = 0;
let lista = new Object();

let td_total_bruto = document.getElementById('total_bruto')
let td_total_liquido = document.getElementById('total_liquido')

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
    `<tr id = "row_${cont}" class = ${classe_restricao} >
        <th scope="row">${cont+1}</th>
        <td id="alimento_${cont}">${input_alimento.value}</td>
        <td id="p_bruto_${cont}">${input_peso_bruto.value}</td>
        <td id="p_liquido_${cont}">${input_peso_liquido.value}</td>
        <td onClick = "deleteRow(${cont})"> <i data-feather="trash-2"> </i> </td>
    </tr>`);
    feather.replace()
    
    input_peso_bruto.value = "";
    input_peso_liquido.value = "";
    input_alimento.value = "";
    cont++;

    calcular_tabelas()

});

function calcular_tabelas(){
    if(cont > 0){
        fetch('/calcular',{
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
            let data_json_proporcional = JSON.parse(data['tabela_proporcional'])[0] 
            let data_json_total = JSON.parse(data['tabela_total'])[0]
            atualizar_tabela(tbody_proporcional, data_json_proporcional)
            atualizar_tabela(tbody_total, data_json_total)
            
        });
    }else{
        tabela_total.innerHTML = ""
        tabela_proporcional.innerHTML = ""
    }
}

btn_calcular.addEventListener('click',()=>{ calcular_tabelas() });

function atualizar_tabela(tabelaHTML, dados){
    let tabela = ""
    tabelaHTML.innerHTML = tabela
    for(let d in dados){
        tabela += `<tr><th scope="row">${d}</th><td>${Number(dados[d]).toFixed(2)}</td></tr>\n`
    }
    tabelaHTML.insertAdjacentHTML('beforeend',tabela);
}

function deleteRow(pos,alimento){
    cont--

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
    calcular_tabelas()    

}

function atualizar_totais(){
    td_total_bruto.innerText = total_bruto
    td_total_liquido.innerText = total_liquido    
}

