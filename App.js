import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login'; 
import Acceuil from './components/Acceuil'; 
import Visualise from './components/Visualise';
import Intro from './components/Intro';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import Home from './components/Home';
import Average from './components/Average';
import ChartDetails from './components/ChartDetails';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { fetchData } from './data/DataGetter';

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    const showNotification = async () => {
      try {
        console.log("📲 Requesting permission...");
        await notifee.requestPermission();

        console.log("📣 Creating channel...");
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        // Function to fetch data and show notifications
        const fetchDataAndShowNotification = async () => {
          try {
            const data = await fetchData();  // Call fetchData directly

            const today = new Date().toISOString().slice(0, 10);
            let message = 'No data for today yet.';

            let lowWeightMessage = '';

            for (const deviceId in data) {
              const todayRecords = data[deviceId].filter(record =>
                record.timestamp.startsWith(today)
              );

              if (todayRecords.length > 0) {
                const latest = todayRecords[0]; // Or use last if sorted
                message = `📦 Device: ${deviceId}\n⚖️ Weight: ${latest.poids} kg\n🌡️ Temp: ${latest.temperature}°C\n💧 Humidity: ${latest.humidite}%`;

                // Check if the last weight is under 40kg
                if (latest.poids < 40) {
                  lowWeightMessage = `⚠️ ALERT: Weight is below 40kg! Device: ${deviceId}\n⚖️ Weight: ${latest.poids} kg`;
                }
                break;
              }
            }

            // Show general notification
            console.log("🔔 Displaying daily update notification...");
            await notifee.displayNotification({
              title: '📊 Daily Weight Update',
              body: message,
              android: {
                channelId,
              },
            });

            // If weight is under 40kg, show an alert notification
            if (lowWeightMessage) {
              console.log("🔔 Displaying low weight alert...");
              await notifee.displayNotification({
                title: '⚠️ Weight Below 40kg Alert',
                body: lowWeightMessage,
                android: {
                  channelId,
                },
              });
            }
          } catch (err) {
            console.error("⚠️ Error fetching data or notifying:", err.message);
          }
        };

        // Call the notification function immediately when the app is opened
        await fetchDataAndShowNotification();

        // Set interval to show notifications every 6 hours (21600000 ms)
        setInterval(async () => {
          await fetchDataAndShowNotification();
        }, 21600000); // every 6 hours 

      } catch (error) {
        console.error("❌ Notification error:", error);
      }
    };

    showNotification();
  }, []);


  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Acceuil" component={Acceuil} options={{ headerShown: false }} />
        <Stack.Screen name="Visualise" component={Visualise} options={{ headerShown: false }} />
        <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Average" component={Average} options={{ headerShown: false }} />
        <Stack.Screen name="ChartDetails" component={ChartDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
