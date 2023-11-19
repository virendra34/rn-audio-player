// play 
const play = async (playbackObj, uri) => {
    try {
        return await playbackObj.loadAsync({ uri: encodeURI(uri) }, { shouldPlay: true });
        // return await playbackObj.loadAsync();
    } catch (error) {
        console.log('error occured in audioController > play: ', error.message, uri);
    }
}
// pause
const pause = async (playbackObj) => {
    try {
        return await playbackObj.setStatusAsync({ shouldPlay: false });
    } catch (error) {
        console.log('error occured in audioController > pause: ', error.message);
    }
}
// resume
const resume = async (playbackObj) => {
    try {
        return await playbackObj.playAsync();
    } catch (error) {
        console.log('error occured in audioController > resume: ', error.message);
    }
}
// select another
const playNext = async (playbackObj, uri) => {
    try {
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();

        return await play(playbackObj, uri);
    } catch (error) {
        console.log('error occured in audioController > playNext: ', error.message);
    }
}

export { play, pause, resume, playNext }