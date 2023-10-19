import { Modal, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OptionModal = ({ visible }) => {
    return <>
        <StatusBar hidden={visible} />
        <Modal style={styles.container} visible={visible}></Modal>
    </>
}

export default OptionModal

const styles = StyleSheet.create({
    container: {}
})