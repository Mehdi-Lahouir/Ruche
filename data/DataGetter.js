import { Alert } from 'react-native';

function hexToFloatBigEndian(hexValue) {
  try {
    const bytesData = new Uint8Array(hexValue.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const dataView = new DataView(bytesData.buffer);
    const floatVal = dataView.getFloat32(0, false); 
    return Math.round(floatVal * 100) / 100; 
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
}

class WeightRecord {
  constructor(poids, temperature, humidite, timestamp) {
    this.poids = poids;
    this.temperature = temperature;
    this.humidite = humidite;
    this.timestamp = timestamp;
  }

  toDict() {
    return {
      poids: this.poids,
      temperature: this.temperature,
      humidite: this.humidite,
      timestamp: this.timestamp,
    };
  }
}

function decodeSigfoxMessage(hexData, timestamp) {
  const poids = hexToFloatBigEndian(hexData.slice(0, 8));
  let temperature = 0.0;
  let humidite = 0.0;

  if (hexData.length === 24) {
    temperature = hexToFloatBigEndian(hexData.slice(8, 16));
    humidite = hexToFloatBigEndian(hexData.slice(16, 24));
  }

  return new WeightRecord(poids, temperature, humidite, timestamp);
}

async function getFeedData(username, feedKey, apiKey) {
  const url = `https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data`;
  const headers = { 'X-AIO-Key': apiKey };

  try {
    const response = await fetch(url, { headers });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Impossible to fetch data');
    }
  } catch (error) {
    Alert.alert('Error', error.message);
    return [];
  }
}

async function fetchData() {
  const AIO_KEY = '***REMOVED***';
  const AIO_USERNAME = '***REMOVED***';
  const FEED_KEY = 'poids';

  const poidsData = await getFeedData(AIO_USERNAME, FEED_KEY, AIO_KEY);
  const result = {};

  for (const entry of poidsData) {
    const epoch = parseInt(entry.created_epoch, 10);
    const rawValue = entry.value;
    const dateTime = new Date(epoch * 1000).toISOString().slice(0, 19).replace('T', ' ');

    const parts = rawValue.split(';');
    const deviceId = parts.length === 4 ? parts[0] : 'Unknown';
    const poids = parts.length === 4 ? parts[2] : rawValue;

    if (deviceId !== 'Unknown') {
      const record = decodeSigfoxMessage(poids, dateTime);

      if (!result[deviceId]) {
        result[deviceId] = [];
      }

      result[deviceId].push(record.toDict());
    }
  }

  return result;
}

export { fetchData };
