import { View, Text, Alert, Pressable, Image, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase'; // Adjust path to your Firebase configuration
import { MaterialIcons } from "@expo/vector-icons";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase';

const app = initializeApp(firebaseConfig); // Initialize Firebase once

// Helper function to format Firestore timestamp
const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString(); // Customize as needed
    }
    return "Invalid date";
};

export default function Details({ route, navigation }) {
    const data = route.params?.data;
    const month = route.params?.month;

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(data?.name || "");
    const [cost, setCost] = useState(data?.cost?.toString() || "");
    const [price, setPrice] = useState(data?.price?.toString() || "");
    const [loading, setLoading] = useState(false);


    if (!data) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Error: No data available</Text>
            </View>
        );
    }

    const onDelete = async () => {
        setLoading(true);
        try {
            const salesDocRef = `${data.year}-${data.monthName}`; // Ensure this matches the add function
            const docRef = doc(db, "sales", salesDocRef, "items", data.id);
            await deleteDoc(docRef);
            navigation.goBack();
            Alert.alert("Success", "Item deleted successfully");
        } catch (error) {
            console.error("Error deleting document: ", error);
            Alert.alert("Error", "Failed to delete item.");
        } finally {
            setLoading(false);
        }
    };



    const confirmDelete = () => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: onDelete, style: "destructive" },
            ]
        );
    };


    const saveChanges = async () => {
        setLoading(true); // Start loading
        try {
            // Reference the document using the month and id
            const salesDocRef = `${data.year}-${data.monthName}`; // Ensure this matches the add function
            const docRef = doc(db, "sales", salesDocRef, "items", data.id);
            await updateDoc(docRef, {
                name,
                cost: parseFloat(cost),
                price: parseFloat(price),
            });

            // Update local state to reflect changes
            data.name = name; // Update the name
            data.cost = parseFloat(cost); // Update the cost
            data.price = parseFloat(price); // Update the price

            Alert.alert("Success", "Item updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating document: ", error);
            Alert.alert("Error", "Failed to update item.");
        } finally {
            setLoading(false); // Stop loading
        }
    };


    return (
        <View className="flex-1 p-5 align-middle">
            <View className="bg-red-200 p-5 rounded-2xl justify-start items-center flex-1">
                {isEditing ? (
                    <>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Item Name"
                            className="border-b mb-4 w-full"
                        />
                        <TextInput
                            value={cost}
                            onChangeText={setCost}
                            placeholder="Cost"
                            keyboardType="numeric"
                            className="border-b mb-4 w-full"
                        />
                        <TextInput
                            value={price}
                            onChangeText={setPrice}
                            placeholder="Price"
                            keyboardType="numeric"
                            className="border-b mb-4 w-full"
                        />
                        <Pressable onPress={saveChanges} style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 10 }}>
                            <Text style={{ color: '#fff' }}>Save Changes</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text className="text-[32px] mb-8 font-bold text-gray-800">Welcome Bella!</Text>
                        <Image source={require("../assets/aleliLogo.png")} className="h-[120] w-[120] mb-12" />
                        <Text className="text-xl font-bold mb-4">{data.name}</Text>
                        <View className="bg-[#f9fafb] p-4 rounded-lg mb-4 items-center">
                            <Text className=" text-gray-600 font-bold mb-2">Cost: ${data.cost}</Text>
                            <Text className=" text-gray-600 font-bold mb-2">Price: ${data.price}</Text>
                            <Text className=" text-gray-600 font-bold mb-2">Revenue: ${data.revenue}</Text>
                            <Text className=" text-gray-600 font-bold mb-2">Date: {formatTimestamp(data.date)}</Text>
                        </View>
                        <View className="flex-row pt-5 justify-center w-full gap-3">
                            <Pressable onPress={() => setIsEditing(true)} style={{ backgroundColor: '#000', padding: 10, borderRadius: 5 }}>
                                <MaterialIcons name="edit" size={24} color="#fae13f" />
                            </Pressable>
                            <Pressable onPress={confirmDelete} style={{ backgroundColor: '#f00', padding: 10, borderRadius: 5 }}>
                                <MaterialIcons name="delete" size={24} color="#fff" />
                            </Pressable>
                        </View>
                    </>
                )}
                {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
            </View>
        </View>
    );
}
