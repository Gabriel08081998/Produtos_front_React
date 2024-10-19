
import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  const produto ={
    id : 0,
    nome : '',
    marca : '',
    preco : '',
    estoque:''

  }


  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos]= useState ([]);
  const [objProduto, setObjProduto] = useState(produto);

  //obter os produtos
  useEffect(()=>{
    fetch("http://localhost:8080/produto/listar")
    .then(retorno => retorno.json())
    .then(retorno_convertido => setProdutos(retorno_convertido));

  }, []);
// Obtendo os dados do formulario
  const aoDigitar = (e) => {
    setObjProduto({...objProduto, [e.target.name]:e.target.value});
  }
  //cadastrar produto
  const cadastrar = () => {
    fetch ('http://localhost:8080/produto/cadastrar',{
      method:'post',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'

      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido=>{
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      }else{
        setProdutos([...produtos, retorno_convertido]);
        alert('Produto cadastrado com sucesso!');
        limparFormulario();
      }
    })
  }

  //alterar produto
  const alterar = () => {
    fetch ('http://localhost:8080/produto/alterar',{
      method:'put',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'

      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido=>{

      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      }else{
        //mensagem
        alert('Produto alterado com sucesso!');

         //copia de vetor de produtos
      let vetorTemp =[...produtos];

      //indice
      let indice =vetorTemp.findIndex((p)=>{
        return p.id === objProduto.id;
      });
      //alterar produto do vetorTemp
      vetorTemp[indice] = objProduto;

      //atualizar o vetor de produtos
      setProdutos(vetorTemp);

        //limpar o formulario
        limparFormulario();
      }
    })
  }

   //remover produto
   const remover = () => {
    fetch ('http://localhost:8080/produto/remover/'+objProduto.id,{
      method:'delete',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'

      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido=>{
      
      //mensagem 
      alert (retorno_convertido.mensagem);

      //copia de vetor de produtos
      let vetorTemp =[...produtos];

      //indice
      let indice =vetorTemp.findIndex((p)=>{
        return p.id === objProduto.id;
      });
      //remover produto do vetorTemp
      vetorTemp.splice(indice, 1);

      //atualizar o vetor de produtos
      setProdutos(vetorTemp);

      //limpaar formulario
      limparFormulario();
    })
  }

  //limpar formulario
  const limparFormulario= () =>{
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  //selecionar produtos
  const selecionarProduto = (indice) =>{
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }

//retorno
  return (
    <div>
     <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar}obj = {objProduto} cancelar = {limparFormulario} remover={remover} alterar={alterar}/>  
     <Tabela vetor ={produtos} selecionar ={selecionarProduto}/>
    </div>
  );
}

export default App;
