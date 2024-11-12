import React, { useEffect, useState } from "react";
import { View, Text, RefreshControl, TouchableOpacity, ActivityIndicator, FlatList, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Clipboard from 'expo-clipboard';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';  // Importar para obtener el UID del usuario

export default function Records({ navigation }) {
    const currentMonth = new Date().getMonth() + 1;
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [cases, setCases] = useState([]);
    const [month, setMonth] = useState(currentMonth.toString());
    const [year, setYear] = useState("2024");
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totaltithing, setTotalTithing] = useState(0);
    const [userUid, setUserUid] = useState(null);  // Almacenar el UID del usuario autenticado

    useEffect(() => {
        const user = getAuth().currentUser;  // Obtener el usuario autenticado
        if (user) {
            setUserUid(user.uid);  // Guardar el UID del usuario
        }
    }, []);

    useEffect(() => {
        if (userUid) {
            fetchCases();  // Fetch solo si hay un UID de usuario
        }
    }, [month, year, userUid]);  // Dependencias: mes, año y UID del usuario

    const fetchCases = () => {
        setLoading(true);

        if (!userUid) {
            setLoading(false);
            return;
        }

        const salesDocRef = `${year}-${month}`;
        const casesRef = collection(db, "users", userUid, "sales", salesDocRef, "items");  // Apuntar a la colección de ventas del usuario específico
        const q = query(casesRef, orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const caseData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setCases(caseData);

            const GananciaTotal = caseData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
            setTotalRevenue(GananciaTotal);

            const tith = GananciaTotal * 0.10;
            setTotalTithing(tith);

            setLoading(false);
            setRefreshing(false);
        }, (error) => {
            console.error("Error fetching cases: ", error);
            setLoading(false);
            setRefreshing(false);
        });

        return unsubscribe;
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCases();
    };

    const copyToClipboard = () => {
        const text = `Total Revenue: $${totalRevenue.toFixed(2)}, Tithing: $${totaltithing.toFixed(2)}`;
        Clipboard.setStringAsync(text);
        Alert.alert("Exito!", "Copied to clipboard!");
    };

    return (
        <View className="flex-1 justify-center align-middle">
            <View className="bg-[#222831] p-5 h-full justify-start items-center">
                <Text className="text-[32px] mb-8 font-bold text-gray-800">Welcome Bella!</Text>

                {/* Picker para el mes */}
                <View className="flex-row w-full gap-2 items-center justify-center mb-5">
                    <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 10, overflow: 'hidden', marginBottom: 5 }}>
                        <Picker
                            selectedValue={month}
                            style={{ height: 50, width: 200, backgroundColor: "white" }}
                            onValueChange={(itemValue) => setMonth(itemValue)}
                        >
                            <Picker.Item label="Seleccione un mes..." value="" />
                            <Picker.Item label="Enero" value="1" />
                            <Picker.Item label="Febrero" value="2" />
                            <Picker.Item label="Marzo" value="3" />
                            <Picker.Item label="Abril" value="4" />
                            <Picker.Item label="Mayo" value="5" />
                            <Picker.Item label="Junio" value="6" />
                            <Picker.Item label="Julio" value="7" />
                            <Picker.Item label="Agosto" value="8" />
                            <Picker.Item label="Septiembre" value="9" />
                            <Picker.Item label="Octubre" value="10" />
                            <Picker.Item label="Noviembre" value="11" />
                            <Picker.Item label="Diciembre" value="12" />
                        </Picker>
                    </View>

                    {/* Picker para el año */}
                    <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 10, overflow: 'hidden', marginBottom: 5 }}>
                        <Picker
                            selectedValue={year}
                            style={{ height: 50, width: 120, backgroundColor: "white" }}
                            onValueChange={(itemValue) => setYear(itemValue)}
                        >
                            <Picker.Item label="2023" value="2023" />
                            <Picker.Item label="2024" value="2024" />
                            <Picker.Item label="2025" value="2025" />
                        </Picker>
                    </View>
                </View>

                {/* Mostrar carga o datos */}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={cases}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={() => (
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text style={{ fontSize: 16, color: '#999' }}>No information available</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Details", { data: item, month: month, year: year, userUid: userUid })}
                                style={styles.button}
                                className="p-2 rounded-lg w-[250] mb-2 "
                            >
                                <Text className="font-[18] text-center text-[#ECEFF4]">{item.name}</Text>
                                <Text className="font-[14] text-center text-[#ECEFF4]">${item.total}</Text>
                            </TouchableOpacity>

                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#30BFBF"]} />
                        }
                    />
                )}

                {/* Mostrar total de ingresos y diezmo */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <Text className="font-bold text-lg text-[#ECEFF4]">Ganancia Total del {month}/{year} : ${totalRevenue.toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text className="font-bold text-lg text-[#ECEFF4]">Diezmo: ${totaltithing.toFixed(2)}</Text>
                    <TouchableOpacity onPress={copyToClipboard} style={{ marginLeft: 10 }}>
                        <Ionicons name="copy-outline" size={24} color="#ECEFF4" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = {
    button: {
        backgroundColor: '#31363F',
        width: 250,
        margin: 8,
        padding: 15,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
};
