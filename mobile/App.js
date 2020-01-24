import React from 'react';
import { StatusBar, YellowBox } from 'react-native';

import Routes from './src/routes';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);// vai verificar se a mensagem inicia com esse texto e vai remover a caixa de aviso do app.

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#AC3B61" />
      <Routes />
    </>
  );
}
