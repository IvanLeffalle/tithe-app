import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
    return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
    divider: {
        borderBottomWidth: 2, // Espesor del borde
        borderBottomColor: '#D1D5DB', // Color gris claro
        width: 100, // Ancho del divisor
        marginBottom: 8,
        marginTop: 8, // Espacio inferior
        height: 2, // Altura del borde
    },
});

export default Divider;
