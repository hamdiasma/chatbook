export const stopTracks = (tracks) => {
  tracks &&
    tracks.forEach((track) => {
      track.stop();
    });
};
