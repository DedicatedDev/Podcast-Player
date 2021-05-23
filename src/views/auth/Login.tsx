import * as React from 'react'
import { useState,useContext } from 'react'

import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from 'react-native'
import { TextInput, Button, Text, Title } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EndPoint } from '../../services/network/Endpoint'
import { useNetworkService } from '../../services/network/NetworkService'
import { LoginInfo } from './LoginModel'

const LoginScreen = () => {
  const [email, setEmail] = useState(String)
  const [password, setPassword] = useState()
  const tryLogin = () =>{
    const loginInfo: LoginInfo = {email:email,pass:password};
    const endpoint = new EndPoint({ path: 'api/login', queries: [] });
    
    //useNetworkService()
  }
  //const { loggingIn, doLogin, error } = useContext(mainContext)
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logo}>
          <Image
            source={require('../../assets/logo-color.jpg')}
            style={{ width: 260, height: 100, marginTop: 0 }}
          />
        </View>
        {false && (
          <View style={styles.error}>
            <Title>test is not working</Title>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            theme={{ colors: { primary: '#24aae9' } }}
            placeholder='E-mail adres'
            onChangeText={(email) => setEmail('email')}
            value={email}
            //dense='true'
            label='E-mailadres'
            keyboardType={'email-address'}
            mode='outlined'
            //disabled={loggingIn}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            theme={{ colors: { primary: '#24aae9' } }}
            placeholder='Wachtwoord'
            //dense='true'
            //onChangeText={(password) => setPassword(password)}
            value={password}
            secureTextEntry={true}
            label='Wachtwoord'
            mode='outlined'
            //disabled={loggingIn}
          />
        </View>
        <Button
          style={styles.button}
          mode='outlined'
          //title='Inloggen'
          color='#333'
          //onPress={() => doLogin(email, password)}
          //disabled={loggingIn}
          >
          Inloggen
        </Button>
        <Text
          style={styles.vergeten}
          onPress={() => {
            Linking.openURL(
              'https://app.leadersinfinanceacademy.nl/wachtwoord-vergeten/',
            )
          }}>
          Wachtwoord vergeten?
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
const styles = StyleSheet.create({
  inputContainer: {
    width: '80%',
    marginTop: 20,
  },
  error: {
    backgroundColor: '#f8d7da',
    padding: 10,
    width: '80%',
    borderRadius: 5,
    borderColor: '#f5c6cb',
    marginBottom: 20,
  },
  button: {
    marginTop: 40,
  },
  vergeten: {
    color: '#888888',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    marginTop: 30,
  },
  errortext: {
    color: '#721c24',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    top: 40,
  },
})

export default LoginScreen;
