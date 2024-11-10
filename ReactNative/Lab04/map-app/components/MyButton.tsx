import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PrimaryGradient from './PrimaryGradient';
import { Colors } from '@/constants/Colors';


interface ButtonProps {
    title: string;
    active: boolean;
}

const MyButton = ({
    title,
    active,
}: ButtonProps) => {

    if (active) {
        return (
            <PrimaryGradient styles={activeStyles.button}>
                <Text style={activeStyles.text}>{title}</Text>
            </PrimaryGradient>
        )
    } else {
        return (
            <View style={notActiveStyles.button}>
                <Text style={notActiveStyles.text}>{title}</Text>
            </View>
        )
    }
}

const activeStyles = StyleSheet.create({
    button: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 100,
    },
    text: {
        color: Colors.light.background,
        fontSize: 16,
        fontWeight: '400'
    }
});

const notActiveStyles = StyleSheet.create({
    button: {
        backgroundColor: Colors.light.background,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 100,
    },
    text: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: '600'
    }
});


export default MyButton;