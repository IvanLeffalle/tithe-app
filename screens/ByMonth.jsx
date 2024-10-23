import { View, Text, RefreshControl, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

export default function Records({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [months, setMonths] = useState([]);

    useEffect(() => {
        fetchSalesMonths();
    }, []);

    const fetchSalesMonths = async () => {
        setLoading(true);
        try {
            // Obtener documentos de la colección "sales"
            const salesSnapshot = await getDocs(collection(db, "sales"));
            const monthsData = salesSnapshot.docs.map(doc => doc.data());

            setMonths(monthsData);
            console.log("Months data: ", monthsData); // Para verificar los meses obtenidos
        } catch (error) {
            console.error("Error fetching sales months: ", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSalesMonths().then(() => setRefreshing(false));
    };

    const handleMonthPress = (month) => {
        navigation.navigate('Registros', { month: month.monthName });
    };

    return (
        <View className="flex-1 justify-center p-5 align-middle">
            <View className="bg-red-200 p-5 h-full rounded-lg justify-start items-center">
                <Text className="text-[25px] mb-10">Welcome Bella!</Text>
                <Image source={require("../assets/aleliLogo.png")} className="h-[100] w-[100] mb-10" />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={months}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id} // Usa el nombre del mes como clave
                        ListEmptyComponent={() => (
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text style={{ fontSize: 16, color: '#999' }}>No hay meses disponibles</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleMonthPress(item)}>
                                <View className="bg-red-300 p-2 rounded-lg w-[250] mb-2">
                                    <Text className=" font-bold text-center ">
                                        {item.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#30BFBF"]} />
                        }
                    />
                )}
            </View>
        </View>
    );
}
