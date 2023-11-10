import { Modal, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import color from '../misc/color'

const OptionModal = ({ visible, currentItem, optionsBtns, onClose }) => {
    // console.log({visible, currentItem, optionsBtns, onClose});
    return <>
        {/* <StatusBar hidden={visible} /> */}
        <Modal animationType='slide' transparent visible={visible}>
            <View style={styles.modal}>
                <Text style={styles.title} numberOfLines={2}>{currentItem?.filename}</Text>
                <View styles={styles.optionContainer}>
                    <TouchableWithoutFeedback onPress={optionsBtns.onPressPlayBtn}>
                        <Text style={styles.option}>Play</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={optionsBtns.onPressAddToPlayListBtn}>
                        <Text style={styles.option}>Add to Playlist</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalBg} />
            </TouchableWithoutFeedback>
        </Modal>
    </>
}

export default OptionModal

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.APP_BG,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 10,
        zIndex: 100,
    },
    optionContainer: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        paddingBottom: 0,
        color: color.FONT_MEDIUM
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.FONT,
        paddingVertical: 10,
        letterSpacing: 1
    },
    modalBg: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: color.MODAL_BG,
    }
})