import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import LottieView from 'lottie-react-native';

function Average({ route }) {
  const { deviceData } = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require('../assets/calculating.json')}
          autoPlay
          loop
          speed={2.5}
          style={styles.loading}
        />
      </View>
    );
  }

  const totalEntries = deviceData.length;
  const avgPoids = (deviceData.reduce((sum, d) => sum + d.poids, 0) / totalEntries).toFixed(2);
  
  const avgTemperature = (deviceData.reduce((sum, d) => sum + d.temperature, 0) / totalEntries).toFixed(2);
  const avgHumidity = (deviceData.reduce((sum, d) => sum + d.humidite, 0) / totalEntries).toFixed(2);

  const cylinderHeight = 200;
  const waterHeight = (avgPoids / 100) * cylinderHeight;
  const waterColor = avgPoids >= 40 ? 'green' : '#ff0000';

  let weightImage;
  if (avgPoids < 40) {
    weightImage = require('../assets/bad.png');
  } else if (avgPoids <= 55) {
    weightImage = require('../assets/optimal.png');
  } else {
    weightImage = require('../assets/good.png');
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/bees.json')}
        autoPlay
        loop
        speed={1.5}
        style={styles.leftAnimation}
      />

      <Text style={styles.title}>Average Poids</Text>
      <Image source={weightImage} style={styles.weightImage} />

      <View style={styles.backgroundWrapper}>
        <Image source={require('../assets/hon.png')} style={styles.backgroundImage} />

        <Svg height="120" width="300" viewBox="20 0 300 50">
          <Rect x="86" y="35" width={waterHeight * 0.84} height={cylinderHeight} fill={waterColor} />
        </Svg>

        <Text style={styles.overlayText}>{avgPoids} kg</Text>
      </View>

      <View style={styles.dataRow}>
        <Image source={require('../assets/temperature.png')} style={styles.icon} />
        <Text style={styles.dataText}>Temperature: {avgTemperature} °C</Text>
      </View>

      <View style={styles.dataRow}>
        <Image source={require('../assets/humidite.png')} style={styles.icon} />
        <Text style={styles.dataText}>Humidity: {avgHumidity} %</Text>
      </View>
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
  loading: {
    width: 250,
    height: 250,
  },
  leftAnimation: {
    position: 'absolute',
    left: 5, 
    top: '47%',
    transform: [{ translateY: -50 }], 
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  weightImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  backgroundWrapper: {
    position: 'relative',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: -13,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlayText: {
    position: 'absolute',
    top: 170,
    left: 125,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  dataText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
});

export default Average;
