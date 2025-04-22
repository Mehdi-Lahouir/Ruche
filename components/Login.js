import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  BackHandler,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useFocusEffect } from '@react-navigation/native';
import users from '../data/users.json';

function Login({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    const userFound = users.find(
      (u) => u.username === username && u.password === password
    );

    if (userFound) {
      navigation.navigate('Acceuil');
    } else {
      Alert.alert('Erreur', 'Username or password invalid');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Quit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() }
          ]
        );
        return true; 
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove(); 
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8E9B3" />
      <View style={styles.curvyBarTop} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="grey"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="grey"
          secureTextEntry
        />

        <View style={styles.rememberMeContainer}>
          <Text style={styles.rememberMeText}>Se Souvenir de moi</Text>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: '#767577', true: '#A65E2E' }} 
            thumbColor={rememberMe ? '#F8C15A' : '#f4f3f4'}
          />
        </View>

        <View style={{ flexDirection: 'row', width: '100%' }}>
          <TouchableOpacity style={[styles.button, { flex: 3 }]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginLeft: 8, paddingHorizontal: 0 }]}
            onPress={() => {
              const rnBiometrics = new ReactNativeBiometrics();

              rnBiometrics.simplePrompt({ promptMessage: 'Authenticate with fingerprint' })
                .then((resultObject) => {
                  const { success } = resultObject;

                  if (success) {
                    navigation.navigate('Acceuil');
                  } else {
                    Alert.alert('Authentication cancelled');
                  }
                })
                .catch(() => {
                  Alert.alert('Biometric authentication failed');
                });
            }}
          >
            <Image
              source={require('../assets/fingerprint.png')}
              style={{ width: 30, height: 30, alignSelf: 'center' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.curvyBarBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8E9B3',
  },
  curvyBarTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#F8C15A',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    transform: [{ translateY: -50 }],
  },
  curvyBarBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#F8C15A',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    transform: [{ translateY: 50 }],
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 0,
  },
  input: {
    height: 50,
    borderColor: '#A65E2E',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#FFF5E1',
    width: '100%',
    color : 'black'
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberMeText: {
    fontSize: 16,
    color: '#5D3F2B',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#F8C15A',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#5D3F2B',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  
});

export default Login;
