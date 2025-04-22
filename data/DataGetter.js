import 'dotenv/config';

// Convert big-endian hex string to 32-bit float
function hexToFloatBigEndian(hexValue) {
  try {
    const bytes = new Uint8Array(
      hexValue.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
    const dv = new DataView(bytes.buffer);
    const floatVal = dv.getFloat32(0, false);
    return Math.round(floatVal * 100) / 100;
  } catch (err) {
    throw new Error(`hexToFloatBigEndian error: ${err.message}`);
  }
}

// Structured record for weight data
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

// Decode Sigfox message payload
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

// Fetch raw feed data from Adafruit IO
async function getFeedData(username, feedKey, apiKey) {
  const url = `https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data`;
  const headers = { 'X-AIO-Key': apiKey };

  try {
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
    }
    return await resp.json();
  } catch (err) {
    console.error('Error fetching data:', err.message);
    return [];
  }
}

// Main entry: decode feed into structured records
async function fetchData() {
  const AIO_KEY = process.env.ADAFRUIT_IO_KEY;
  const AIO_USERNAME = process.env.ADAFRUIT_IO_USERNAME;
  const FEED_KEY = 'poids';

  const rawData = await getFeedData(AIO_USERNAME, FEED_KEY, AIO_KEY);
  console.log(`Raw feedData length = ${rawData.length}`);

  const result = {};

  for (const entry of rawData) {
    const epoch = parseInt(entry.created_epoch, 10);
    const rawValue = entry.value;
    const dateTime = new Date(epoch * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const parts = rawValue.split(';');
    const deviceId = parts.length === 4 ? parts[0] : 'Unknown';
    const poidsHex = parts.length === 4 ? parts[2] : rawValue;

    if (deviceId !== 'Unknown') {
      const record = decodeSigfoxMessage(poidsHex, dateTime);
      if (!result[deviceId]) {result[deviceId] = [];}
      result[deviceId].push(record.toDict());
    }
  }

  return result;
}

export { fetchData };

if (process.argv[1].endsWith('DataGetter.js')) {
  (async () => {
    try {
      const data = await fetchData();
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Fatal error:', err);
    }
  })();
}
