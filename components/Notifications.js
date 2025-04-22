import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import homeIcon from '../assets/home.png';
import settingsIcon from '../assets/notification.png';
import profileIcon from '../assets/user.png';
import alertIcon from '../assets/alert.png';
import warningIcon from '../assets/warning.png';
import { fetchData } from '../data/DataGetter';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [todayData, setTodayData] = useState([]);
  const [yesterdayData, setYesterdayData] = useState([]);

  const fetchAndFilterData = async () => {
    try {
      const data = await fetchData();
      const allRecords = [];
      const today = new Date();
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(today.getDate() - 2);

      for (const deviceId in data) {
        allRecords.push(...data[deviceId]);
      }

      const filteredRecords = allRecords
        .filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= twoDaysAgo && recordDate <= today && record.poids < 40;
        })
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const groupedData = filteredRecords.reduce((acc, record) => {
        if (!acc[record.ruche]) {
          acc[record.ruche] = [];
        }
        acc[record.ruche].push(record);
        return acc;
      }, {});

      const notifications = Object.keys(groupedData).map(device => {
        const weights = groupedData[device].map(record => record.poids);
        const trend = weights[weights.length - 1] > weights[0] ? 'increasing' : 'decreasing';

        const todayWeight = groupedData[device].filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate.toDateString() === today.toDateString() && record.poids < 40;
        }).map(record => record.poids);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const yesterdayWeight = groupedData[device].filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate.toDateString() === yesterday.toDateString() && record.poids < 40;
        }).map(record => record.poids);

        return {
          device,
          trend,
          weights,
          todayWeight,
          yesterdayWeight
        };
      });

      const todayRecords = allRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.toDateString() === today.toDateString() && record.poids < 40;
      });

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const yesterdayRecords = allRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.toDateString() === yesterday.toDateString() && record.poids < 40;
      });

      setNotifications(notifications);
      setTodayData(todayRecords);
      setYesterdayData(yesterdayRecords);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
    }
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

  useEffect(() => {
    fetchAndFilterData();
  }, []);

  const handleLongPress = (deviceId) => {
    setSelectedNotification(prev => (prev === deviceId ? null : deviceId));
  };

  const handleDelete = (deviceId) => {
    Alert.alert('Delete', `You selected to delete device ${deviceId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.curvyBarTop}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
          <Image source={homeIcon} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={settingsIcon} style={styles.iconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Profile')}>
          <Image source={profileIcon} style={styles.iconImage} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.notificationsContainer}>
        {notifications.map((item, index) => (
          <View key={index} style={styles.notification}>
            <Image source={warningIcon} style={styles.alertIcon} />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.rucheText}>Device Update</Text>
              <Text style={styles.alertText}>Notice: The data is {item.trend} over time</Text>
              <Text style={styles.currentWeightText}>
                Weights went from {item.weights[0]} to {item.weights[1]} to {item.weights[item.weights.length - 1]}
              </Text>
              {item.todayWeight.length > 0 && (
                <Text style={styles.currentWeightText}>Today's Weights: {item.todayWeight.join(', ')}</Text>
              )}
              {item.yesterdayWeight.length > 0 && (
                <Text style={styles.currentWeightText}>Yesterday's Weights: {item.yesterdayWeight.join(', ')}</Text>
              )}
            </View>

            {selectedNotification === item.device && (
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.device)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.longPressArea} onLongPress={() => handleLongPress(item.device)} />
          </View>
        ))}

        {todayData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Today's Individual Alerts</Text>
            {todayData.map((record, idx) => (
              <View key={idx} style={styles.notification}>
                <Image source={alertIcon} style={styles.alertIcon} />
                <View style={styles.notificationTextContainer}>
                  <Text style={styles.rucheText}>Device: 1D9109{record.deviceId}</Text>
                  <Text style={styles.alertText}>Alert! Weight is under 40 Kg!</Text>
                  <Text style={styles.currentWeightText}>Weight: {record.poids}kg</Text>
                  <Text style={styles.currentWeightText}>Time: {new Date(record.timestamp).toLocaleTimeString()}</Text>
                </View>
              </View>
            ))}
          </>
        )}


        {yesterdayData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Yesterday's Individual Alerts</Text>
            {yesterdayData.map((record, idx) => (
              <View key={idx} style={styles.notification}>
                <Image source={alertIcon} style={styles.alertIcon} />
                <View style={styles.notificationTextContainer}>
                  <Text style={styles.rucheText}>Device: 1D9109 {record.ruche}</Text>
                  <Text style={styles.alertText}>Alert! Weight is under 40 Kg!</Text>
                  <Text style={styles.currentWeightText}>Weight: {record.poids}kg</Text>
                  <Text style={styles.currentWeightText}>Time: {new Date(record.timestamp).toLocaleTimeString()}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7c6d3c' },
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  iconButton: { padding: 10 },
  iconImage: { width: 35, height: 35 },
  notificationsContainer: { marginTop: 100, padding: 15 },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  alertIcon: { width: 40, height: 40, marginRight: 15 },
  notificationTextContainer: { flex: 1 },
  rucheText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  alertText: { fontSize: 16, fontWeight: '600', color: '#d9534f' },
  currentWeightText: { fontSize: 14, color: '#555' },
  deleteButton: {
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  longPressArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
});

export default Notifications;
