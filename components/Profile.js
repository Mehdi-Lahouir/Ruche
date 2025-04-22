import React,{useCallback} from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import homeIcon from '../assets/home.png';
import settingsIcon from '../assets/notification.png';
import profileIcon from '../assets/user.png';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation, route }) => {
  const username = route.params?.username || 'Unknown User';
  const handleDisconnect = () => {
    navigation.navigate('Login');
  };

    useFocusEffect(
      useCallback(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          navigation.navigate('Home');
          return true;
        });
    
        return () => backHandler.remove(); 
      }, [navigation])
    );

  return (
    <View style={styles.container}>
      <View style={styles.curvyBarTop}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Image source={homeIcon} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Image source={settingsIcon} style={styles.iconImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Image source={profileIcon} style={styles.iconImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContent}>
        <Image source={require('../assets/user.png')} style={styles.profileImage} />
        <Text style={styles.username}>Amine Benabbou</Text>
        <Text style={styles.email}>amineben581@gmail.com</Text>
        <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
          <Text style={styles.disconnectButtonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7c6d3c',
  },
  curvyBarTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#cc8943',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 10,
  },
  iconImage: {
    width: 35,
    height: 35,
  },
  profileContent: {
    marginTop: 120, // Add space to ensure profile content doesn't overlap with top bar
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4, // For Android shadow
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 20,
  },
  disconnectButton: {
    backgroundColor: '#cc8943',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Profile;