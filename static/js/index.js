let btn_adicionar = document.getElementById('btn_adicionar');
let btn_calcular = document.getElementById('btn_calcular');
let input_alimento = document.getElementById('alimento');
let input_peso_bruto = document.getElementById('peso_bruto');
let input_peso_liquido = document.getElementById('peso_liquido');
let table = document.getElementById('table');
let tbody = table.getElementsByTagName('tbody')[0];

let tabela_total = document.getElementById('tabela_total');
// let tbody_total = tabela_total.getElementsByTagName('tbody')[0];
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
        let data_json = JSON.parse(data['tabela_proporcional'])[0] 
        atualizar_tabela_total(data_json);
    });
});

function atualizar_tabela_total(dados){
    let tabela = ""
    for(let d in dados){
        tabela += `<tr><th scope="row">${d}</th><td>${dados[d]}</td></tr>\n`
    }
    console.log(tabela);
    tbody_total.insertAdjacentHTML('beforeend',tabela);
}
