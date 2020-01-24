import React, { useState, useEffect } from 'react';

import './style.css';

function DevForm({ cadastroDev }) { //onSubmit dentro de App.js, <DevForm>
    //quando chamar a função onSubmit, dentro de devform, será chamada a 
    //função handleAddDev dentro de App.js.
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [github_username, setGithubUsername] = useState('');
    const [techs, setTechs] = useState('');

    //useEffect recebe dois parametros, primeiro qual funcao ele precisa executar e segundo quando ele precisa executar,
    //como segunda opcao mandamos um array (dependencias do useEffect), como ele está vazio ele executa uma
    //única vez, no caso de variavel, toda vez que a variavel for alterada ele vai executar o useEffect.
    useEffect(() => {
        navigator.geolocation.getCurrentPosition( //retorna um objeto com info das coordenadas.
            (position) => {
                const {latitude, longitude} = position.coords;

                setLatitude(latitude);
                setLongitude(longitude);
            },
            (err) => {
                console.log(err);
            },
            {
                timeout: 30000,
            }
        )
    }, []);

    /* entendimento geral: cadastro as informações, através do form, ao enviar
    eu mando rodar a funcao handleSubmit, quando ele mandar a funcao cadastroDev rodar
    ele vai DevForm, que é a mesma função recebida pela propriedade em App.js, ao ler a propriedade
    ele vai fazer o post, limpar o form e trazer o usuário em tela.
    */
    async function handleSubmit(e) {
        //preventDefault previne o comportamento padrão da página que seria 
        //abrir uma nova página quando fosse submetido o novo dev.
        // The event.preventDefault() method stops the default action of an element from happening. 
        //For example: Prevent a submit button from submitting a form. Prevent a link from following the URL.
        e.preventDefault();

        await cadastroDev({
            github_username,
            techs,
            latitude,
            longitude,
        });
        //alteramos o campo do formulario para vazio.
        setGithubUsername('');
        setTechs('');
    }

    return (
        <>
        <strong>Cadastrar</strong>
        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do GitHub</label>
            <input name="github_username" id="github_username" required placeholder="Username Here :)" value={github_username} onChange={e => setGithubUsername(e.target.value)}></input>
          </div>
          <div className="input-block">
            <label htmlFor="techs">Technologies</label>
            <input name="techs" id="techs" required placeholder="Python, NodeJS..." value={techs} onChange={e => setTechs(e.target.value)}></input>
          </div>
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input type="number" name="latitude" id="latitude" required value={latitude} onChange={e => setLatitude(e.target.value)}></input>
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input type="number" name="longitude" id="longitude" required value={longitude} onChange={e => setLongitude(e.target.value)}></input>
            </div>
          </div>
          <button type="submit">Enviar</button>
        </form>
        </>
    );
};

export default DevForm;