import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import logo from '../../assets/logo.png';

import styles from './styles';
import api from '../../services/api';


export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const navigation = useNavigation();

    async function loadIncidents() {
        if (loading) return; //ISSO É IMPORTANTE / NAO TENTA FICAR CARREGANDO VARIAS PAGINAS

        //SE EU JÁ CARREGUEI TODOS OS INCIDENTS, NÃO FAZ SENTIDO CARREGAR MAIS
        if (total > 0 && incidents.length == total) return;

        setLoading(true);

        const response = await api.get('/incidents', {
            params: { page }
        });
        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }

    useEffect(() => {
        loadIncidents()
    }, [])

    function handleNavigate(incident) {
        navigation.navigate('Detail', { incident });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logo} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos.</Text>
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia!</Text>

            <FlatList
                data={incidents}
                keyExtractor={item => String(item.id)}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.incident} key={item}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{item.name}</Text>

                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{item.title}
                        </Text>

                        <Text style={styles.incidentProperty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-Br', { style: 'currency', currency: 'BRL' }).format(item.value)}</Text>

                        <TouchableOpacity style={styles.detailsButton} onPress={() => handleNavigate(item)}>
                            <Text style={styles.detailsButtonText}>
                                Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E02041" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}
