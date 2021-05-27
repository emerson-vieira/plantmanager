import React from 'react';
import AppLoading from "expo-app-loading";
import { useFonts, Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';

import Routes from './src/routes';

export default function App() {
    const [ fontsLoaded ] = useFonts({
        Jost_400Regular, 
        Jost_600SemiBold
    });

    // useEffect(() => {
    //     // const subscription = Notifications.addNotificationReceivedListener(
    //     //     async notification => {
    //     //         const data = notification.request.content.data.plant as PlantProps;
    //     //     }
    //     // );
    //     // return () => subscription.remove();
    //     async function notifications(){
    //         const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
    //         console.log(allNotifications);
    //     }
    // }, [])


    if(!fontsLoaded)
        return <AppLoading />;

    return (
        <Routes />
    );
}

