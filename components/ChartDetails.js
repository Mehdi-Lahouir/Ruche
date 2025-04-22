import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

function ChartDetails({ route }) {
  const { deviceId, selectedGraph, filteredData } = route.params;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const lineColor =
    selectedGraph.toLowerCase() === 'temperature' 
      ? 'rgba(0, 255, 0, 1)'  
      : selectedGraph.toLowerCase() === 'humidite'
      ? 'rgba(0, 0, 255, 1)'  
      : 'rgba(255, 140, 0, 1)'; 

  const dateLabels = filteredData.map((data) => new Date(data.timestamp).toLocaleDateString());
  const labels = dateLabels.filter((_, index) => index % 5 === 0); 

  const chartData = {
    labels: labels, 
    datasets: [
      {
        data: filteredData.map((data) => data[selectedGraph]),
        color: (opacity = 1) => lineColor, 
        strokeWidth: 2,
        
        propsForDots: {
          r: '6', 
          strokeWidth: '2',
          stroke: '#FF8C00', 
          fill: '#FF8C00',   
        },
      },
    ],
    legend: [selectedGraph.toUpperCase()],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chart Details for {deviceId}</Text>
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={screenHeight - 100} 
          height={screenWidth - 100}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#222',
            backgroundGradientTo: '#333',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={styles.chart}
        />
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
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#fff' 
  },
  chartWrapper: {
    transform: [{ rotate: '90deg' }], 
  },
});

export default ChartDetails;
