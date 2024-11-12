import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';  // Importamos Firebase Authentication
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddSale({ navigation }) {
    const [name, onChangeName] = useState('');
    const [costo, onChangeCosto] = useState('');
    const [venta, onChangeVenta] = useState('');
    const [gasto1, onChangeGasto1] = useState('');
    const [gasto2, onChangeGasto2] = useState('');
    const [gasto3, onChangeGasto3] = useState('');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null); // Para llevar el seguimiento del campo enfocado
    const [userUid, setUserUid] = useState(null);

    // Obtener el UID del usuario autenticado
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserUid(user.uid); // Guardamos el UID del usuario autenticado
        }
    }, []);

    const handleSave = async () => {
        if (!userUid) {
            Alert.alert("Error", "No hay usuario autenticado.");
            return;
        }

        const gasto1Value = Number(gasto1) || 0;
        const gasto2Value = Number(gasto2) || 0;
        const gasto3Value = Number(gasto3) || 0;
        const totalGastos = gasto1Value + gasto2Value + gasto3Value;
        const revenue = Number(venta) - Number(costo);
        const total = revenue - totalGastos;

        if (!name || !gasto1 || !venta) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Usamos el UID del usuario para crear una colección específica para cada uno
        const salesDocRef = doc(db, `users/${userUid}/sales/${year}-${month}`);  // Creación de una colección por usuario
        const itemsCollectionRef = collection(salesDocRef, "items");

        setLoading(true);
        try {
            await addDoc(itemsCollectionRef, {
                name: name,
                gasto1: gasto1Value,
                gasto2: gasto2Value,
                gasto3: gasto3Value,
                cost: totalGastos,
                price: Number(venta),
                revenue: revenue,
                total: total,
                date: date,
                monthName: month,
                year: year,
                timestamp: serverTimestamp()  // Puedes agregar un timestamp si lo deseas
            });

            Alert.alert("Éxito", "Venta guardada!");
            // Limpiar campos
            onChangeName('');
            onChangeCosto('');
            onChangeVenta('');
            onChangeGasto1('');
            onChangeGasto2('');
            onChangeGasto3('');
        } catch (e) {
            console.error("Error al agregar el documento: ", e);
            Alert.alert("Error", e.message || "No se pudo guardar la venta.");
        } finally {
            setLoading(false);
        }
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        hideDatePicker();
    };

    const handleFocus = (inputName) => {
        setFocusedInput(inputName); // Actualiza el estado cuando un campo es enfocado
    };

    const handleBlur = () => {
        setFocusedInput(null); // Restaura el estado cuando el campo pierde el foco
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center align-middle">
                    <View className="flex-1  bg-[#222831] items-center justify-start p-6 shadow-lg">
                        {/* Detalle */}
                        <TextInput
                            className={`bg-[#31363F] w-full mb-5 p-2 rounded-lg shadow-lg text-center border-2 text-[#ECEFF4] ${focusedInput === 'name' ? 'border-[#76ABAE]' : 'border-[#ECEFF4]'}`}
                            onChangeText={onChangeName}
                            value={name}
                            placeholder="Detalle"
                            placeholderTextColor="#EEEEEE"
                            onFocus={() => handleFocus('name')}
                            onBlur={handleBlur}
                        />

                        {/* Gasto 1 */}
                        <TextInput
                            className={`bg-[#31363F] w-full mb-5 p-2 rounded-lg shadow-lg text-center border-2 text-[#ECEFF4] ${focusedInput === 'gasto1' ? 'border-[#76ABAE]' : 'border-[#ECEFF4]'}`}
                            onChangeText={onChangeGasto1}
                            value={gasto1}
                            placeholder="Gasto 1"
                            keyboardType="numeric"
                            placeholderTextColor="#EEEEEE"
                            onFocus={() => handleFocus('gasto1')}
                            onBlur={handleBlur}
                        />

                        {/* Gasto 2 */}
                        <TextInput
                            className={`bg-[#31363F] w-full mb-5 p-2 rounded-lg shadow-lg text-center border-2 text-[#ECEFF4] ${focusedInput === 'gasto2' ? 'border-[#76ABAE]' : 'border-[#ECEFF4]'}`}
                            onChangeText={onChangeGasto2}
                            value={gasto2}
                            placeholder="Gasto 2 (Opcional)"
                            keyboardType="numeric"
                            placeholderTextColor="#EEEEEE"
                            onFocus={() => handleFocus('gasto2')}
                            onBlur={handleBlur}
                        />

                        {/* Gasto 3 */}
                        <TextInput
                            className={`bg-[#31363F] w-full mb-5 p-2 rounded-lg shadow-lg text-center border-2 text-[#ECEFF4] ${focusedInput === 'gasto3' ? 'border-[#76ABAE]' : 'border-[#ECEFF4]'}`}
                            onChangeText={onChangeGasto3}
                            value={gasto3}
                            placeholder="Gasto 3 (Opcional)"
                            keyboardType="numeric"
                            placeholderTextColor="#EEEEEE"
                            onFocus={() => handleFocus('gasto3')}
                            onBlur={handleBlur}
                        />

                        {/* Precio de Venta */}
                        <TextInput
                            className={`bg-[#31363F] w-full mb-5 p-2 rounded-lg shadow-lg text-center border-2 text-[#ECEFF4] ${focusedInput === 'venta' ? 'border-[#76ABAE]' : 'border-[#ECEFF4]'}`}
                            onChangeText={onChangeVenta}
                            value={venta}
                            placeholder="Precio de Venta"
                            keyboardType="numeric"
                            placeholderTextColor="#EEEEEE"
                            onFocus={() => handleFocus('venta')}
                            onBlur={handleBlur}
                        />

                        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
                            <Text className="text-center text-[18px] font-bold text-[#ECEFF4]">
                                {date.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            date={date}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="justify-center text-center font-bold text-[20px] ">Guardar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = {
    dateButton: {
        backgroundColor: '#31363F',
        width: '100%',
        padding: 12,
        marginVertical: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#76ABAE',
        width: 250,
        margin: 8,
        padding: 15,
        borderRadius: 10,
        elevation: 5,
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    }
};
