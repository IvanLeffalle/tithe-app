import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Home from '../screens/Home';
import AddSale from '../screens/AddSale';
import Records from '../screens/Records';
import ByMonth from '../screens/ByMonth';
import Details from '../screens/Details';
import LoginScreen from '../screens/LoginScreen';

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
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />

        </Stack.Navigator >
    );
}

export default function Navigation() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!isAuthenticated ? (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <Stack.Screen
                        name="HomeStack"
                        component={HomeStack}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

