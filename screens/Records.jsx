import React, { useEffect, useState } from "react";
import { View, Text, RefreshControl, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Clipboard from 'expo-clipboard';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { TextInput } from "react-native";

export default function Records({ navigation }) {
    const currentMonth = new Date().getMonth() + 1;
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [cases, setCases] = useState([]);
    const [filteredCases, setFilteredCases] = useState([]);  // Estado para los casos filtrados
    const [month, setMonth] = useState(currentMonth.toString());
    const [year, setYear] = useState("2024");
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totaltithing, setTotalTithing] = useState(0);
    const [userUid, setUserUid] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const user = getAuth().currentUser;
        if (user) {
            setUserUid(user.uid);
        }
    }, []);

    useEffect(() => {
        if (userUid) {
            fetchCases();
        }
    }, [month, year, userUid]);

    useEffect(() => {
        filterCases(search);  // Llama a filterCases cada vez que `search` cambia
    }, [search, cases]);

    const fetchCases = () => {
        setLoading(true);

        if (!userUid) {
            setLoading(false);
            return;
        }

        const salesDocRef = `${year}-${month}`;
        const casesRef = collection(db, "users", userUid, "sales", salesDocRef, "items");
        const q = query(casesRef, orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const caseData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setCases(caseData);
            setFilteredCases(caseData);  // Inicializar filteredCases con los datos completos

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

    const filterCases = (text) => {
        const filteredData = cases.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCases(filteredData);
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
            <View className="bg-[#222831] py-5 h-full justify-start items-center">
                <View style={styles.inputContainer}>
                    <Ionicons name="search" size={20} color="#00ADB5" style={styles.searchIcon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Buscar..."
                        onChangeText={(text) => setSearch(text)}
                        value={search}
                        placeholderTextColor="#00ADB5"
                    />
                </View>


                {/* Picker para el mes y año */}
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
                        data={filteredCases}  // Utiliza los datos filtrados
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
                                className="p-2 rounded-lg w-[250] mb-2"
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
        </View >
    );
}

const styles = {
    button: {
        backgroundColor: '#31363F',
        margin: 8,
        padding: 15,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#00ADB5",
        borderRadius: 10,
        width: "80%",
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    textInput: {
        width: "100%",
        height: 40,
        fontSize: 16,
        color: "#ECEFF4",
    },
};