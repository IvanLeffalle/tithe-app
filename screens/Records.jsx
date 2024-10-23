import React, { useEffect, useState } from "react";
import { View, Text, RefreshControl, TouchableOpacity, ActivityIndicator, FlatList, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Clipboard from 'expo-clipboard';  // Import Clipboard for copying
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';  // Import icon library

export default function Records({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [cases, setCases] = useState([]);
    const [month, setMonth] = useState("9"); // Default month as numeric
    const [year, setYear] = useState("2024"); // Default year
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totaltithing, setTotalTithing] = useState(0);

    useEffect(() => {
        fetchCases();
    }, [month, year]); // Fetch cases when month or year changes

    const fetchCases = () => {
        setLoading(true);
        const salesDocRef = `${year}-${month}`; // Combine year and month
        const casesRef = collection(db, "sales", salesDocRef, "items"); // Correct reference
        const q = query(casesRef, orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const caseData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setCases(caseData);

            const total = caseData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
            setTotalRevenue(total);

            const tith = total * 0.10;
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
        <View className="flex-1 justify-center p-5 align-middle">
            <View className="bg-red-200 p-5 h-full  rounded-2xl  justify-start items-center">
                <Text className="text-[32px] mb-8 font-bold text-gray-800">Welcome Bella!</Text>
                <Image source={require("../assets/aleliLogo.png")} className="h-[120] w-[120] mb-12" />

                <View className="flex-row w-full gap-2 items-center justify-center mb-5">
                    <View style={{
                        borderWidth: 1,
                        borderColor: 'black',
                        borderRadius: 10,
                        overflow: 'hidden',
                        marginBottom: 5
                    }}>
                        <Picker
                            selectedValue={month}
                            style={{ height: 50, width: 200, backgroundColor: "white" }}
                            onValueChange={(itemValue) => setMonth(itemValue)}
                        >
                            {/* Picker options for months */}
                            <Picker.Item label="Select a month..." value="" />
                            <Picker.Item label="January" value="1" />
                            <Picker.Item label="February" value="2" />
                            <Picker.Item label="March" value="3" />
                            <Picker.Item label="April" value="4" />
                            <Picker.Item label="May" value="5" />
                            <Picker.Item label="June" value="6" />
                            <Picker.Item label="July" value="7" />
                            <Picker.Item label="August" value="8" />
                            <Picker.Item label="September" value="9" />
                            <Picker.Item label="October" value="10" />
                            <Picker.Item label="November" value="11" />
                            <Picker.Item label="December" value="12" />
                        </Picker>
                    </View>

                    <View style={{
                        borderWidth: 1,
                        borderColor: 'black',
                        borderRadius: 10,
                        overflow: 'hidden',
                        marginBottom: 5
                    }}>
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
                                onPress={() => navigation.navigate("Details", { data: item, month: month })}
                                style={styles.button}
                                className="bg-red-300 p-2 rounded-lg w-[250] mb-2"
                            >
                                <Text className="font-[18] text-center">{item.name}</Text>
                                <Text className="font-[14] text-center">${item.revenue}</Text>
                            </TouchableOpacity>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#30BFBF"]} />
                        }
                    />
                )}

                {/* Display total revenue and tithing */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <Text className="font-bold text-lg">Total {month}/{year} Revenue: ${totalRevenue.toFixed(2)}</Text>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text className="font-bold text-lg">Tithing: ${totaltithing.toFixed(2)}</Text>
                    <TouchableOpacity onPress={copyToClipboard} style={{ marginLeft: 10 }}>
                        <Ionicons name="copy-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = {
    button: {
        backgroundColor: '#fca5a5',
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
