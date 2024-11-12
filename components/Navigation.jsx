import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Home from '../screens/Home';
import AddSale from '../screens/AddSale';
import Records from '../screens/Records';
import ByMonth from '../screens/ByMonth';
import Details from '../screens/Details';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{
                headerStyle: {
                    backgroundColor: '#31363F',

                },
                headerTintColor: '#ECEFF4',
                headerTitle: 'Inicio'
            }}
            />
            <Stack.Screen name="Add" component={AddSale} options={{ headerTitle: 'Agregar venta' }} />
            <Stack.Screen name="Mes" component={ByMonth} />
            <Stack.Screen name="Records" component={Records} options={{ headerTitle: 'Registros' }} />
            <Stack.Screen name="Details" component={Details} options={{ headerTitle: 'Detalles de venta' }} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
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
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}

                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <Stack.Screen
                        name="HomeStack"
                        component={HomeStack}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
