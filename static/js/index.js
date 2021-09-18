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

btn_adicionar.addEventListener('click',()=>{
    cont++; 

    tbody.insertAdjacentHTML('beforeEnd', 
    `<tr>
        <th scope="row">${cont}</th>
        <td>${input_alimento.value}</td>
        <td>${input_peso_bruto.value}</td>
        <td>${input_peso_liquido.value}</td>
    </tr>`);

    lista[input_alimento.value] = {}
    lista[input_alimento.value]["bruto"] = input_peso_bruto.value;
    lista[input_alimento.value]["liquido"] = input_peso_liquido.value;
    
    input_peso_bruto.value = "";
    input_peso_liquido.value = "";
    input_alimento.value = "";

});

btn_calcular.addEventListener('click',()=>{
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
});

function atualizar_tabela(tabelaHTML, dados){
    let tabela = ""
    for(let d in dados){
        tabela += `<tr><th scope="row">${d}</th><td>${Number(dados[d]).toFixed(2)}</td></tr>\n`
    }
    tabelaHTML.insertAdjacentHTML('beforeend',tabela);
}

