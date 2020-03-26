import React from 'react';
import { View, TouchableOpacity, Image, Text, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import logo from '../../assets/logo.png';
import { Feather } from '@expo/vector-icons';
import styles from './styles';
import * as MailComposer from 'expo-mail-composer';


export default function Detail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { incident } = route.params;

  const message = 'Olá ' + incident.name + ', estou entrando em contato, pois gostaria de ajudar no caso ' + incident.title + '  com o valor de R$' + incident.value + '.'

  function sendMail(email) {
    MailComposer.composeAsync({
      subject: 'Heroi do caso:',
      recipients: [email],
      body: message
    })
  }

  function sendWhatsApp(whatsapp) {
    Linking.openURL(`whatsapp://send?phone=${whatsapp}&text=${message}`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={28} color="#E02041" />
        </TouchableOpacity>
      </View>

      <View style={styles.incident}>
        <Text style={[styles.incidentProperty, { marginTop: 0 }]}>ONG:</Text>
        <Text style={styles.incidentValue}>{incident.name}</Text>

        <Text style={styles.incidentProperty}>CASO:</Text>
        <Text style={styles.incidentValue}>{incident.description}</Text>

        <Text style={styles.incidentProperty}>VALOR:</Text>
        <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-Br', { style: 'currency', currency: 'BRL' }).format(incident.value)}</Text>
      </View>

      <View style={styles.contactBox}>
        <Text style={styles.heroTitle}>Salve o dia!</Text>
        <Text style={styles.heroTitle}>Seja o heroi desse caso.</Text>
        <Text style={styles.heroDescription}>Entre em contato:</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => sendWhatsApp(incident.whatsapp)} style={styles.action}>
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => sendMail(incident.email)} style={styles.action}>
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
