import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Image, BackHandler, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Import your icon images
import homeIcon from '../assets/home.png';
import settingsIcon from '../assets/notification.png';
import profileIcon from '../assets/user.png';
import poidsIcon from '../assets/poids.png';
import temperatureIcon from '../assets/temperature.png';
import humiditeIcon from '../assets/humidite.png';
import timestampIcon from '../assets/time.png';
import beehiveImage from '../assets/beehive.png';
import additionalData from '../data/data.json';
import { fetchData } from '../data/DataGetter';

function Acceuil() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showSwipeAnimation, setShowSwipeAnimation] = useState(true); 

  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const fetchDataFromAPI = async () => {
      try {
        const result = await fetchData();
        const mergedData = { ...result, ...additionalData };
        setData(mergedData);
        console.log("Données récupérées:", mergedData); 
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      }
    };

    fetchDataFromAPI();

    return () => clearTimeout(timer);
  }, []);

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
        <ImageBackground
      source={require('../assets/grass.jpeg')} 
      style={styles.fullScreenBackground}
    ></ImageBackground>
      <ImageBackground
        source={require('../assets/beehiveL.jpg')}
        style={styles.backgroundImage}
      />

       <View style={styles.curvyBarTop}>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={homeIcon} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} 
          onPress={() => navigation.navigate('Notifications')} 
        >
          <Image source={settingsIcon} style={styles.iconImage} />
        </TouchableOpacity>

         <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')} 
        >
          <Image source={profileIcon} style={styles.iconImage} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
      

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deviceList}>
          {data && Object.keys(data).map((deviceId) => (
            <TouchableOpacity
              key={deviceId}
              onPress={() => setSelectedDevice(deviceId)}
              style={[styles.deviceButton, selectedDevice === deviceId && styles.selectedDevice]} 
            >
              <ImageBackground
                source={require('../assets/hive.png')} 
                style={styles.deviceImage}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <Text style={[styles.deviceId, selectedDevice === deviceId && styles.selectedDeviceId]}>
                    {deviceId}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dataContainer}>
          {selectedDevice && data[selectedDevice][0] ? (
            <View style={styles.dataEntry}>
              <ImageBackground
                source={beehiveImage} 
                style={styles.beehiveBackground}
                resizeMode="stretch"
              />
              <Text style={styles.dataTitle}></Text>
              <View style={styles.dataContent}>
                <View style={styles.dataRow}>
                  <Image source={poidsIcon} style={styles.icon} />
                  <View style={styles.labelValueContainer}>
                    <Text style={styles.dataLabel}>Poids:</Text>
                    <Text style={styles.dataValue}>{data[selectedDevice][0].poids} kg</Text>
                  </View>
                </View>
                <View style={styles.dataRow}>
                  <Image source={temperatureIcon} style={styles.icon} />
                  <View style={styles.labelValueContainer}>
                    <Text style={styles.dataLabel}>Température:</Text>
                    <Text style={styles.dataValue}>{data[selectedDevice][0].temperature} °C</Text>
                  </View>
                </View>
                <View style={styles.dataRow}>
                  <Image source={humiditeIcon} style={styles.icon} />
                  <View style={styles.labelValueContainer}>
                    <Text style={styles.dataLabel}>Humidité:</Text>
                    <Text style={styles.dataValue}>{data[selectedDevice][0].humidite} %</Text>
                  </View>
                </View>
                <View style={styles.dataRow}>
                  <Image source={timestampIcon} style={styles.icon} />
                  <View style={styles.labelValueContainer}>
                    <Text style={styles.dataLabel}>Timestamp:</Text>
                    <Text style={styles.dataValue}>{data[selectedDevice][0].timestamp}</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            showSwipeAnimation && ( 
              <View style={styles.centeredContainer}>
                <LottieView
                  source={require('../assets/swipe.json')}
                  autoPlay
                  loop={false} 
                  onAnimationFinish={() => setShowSwipeAnimation(false)} 
                  style={styles.swipe}
                />
              </View>
            )
          )}
          {selectedDevice && (
            <TouchableOpacity
              style={styles.visualiseButton}
              onPress={() => navigation.navigate('Visualise', {
                deviceId: selectedDevice,
                deviceData: data[selectedDevice], 
              })}
            >
              <Text style={styles.visualiseButtonText}>Visualise</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7c6d3c',
  },
  curvyBarTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50, 
    backgroundColor: '#FFD700', 
    borderBottomLeftRadius: 80, 
    borderBottomRightRadius: 80, 
    zIndex: 1, 
  },  
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    width: '100%',
    resizeMode: 'cover',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 220,
  },
  deviceList: {
    paddingVertical: 10,
  },
  deviceButton: {
    width: 120,
    height: 120,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden', 
    borderWidth: 2,
    borderColor: 'transparent', 
  },
  deviceImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  overlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDevice: {
    borderColor: '#FFD700', 
  },
  deviceId: {
    marginTop: '50%',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  selectedDeviceId: {
    marginTop: '50%',
    fontSize: 20,
    color: 'orange',
  },
  dataContainer: {
    width: '90%',
    marginVertical: 10,
    alignItems: 'center',
    marginLeft: 25,
    marginTop: 30,
  },
  dataEntry: {
    marginBottom: 10,
    width: '100%',
    position: 'relative',
    alignItems: 'center', 
  },
  beehiveBackground: {
    height: 450, 
    width: "100%",
    left:-6,
    top:-20,
    resizeMode: 'stretch', 
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
    position: 'absolute', 
    top: 80, 
    left: '43%',
    transform: [{ translateX: -50 }],
  },
  dataContent: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: 60, 
    left: '33%',
    transform: [{ translateX: -50 }],
  },
  fullScreenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 10, 
    paddingVertical: 5, 
  },
  icon: {
    width: 45,
    height: 45,
    marginRight: 10, 
  },
  labelValueContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '70%', 
  },
  dataLabel: {
    fontSize: 18,
    color: '#ee9f27',
    fontWeight: 'bold',
    textAlign: 'left', 
  },
  dataValue: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textAlign: 'left', 
  },
  loading: {
    width: 250,
    height: 250,
  },
  swipe: {
    width: 0,
    height: 0,
    top:-50
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualiseButton: {
    marginTop: 20,
    backgroundColor: '#FF8C00', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, 
    top: -105,
    left: -5
  },
  visualiseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Acceuil;
