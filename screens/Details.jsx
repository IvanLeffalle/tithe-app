import { View, Text, Alert, Pressable, Image, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from "react";
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { MaterialIcons } from "@expo/vector-icons";
import Divider from '../components/Divider';

export default function Details({ route, navigation }) {
    const data = route.params?.data;
    const month = route.params?.month;
    const year = route.params?.year;
    const userUid = route.params?.userUid;  // Necesitamos pasar el UID del usuario desde la pantalla anterior

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(data?.name || "");
    const [gasto1, setGasto1] = useState(data?.gasto1?.toString() || "");
    const [gasto2, setGasto2] = useState(data?.gasto2?.toString() || "");
    const [gasto3, setGasto3] = useState(data?.gasto3?.toString() || "");
    const [cost, setCost] = useState(data?.cost?.toString() || "");
    const [price, setPrice] = useState(data?.price?.toString() || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            console.log("Datos recibidos:", data);  // Asegúrate de que los datos llegan correctamente
            setName(data.name);
            setGasto1(data.gasto1?.toString() || "");
            setGasto2(data.gasto2?.toString() || "");
            setGasto3(data.gasto3?.toString() || "");
            setCost(data.cost?.toString() || "");
            setPrice(data.price?.toString() || "");
        }
    }, [data]);

    useEffect(() => {
        console.log("User UID:", userUid);
        console.log("Month:", month);
        console.log("Year:", year);
    }, [userUid, month, year]);


    if (!data) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Error: No data available</Text>
            </View>
        );
    }

    const onDelete = async () => {
        setLoading(true);
        try {
            const salesDocRef = `${year}-${month}`;
            const docRef = doc(db, `users/${userUid}/sales/${salesDocRef}/items`, data.id);
            // Referencia al item específico del usuario
            await deleteDoc(docRef);
            navigation.goBack();
            Alert.alert("Éxito", "Artículo eliminado correctamente");
        } catch (error) {
            console.error("Error deleting document: ", error);
            Alert.alert("Error", "No se ha podido eliminar el elemento.");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Confirmación",
            "¿Seguro que quieres eliminar este elemento?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: onDelete, style: "destructive" },
            ]
        );
    };

    const saveChanges = async () => {
        if (!name || !gasto1 || !gasto2 || !gasto3 || !cost || !price) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        setLoading(true);
        try {
            const salesDocRef = `${year}-${month}`;
            const docRef = doc(db, `users/${userUid}/sales/${salesDocRef}/items`, data.id);
            // Referencia al item específico del usuario        
            console.log(docRef);  // Referencia al item específico del usuario
            await updateDoc(docRef, {
                name,
                gasto1: parseFloat(gasto1),
                gasto2: parseFloat(gasto2),
                gasto3: parseFloat(gasto3),
                cost: parseFloat(cost),
                price: parseFloat(price),
            });

            data.name = name;
            data.gasto1 = parseFloat(gasto1);
            data.gasto2 = parseFloat(gasto2);
            data.gasto3 = parseFloat(gasto3);
            data.cost = parseFloat(cost);
            data.price = parseFloat(price);

            Alert.alert("Éxito", "Se ha actualizado correctamente.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating document: ", error);
            Alert.alert("Error", "Error al actualizar el elemento.");
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
        }
        return "Fecha no válida";
    };

    return (
        <View className="flex-1 justify-center items-center">
            <View className="bg-[#222831] p-5 justify-start items-center flex-1 w-full">
                {isEditing ? (
                    <>
                        {/* Detalle */}
                        <View className="w-full mb-5">
                            <Text className="text-lg font-bold mb-2 text-[#ECEFF4]">Detalle:</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Item Name"
                                className="border-b border-gray-300 py-2 px-3 text-lg text-[#ECEFF4]"
                            />
                        </View>

                        {/* Gasto #1 */}
                        <View className="w-full mb-5">
                            <Text className="text-lg font-bold mb-2 text-[#ECEFF4]">Gasto #1:</Text>
                            <TextInput
                                value={gasto1}
                                onChangeText={setGasto1}
                                placeholder="Cost"
                                keyboardType="numeric"
                                className="border-b border-gray-300 py-2 px-3 text-lg text-[#ECEFF4]"
                            />
                        </View>

                        {/* Gasto #2 */}
                        <View className="w-full mb-5">
                            <Text className="text-lg font-bold mb-2 text-[#ECEFF4]">Gasto #2:</Text>
                            <TextInput
                                value={gasto2}
                                onChangeText={setGasto2}
                                placeholder="Cost"
                                keyboardType="numeric"
                                className="border-b border-gray-300 py-2 px-3 text-lg text-[#ECEFF4]"
                            />
                        </View>

                        {/* Gasto #3 */}
                        <View className="w-full mb-5">
                            <Text className="text-lg font-bold mb-2 text-[#ECEFF4]">Gasto #3:</Text>
                            <TextInput
                                value={gasto3}
                                onChangeText={setGasto3}
                                placeholder="Cost"
                                keyboardType="numeric"
                                className="border-b border-gray-300 py-2 px-3 text-lg text-[#ECEFF4]"
                            />
                        </View>

                        {/* Precio de Venta */}
                        <View className="w-full mb-5">
                            <Text className="text-lg font-bold mb-2 text-[#ECEFF4]">Precio de Venta:</Text>
                            <TextInput
                                value={price}
                                onChangeText={setPrice}
                                placeholder="Price"
                                keyboardType="numeric"
                                className="border-b border-gray-300 py-2 px-3 text-lg text-[#ECEFF4]"
                            />
                        </View>

                        {/* Botón de guardar */}
                        <Pressable
                            onPress={saveChanges}
                            className="bg-[#76ABAE] p-4 rounded-lg mt-5 items-center"
                        >
                            <Text className="text-lg font-bold">Guardar Cambios</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Image source={require("../assets/Logo.png")} className="h-[120] w-[120] mb-12" />
                        <View className="bg-[#f9fafb] p-4 rounded-lg mb-4 items-center w-full">
                            <Text className="text-xl font-bold ">{data.name}</Text>
                        </View>
                        <View className="bg-[#f9fafb] p-4 rounded-lg mb-4 items-center w-full">
                            <Text className="text-gray-600 font-bold mb-2">Gasto 1: ${data.gasto1}</Text>
                            <Text className="text-gray-600 font-bold mb-2">Gasto 2: ${data.gasto2}</Text>
                            <Text className="text-gray-600 font-bold mb-2">Gasto 3: ${data.gasto3}</Text>
                            <Divider />
                            <Text className="text-gray-600 font-bold mb-2">Costo Total: ${data.cost}</Text>
                            <Text className="text-gray-600 font-bold mb-2">Precio de Venta: ${data.price}</Text>
                            <Text className="text-gray-600 font-bold mb-2">Ganancia Total: ${data.total}</Text>
                            <Divider />
                            <Text className="text-gray-600 font-bold mb-2">Fecha: {formatTimestamp(data.date)}</Text>
                        </View>
                        <View className="flex-row pt-5 justify-center w-full gap-3">
                            <Pressable onPress={() => setIsEditing(true)} style={{ backgroundColor: '#76ABAE', padding: 10, borderRadius: 5 }}>
                                <MaterialIcons name="edit" size={24} color="#222831" />
                            </Pressable>
                            <Pressable onPress={confirmDelete} style={{ backgroundColor: '#f00', padding: 10, borderRadius: 5 }}>
                                <MaterialIcons name="delete" size={24} color="#222831" />
                            </Pressable>
                        </View>
                    </>
                )}
                {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
            </View>
        </View>
    );
}
