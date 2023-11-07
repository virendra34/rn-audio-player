// play 
const play = async (playbackObj, uri) => {
    try {
        return await playbackObj.loadAsync({ uri: encodeURI(uri) }, { shouldPlay: true });
    } catch (error) {
        console.log('error occured in audioController > play: ', error.message);
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

    }
}
// select another

export { play, pause, resume }