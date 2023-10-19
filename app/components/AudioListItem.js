import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const AudioListItem = ({ title, duration, onOptionPress }) => {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <View style={styles.thumbnail}>
                        <View style={styles.thumbnailText}>
                            <Text>{title?.slice(0, 1)?.toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={styles.titleContainer}>
                        <View style={styles.title}>
                            <Text numberOfLines={1}>{title}</Text>
                            <Text style={styles.timeText}>{fancyTimeFormat(duration)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.rightContainer}>
                    <Entypo
                        name="dots-three-vertical"
                        size={20}
                        color={color.FONT_MEDIUM}
                        onPress={onOptionPress}
                    />
                </View>
            </View>
            <View style={styles.separator}></View>
        </>
    )
}

const fancyTimeFormat = (duration) => {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let response = "";

    if (hrs > 0) {
        response += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    response += "" + mins + ":" + (secs < 10 ? "0" : "");
    response += "" + secs;

    return response;
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