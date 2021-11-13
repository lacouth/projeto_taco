from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

def get_ingredientes():
    df = pd.read_csv('static/data/tabela_taco.csv')
    return df.iloc[:,0].tolist()

def calcular_tabelas(ingredientes):
    df = pd.read_csv('static/data/tabela_taco.csv',index_col=0)
    df.pop('Restrições')
    df = df.loc[ingredientes.keys()]
    peso_total = 0
    for ingrediente in ingredientes:
        df.loc[ingrediente] = df.loc[ingrediente] * float(ingredientes[ingrediente]['liquido']) / 100
        peso_total += float(ingredientes[ingrediente]['liquido'])
    tabela_total = pd.DataFrame(df.sum()).to_json()
    tabela_proporcional = pd.DataFrame(df.sum() * 100 / peso_total).to_json()
    return {'tabela_total':tabela_total,'tabela_proporcional':tabela_proporcional}

@app.route('/')
def index():
    return render_template('index.html', ingredientes=get_ingredientes())

@app.route('/calcular_tabela_total', methods=['POST'])
def calcular_tabela_total():
    ingredientes = request.get_json()
    df = pd.read_csv('static/data/tabela_taco.csv',index_col=0)
    df.pop('Restrições')
    df = df.loc[ingredientes.keys()]
    for ingrediente in ingredientes:
        df.loc[ingrediente] = df.loc[ingrediente] * float(ingredientes[ingrediente]['liquido']) / 100
    tabela_total = pd.DataFrame(df.sum()).to_json()
    return {'tabela_total':tabela_total}

@app.route('/calcular_tabela_proporcional', methods=['POST'])
def calcular_tabela_proporcional():
    dados = request.get_json()
    porcoes = dados['porcoes']
    ingredientes = dados['ingredientes']
    df = pd.read_csv('static/data/tabela_taco.csv',index_col=0)
    df.pop('Restrições')
    df = df.loc[ingredientes.keys()]
    peso_total = 0
    for ingrediente in ingredientes:
        df.loc[ingrediente] = df.loc[ingrediente] * float(ingredientes[ingrediente]['liquido']) / 100
        peso_total += float(ingredientes[ingrediente]['liquido'])
    
    tabela_proporcional = pd.DataFrame(df.sum() * peso_total / porcoes).to_json()
    return {'tabela_proporcional':tabela_proporcional}

@app.route('/get_restricoes', methods=['GET'])
def get_restricoes():
    df = pd.read_csv('static/data/tabela_taco.csv')
    restricoes_dict = dict(zip(df['Descrição dos alimentos'],df['Restrições']))
    return jsonify(restricoes_dict)