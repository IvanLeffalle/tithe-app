import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import AddSale from '../screens/AddSale';
import Records from '../screens/Records';
import ByMonth from '../screens/ByMonth';
import Details from '../screens/Details';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        < Stack.Navigator >
            <Stack.Screen name="Home"
                component={Home}
            />
            <Stack.Screen name="Add"
                component={AddSale}
            />
            <Stack.Screen name="Mes"
                component={ByMonth}
            />
            <Stack.Screen name="Records"
                component={Records}
            />
            <Stack.Screen name="Details"
                component={Details}
            />


        </Stack.Navigator >
    );
}
function MyTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
        </Tab.Navigator>
    );
}
export default function Navigation() {

    return (
        <NavigationContainer>
            < Stack.Navigator initialRouteName="Inicio" >
                <Stack.Screen name="Inicio"
                    component={HomeStack}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator >
        </NavigationContainer>
    )
}