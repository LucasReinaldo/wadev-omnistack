import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Main.css';
import './Sidebar.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

const App = () => {
  const [devs, setDevs] = useState([]); //como serão vários devs criamos recebendo um array.

  //crio uma função para carregar os devs de forma assíncrona, recebendo os dados da api e
  //adicionando no setDevs esses dados, como é um array, ele vai criar um array com todas as infos
  //dos devs, ao final eu acho a funcao para que seja executado.
  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    loadDevs();
  }, []);

  // e é o mesmo que evento, ou seja, ao mudar o estado ou realizar alguma chamada...
  async function handleAddDev(data) {
    //função que envia através do método post para a url cadastrada no backend (rota), os dados a seguir.
    //por isso que a funcao é chamada no form onSubmit, recebendo handleAddDev.
    const response = await api.post('/devs', data);
    
    //esse setDevs é importante para que ao add um novo dev, ele já carregue na página o novo dev,
    //pois no mesmo array eu pego todos os devs do meu array de devs e por fim o dev que estou enviando
    //as informacoes por último e mostro eles em tela, tanto que no html eu carrego essas informações,
    //através da minha variável e estado devs.
    //tanto que aqui poderia ser utilizado para editar e excluir um dev.
    //Lembrar que useEffect a chamada só ocorre uma vez ao carregara a página, por isso fazemos dessa forma.
    //caso eu colocasse apenas response.data, ele sobrescreveria todos os devs no array. por isso
    //carrego todos os devos que já tenho, e adiciono o ultimo dev através da resposta do post
    //que sao as informacoes que foram adicionadas
    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <DevForm cadastroDev={handleAddDev}/>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
