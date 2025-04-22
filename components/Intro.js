import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import imageOne from '../assets/logo.png';  
import imageTwo from '../assets/sigfox.png';  

const Intro = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(1)); 

  const handlePress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800, 
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Login');
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={1}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']} 
        style={styles.gradient}
      >
        <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
          <Image source={imageOne} style={styles.image} />
          <Image source={imageTwo} style={styles.image} />
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
  },
  image: {
    width: 300, 
    height: 300, 
    marginVertical: 10, 
    resizeMode: 'contain', 
  },
});

export default Intro;
