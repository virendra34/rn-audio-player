import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../context/ThemeProvider';

const Player = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);
    const themeStyle = theme ? styles.containerDark : styles.containerLight;
    console.log(theme, themeStyle);
    return (
        <View style={themeStyle}>
            <Text>Player {"\n"}</Text>
            <Button title="Toggle Theme" onPress={() => toggleTheme()}/>
        </View>
    )
}

export default Player

const styles = StyleSheet.create({
    containerDark: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        color: '#fff',
    },
    containerLight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        color: '#000',
    }
});