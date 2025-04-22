import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import LottieView from 'lottie-react-native'; 
import { useNavigation } from '@react-navigation/native';

function Visualise({ route }) {
  const { deviceId, deviceData } = route.params; 
  const navigation = useNavigation();
  const [selectedGraph, setSelectedGraph] = useState('poids'); 
  const [startDate, setStartDate] = useState(new Date()); 
  const [filteredData, setFilteredData] = useState(deviceData); 
  const [loading, setLoading] = useState(true); 

  const getPreviousMonday = (date) => {
    const dayOfWeek = date.getDay();
    const previousMonday = new Date(date);
    previousMonday.setDate(date.getDate() - dayOfWeek); 
    return previousMonday;
  };

  const getNextSunday = (date) => {
    const nextSunday = new Date(date);
    nextSunday.setDate(date.getDate() + (7 - nextSunday.getDay())); 
    return nextSunday;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    const previousMonday = getPreviousMonday(startDate);
    const nextSunday = getNextSunday(previousMonday);

    setFilteredData(
      deviceData
        .filter(dataPoint => {
          const dataDate = new Date(dataPoint.timestamp);
          return dataDate >= previousMonday && dataDate <= nextSunday;
        })
        .reverse() 
    );


    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [startDate, deviceData]);


const chartData = {
  labels: [], 
  datasets: [
    {
      data: [],
      color: (opacity = 1) => {
        switch (selectedGraph) {
          case 'temperature':
            return `rgba(0, 255, 0, ${opacity})`; 
          case 'humidite':
            return `rgba(0, 0, 255, ${opacity})`; 
          default:
            return `rgba(255, 140, 0, ${opacity})`; 
        }
      },
      strokeWidth: 2, 
    },
  ],
  legend: [
    selectedGraph === 'poids'
      ? 'Poids (kg)'
      : selectedGraph === 'temperature'
      ? 'Température (°C)'
      : 'Humidité (%)',
  ], 
};


const uniqueDates = new Set();

filteredData.forEach((dataPoint) => {
  const date = new Date(dataPoint.timestamp);
  const formattedDate = `${date.getDate()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;

  if (!uniqueDates.has(formattedDate)) {
    uniqueDates.add(formattedDate);
    chartData.labels.push(formattedDate); 
  }

  switch (selectedGraph) {
    case 'temperature':
      chartData.datasets[0].data.push(dataPoint.temperature);
      break;
    case 'humidite':
      chartData.datasets[0].data.push(dataPoint.humidite);
      break;
    default:
      chartData.datasets[0].data.push(dataPoint.poids);
      break;
  }
});


  
  const goToPreviousWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(newDate);
  };


  const goToNextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(newDate);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/hiveload.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      </View>
    );
  }

  return (

    <View style={styles.container}>


      <Text style={styles.title}>Visualisation for {deviceId}</Text>
      
      <TouchableOpacity
  style={styles.averageButton}
  onPress={() => navigation.navigate('Average', {
    deviceData: filteredData, 
    startDate: getPreviousMonday(startDate).toISOString().split('T')[0],
    endDate: getNextSunday(startDate).toISOString().split('T')[0],
  })}
>
  <Text style={styles.buttonText}>View Averages</Text>
</TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedGraph === 'poids' && styles.buttonActive]}
          onPress={() => setSelectedGraph('poids')}
        >
          <Text style={styles.buttonText}>Poids</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedGraph === 'temperature' && styles.selectedTempButton]}
          onPress={() => setSelectedGraph('temperature')}
        >
          <Text style={styles.buttonText}>Temperature</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedGraph === 'humidite' && styles.selectedHumidityButton]}
          onPress={() => setSelectedGraph('humidite')}
        >
          <Text style={styles.buttonText}>Humidity</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateNavigation}>
        <TouchableOpacity style={styles.navigationButton} onPress={goToPreviousWeek}>
          <Text style={styles.navigationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {`${(startDate.getDate() - 2).toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')} - ${getNextSunday(startDate).getDate().toString().padStart(2, '0')}/${(getNextSunday(startDate).getMonth() + 1).toString().padStart(2, '0')}`}
        </Text>

        {!isToday(startDate) ? (
          <TouchableOpacity style={styles.navigationButton} onPress={goToNextWeek}>
            <Text style={styles.navigationButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.currentDateText}>Current Week</Text>
        )}
      </View>

      {filteredData.length > 0 ? (
        <View style={styles.chartContainer}>
        <TouchableOpacity 
          style={styles.invisibleButton}
          onPress={() => navigation.navigate('ChartDetails', { 
            deviceId, 
            selectedGraph, 
            filteredData 
          })}
        />
      
        <LineChart
          data={chartData}
          width={420} 
          height={300} 
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1} 
          chartConfig={{
            backgroundColor: '#7c6d3c',
            backgroundGradientFrom: '#7c6d3c',
            backgroundGradientTo: '#7c6d3c',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#FF8C00' },
            fillShadowGradient: '#f9d403', 
            fillShadowGradientOpacity: 0.5,
          }}
          bezier
          style={styles.chart}
        />
      </View>
      
      ) : (
        <View style={styles.noDataContainer}>
          <LottieView
            source={require('../assets/nodata.json')} 
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.noDataText}>No data available for the selected week.</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {filteredData.map((dataPoint, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={require('../assets/H.png')} 
              style={styles.image}
            />
            <View style={styles.dataContainer}>
              <Text style={styles.timestampTitle}>Timestamp: {new Date(dataPoint.timestamp).toLocaleString()}</Text>
              <Text style={styles.dataLabel}>Poids: {dataPoint.poids} kg</Text>
              <Text style={styles.dataLabel}>Température: {dataPoint.temperature} °C</Text>
              <Text style={styles.dataLabel}>Humidité: {dataPoint.humidite} %</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7c6d3c',
  },
  invisibleButton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', 
    zIndex: 2, 
  },
  chart: {
    borderRadius: 16,
  },
  averageButton: {
    backgroundColor: '#ff8c00',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '50%',
    alignItems: 'center',
  },
  averageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingAnimation: {
    width: 200,
    height: 200, 
  },
  currentDateText: {
    color: 'lightgreen',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#7c6d3c',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#4B3C2E',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 1, 
  },
  buttonActive: {
    backgroundColor: '#FF8C00', 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  navigationButton: {
    backgroundColor: '#306ebb',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  lottieAnimation: {
    width: 300, 
    height: 300, 
  },
  noDataText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
  },
  card: {
    backgroundColor: '#4B3C2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  dataContainer: {
    flex: 1,
  },
  timestampTitle: {
    color: '#f9d403',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dataLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedTempButton: {
    backgroundColor: 'green', 
  },
  selectedHumidityButton: {
    backgroundColor: 'blue', 
  },
});

export default Visualise;
