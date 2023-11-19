import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react';
import Screen from '../components/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { pause, play, resume } from '../misc/audioController';

<Slider
  style={{ width: 200, height: 40 }}
  minimumValue={0}
  maximumValue={1}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#000000"
/>

const { width } = Dimensions.get('window');

const Player = () => {
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;

  const calculateSeekBar = () => {
    if (playbackDuration !== null && playbackPosition !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>{context.currentAudioIndex + 1} / {context.totalAudioCount}</Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text
            style={styles.audioTitle}
            numberOfLines={1}>
            {context.currentAudio.filename}
          </Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.FONT}
          />
          <View style={styles.audioController}>
            <PlayerButton iconType="PREV" />
            <PlayerButton iconType={context.isPlaying ? 'PAUSE' : 'PLAY'}
              style={{ marginHorizontal: 25 }}
              onPress={() => {
                if (context.isPlaying) {
                  pause(context.playbackObj);
                } else if (context.soundObj?.isLoaded) {
                  resume(context.playbackObj);
                } else {
                  play(context.playbackObj, context.currentAudio.uri);
                }
                return context.updateState(context, {
                  isPlaying: !context.isPlaying
                });
              }}
            />
            <PlayerButton iconType="NEXT" />
          </View>
        </View>
      </View>
    </Screen>
  )
}

export default Player

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  audioCount: {
    textAlign: 'right',
    padding: 15,
    color: color.FONT_LIGHT,
    fontSize: 14
  },

  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  audioPlayerContainer: {

  },

  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
  },

  audioController: {
    width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  }
})