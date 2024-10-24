import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddSale({ navigation }) {
    const [name, onChangeName] = useState('');
    const [costo, onChangeCosto] = useState('');
    const [venta, onChangeVenta] = useState('');
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
 const handleSave = async () => {
        const revenue = Number(venta) - Number(costo);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (!name || !costo || !venta) {
            Alert.alert("Error", "All fields are required.");
            return;
        }
        const salesDocRef = doc(db, `sales/${year}-${month}`);
        const itemsCollectionRef = collection(salesDocRef, "items");

        setLoading(true);
        try {
            await addDoc(itemsCollectionRef, {
                name: name,
                cost: Number(costo),
                price: Number(venta),
                revenue: revenue,
                date: date,
                monthName: month,
                year: year
            });

            Alert.alert("Success", "Sale saved!");
            onChangeName('');
            onChangeCosto('');
            onChangeVenta('');
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("Error", e.message || "The sale could not be saved.");
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center p-5 align-middle">
                    <View className="bg-red-200 p-5 h-full  rounded-2xl  justify-start items-center">
                        <Text className="text-[25px] mb-10">Welcome Bella!</Text>
                        <Image source={require("../assets/aleliLogo.png")} className="h-[100] w-[100] mb-10" />
                        <TextInput
                            className="bg-red-300 w-full m-2 p-2 rounded-lg shadow-lg text-center"
                            onChangeText={onChangeName}
                            value={name}
                            placeholder="Name"
                        />
                        <TextInput
                            className="bg-red-300 w-full m-2 p-2 rounded-lg shadow-lg text-center"
                            onChangeText={onChangeCosto}
                            value={costo}
                            placeholder="Cost price"
                            keyboardType="numeric"
                        />
                        <TextInput
                            className="bg-red-300 w-full m-2 p-2 rounded-lg shadow-lg text-center"
                            onChangeText={onChangeVenta}
                            value={venta}
                            placeholder="Sale price"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
                            <Text className="text-center text-[18px] font-bold">
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
                                <Text className="justify-center text-center font-bold text-[20px]">Save</Text>
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
        backgroundColor: '#fca5a5',
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
        backgroundColor: '#fca5a5',
        width: 250,
        margin: 8,
        padding: 15,
        borderRadius: 10,
        elevation: 5,
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    }
};
