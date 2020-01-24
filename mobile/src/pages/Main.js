import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'; //solicita e pega a localização do user.
import { MaterialIcons} from '@expo/vector-icons'; //todos os icones mais famosos dentro do expo.

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

export default function Main({ navigation }) { //desestruturando pois navigation é nativo para todas as páginas da aplicacao.
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null); //estado para manipular as informações obtidas do usuário.
    const [techs, setTechs] = useState(''); //para pegar o valor digitado

    //ficar monitorando para que sempre que a variável dev altere seu valor, ele faca a verificacao e chamar a funcao dos devs cadastrados.
    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync(); //granted, se deu ou nao permissao para acesso.
            
            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });
               
                const { latitude, longitude } = coords;

                setCurrentRegion({ //lat e long Delta são calculos navais para controlar o zoom.
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                })
            }
        }
        loadInitialPosition();
    }, []);

    //ele vai disparar o novo user, apenas caso eu ja tiver realizado uma busca, pois ele ja vai ter os dados salvos.
    //ate por isso ele vai executar a funcao no loaddevs.
    function setupWebsocket() {
        disconnect(); //para que nao fique com conexoes sobrando ou algo salvo em memória

        const { latitude, longitude } = currentRegion; //regiao do mapa que o usuario esta
        
        connect(latitude, longitude, techs); //aqui estou pegando os dados da regiao e enviando para o websocket, uma vez que ele faz o loaddevs.
        //por isso preciso fazer com que ele receba no socket.js (connection).
    };

    //cria a funcao para carregar os devs recebendo latitude e longitude da posicao atual, por fim salva os devs que encontrou.
    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data.devs); //pq dentro tem um array com a propriedade devs, se retornasse apenas o array, estaria ok deixar .data.
        setupWebsocket();
    };

    function handleRegionChange(region) {
        setCurrentRegion(region);
    }

    //enquanto não tiver valor na currentRegion, ele não vai renderizar nada em tela, para que só mostre o mapa quando ele conseguir as informações do user.
    if (!currentRegion) {
        return null;
    }
    //duas chaves, uma para declarar que é um código JS e outra para declarar que é um objeto JS. Flex 1 para ocupar toda a tela possível.
    //a View foi criada fora do MapView pois será adicionado acima do mapa.
    //TouchbleOpacity, é um botao que diminui um pouco a opacidade ao clicar.
    //onRegionChangeComplete, sempre que o usuário alterar o mapa, ele chama a handleRegion, recebendo um parametro e atualizando o setCurrentRegion com os valores desse parametro.
    return (
        <>
        <MapView onRegionChangeComplete={handleRegionChange}
        initialRegion={currentRegion}
        style={styles.map}
        >
            {devs.map(dev => (
                <Marker 
                    key={dev._id} 
                    coordinate={{ 
                        longitude: dev.location.coordinates[0],
                        latitude: dev.location.coordinates[1],
                    }}
                >
                    <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

                    <Callout onPress={() => {
                        navigation.navigate('Profile', { github_username: dev.github_username });
                    }}>
                        <View style={styles.callout}>
                            <Text style={styles.devName}>{dev.name}</Text>
                            <Text style={styles.devBio}>{dev.bio}</Text>
                            <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                        </View>
                    </Callout>
                </Marker>
            ))}
        </MapView>
        <View style={styles.searchForm}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for techs..."
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}
                value={techs}
                onChangeText={setTechs}
            />
            <TouchableOpacity onPress={loadDevs}style={styles.loadButton}>
                <MaterialIcons name="my-location" size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 15,
        right: 15,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2, //android
    },
    loadButton: {
        width: 40,
        height: 40,
        backgroundColor: '#AC3B61',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
})