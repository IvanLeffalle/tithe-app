import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";


export default function Home() {
    const auth = getAuth();
    const navigation = useNavigation();
    const appVersion = Constants.expoConfig?.version || "Unknown Version";

    const [userName, setUserName] = useState("Unknown User");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserName(user.email || "Unknown User");
            } else {
                setUserName("Unknown User");
            }
        });
        return unsubscribe;
    }, [auth]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('User logged out');
                navigation.navigate("Login"); // Redirige después de cerrar sesión
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <View className="flex-1 ">
            <View className="flex-1 bg-[#222831] items-center justify-between p-6 shadow-lg">
                <View className="items-center">
                    <Text className="text-[20px] mb-8 font-bold text-[#ECEFF4] ">Hola, {userName}</Text>
                    <Image source={require("../assets/Logo.png")} className="h-[120] w-[120] mb-12" />

                    <View className="flex-row space-x-4">
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Add")}
                            style={styles.buttonWrapper}
                        >
                            <MaterialIcons name="add" size={45} color="#222831" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate("Records")}
                            style={styles.buttonWrapper}
                        >
                            <MaterialIcons name="view-list" size={45} color="#222831" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Log Out Button */}
                <View className="items-end justify-end">
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.logoutButton}
                    >
                        <Text className="text-center text-white text-lg">Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>


                <View className="items-center">
                    <Text className="text-center text-gray-400 text-sm">Version {appVersion}</Text>
                </View>
            </View>


        </View >
    );
}

const styles = {
    buttonWrapper: {
        width: 90,
        height: 90,
        borderRadius: 20,
        shadowColor: '#bebebe',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 8,
        backgroundColor: '#76ABAE',
        alignItems: 'center',
        justifyContent: 'center',

    },
    button: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: -5, height: -5 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 5,
        shadowColor: '#ffffff',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff5c5c',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
};
