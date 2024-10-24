import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
    const navigation = useNavigation();
    const appVersion = Constants.expoConfig?.version || "Unknown Version";

    const handleLogout = () => {
        // Add your log-out logic here, such as clearing authentication state
        console.log('User logged out');
        navigation.navigate("Login"); // Redirect to login screen after logging out
    };

    return (
        <View className="flex-1 p-6">
            <View className="flex-1 bg-red-200 rounded-2xl items-center justify-between p-6 shadow-lg">
                <View className="items-center">
                    <Text className="text-[32px] mb-8 font-bold text-gray-800">Welcome Bella!</Text>
                    <Image source={require("../assets/aleliLogo.png")} className="h-[120] w-[120] mb-12" />

                    <View className="flex-row space-x-4">
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Add")}
                            style={styles.buttonWrapper}
                        >
                            <LinearGradient
                                colors={['#e6cece', '#fff5f5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.button}
                            >
                                <MaterialIcons name="add" size={45} color="#1a1a1a" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate("Records")}
                            style={styles.buttonWrapper}
                        >
                            <LinearGradient
                                colors={['#e6cece', '#fff5f5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.button}
                            >
                                <MaterialIcons name="view-list" size={45} color="#1a1a1a" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="items-center">
                    <Text className="text-center text-gray-400 text-sm">Version {appVersion}</Text>
                </View>
            </View>

            {/* Log Out Button */}
            <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
            >
                <Text className="text-center text-white text-lg">Log Out</Text>
            </TouchableOpacity>
        </View>
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
