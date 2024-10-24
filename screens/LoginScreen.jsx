import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import React, { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function LoginScreen() {

    const navigation = useNavigation();
    const route = useRoute();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Signed In');
                const user = userCredential.user;
                console.log(user);
                navigation.navigate("Home");

            })
            .catch((error) => {
                let errorMessage;
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = "El correo electrónico ya ha sido utilizado.";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "El formato del correo electrónico no es válido.";
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = "El tipo de cuenta no está habilitado en este momento.";
                        break;
                    case 'auth/weak-password':
                        errorMessage = "La contraseña es demasiado débil.";
                        break;
                    case 'auth/user-disabled':
                        errorMessage = "Esta cuenta ha sido deshabilitada.";
                        break;
                    case 'auth/user-not-found':
                        errorMessage = "No se encontró ningún usuario con estas credenciales.";
                        break;
                    case 'auth/wrong-password':
                        errorMessage = "La contraseña es incorrecta.";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Has hecho demasiados intentos fallidos. Inténtalo de nuevo más tarde.";
                        break;
                    default:
                        errorMessage = "Se produjo un error inesperado. Inténtalo de nuevo.";
                        break;
                }
                Alert.alert("Error", errorMessage, [{ text: "OK" }]);
            });
    };
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View className="flex-1 p-6 justify-center bg-red-200 ">
                    <View className="rounded-2xl items-center justify-between p-6 shadow-lg">
                        <View className="items-center">
                            <Text className="text-[32px] mb-8 font-bold text-gray-800">Welcome Bella!</Text>
                            <Image source={require("../assets/aleliLogo.png")} className="h-[120] w-[120] mb-12" />


                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    onChangeText={(text) => setEmail(text)}
                                    style={styles.input}
                                    placeholder="ejemplo@gmail.com"
                                />
                            </View>
                            <Text style={styles.label}>Contraseña</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    onChangeText={(text) => setPassword(text)}
                                    style={styles.input}
                                    placeholder="Contraseña"
                                    secureTextEntry={!passwordVisible}
                                />
                                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleSignIn} style={[styles.button, { backgroundColor: '#30BFBF' }]}>
                            <Text style={styles.buttonText}>Ingresar</Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </ScrollView>
        </View >

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    title: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 60,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    login: {
        width: 350,
        height: 500,
        borderColor: '#fff',
        borderWidth: 2,
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    input: {
        width: 250,
        height: 40,
        backgroundColor: '#ffffff90',
        paddingVertical: 10,
        marginHorizontal: 10,

    },
    inputContainer: {
        marginBottom: 20,
        width: 300,
    },
    passwordContainer: {
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#ffffff90',
        marginBottom: 10,
        marginTop: 10,
        borderColor: 'gray',
    },
    button: {
        width: 250,
        height: 45,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#e0e0e0',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    crearCuenta: {
        alignContent: 'center',
        marginVertical: 10,
        textAlign: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 17,
        fontWeight: '400',
        color: 'black'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    linkText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
