import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main, //da onde estou importando.
            navigationOptions: { //opções da navegação, existem outras opções
                title: 'WaDev', //Título no cabeçalho do projeto.
            },
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'GitHub'
            },
        },
    }, {
        defaultNavigationOptions: { //aplicada a todas as telas, por isso o default. Container do Header.
            headerTintColor: '#FFF', //alterar a cor do cabeçalho.
            headerBackTitleVisible: false, //não mostra nada para voltar para tela anterior, apenas "<".
            headerStyle: {
                backgroundColor: '#AC3B61',
            },
            headerTitleStyle: {
                fontSize: 21,
                fontWeight: 'bold',
            }
        },
    })
);

export default Routes;