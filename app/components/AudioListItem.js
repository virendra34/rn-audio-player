import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';
import { fancyTimeFormat } from '../utils/formatTime';

const AudioListItem = ({ title, duration, onOptionPress, onAudioPress, isPlaying, activeListItem }) => {

    const getThumbnailtext = (title) => {
        return <Text>{title?.slice(0, 1)?.toUpperCase()}</Text>
    }

    const renderPlayPauseIcon = (isPlaying) => {
        if (!isPlaying) return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />;
        else return <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onAudioPress}>
                    <View style={styles.leftContainer}>
                        <View style={[styles.thumbnail, {backgroundColor: activeListItem ? color.ACTIVE_BG : color.FONT_LIGHT}]}>
                            <View style={styles.thumbnailText}>
                                {activeListItem ? renderPlayPauseIcon(isPlaying) : getThumbnailtext(title)}
                            </View>
                        </View>
                        <View style={styles.titleContainer}>
                            <View style={styles.title}>
                                <Text numberOfLines={1}>{title}</Text>
                                <Text style={styles.timeText}>{fancyTimeFormat(duration)}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.rightContainer}>
                    <Entypo
                        name="dots-three-vertical"
                        size={20}
                        color={color.FONT_MEDIUM}
                        onPress={onOptionPress}
                        style={{ padding: 10 }}
                    />
                </View>
            </View>
            <View style={styles.separator}></View>
        </>
    )
}

export default AudioListItem

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width - 40,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    rightContainer: {
        flexBasis: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        height: 50,
        flexBasis: 50,
        backgroundColor: color.FONT_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    thumbnailText: {
        fontSize: 22,
        fontWeight: 200,
        color: color.FONT
    },
    titleContainer: {
        width: width - 180,
        paddingLeft: 10,
    },
    title: {
        fontSize: 16,
        color: color.FONT,
    },
    separator: {
        width: width - 80,
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10
    },
    timeText: {
        fontSize: 14,
        color: color.FONT_LIGHT
    }
})