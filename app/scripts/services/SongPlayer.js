(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};
    /**
    * @desc object representing currently selected album
    * @type {Object}
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject, gets time update from currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function(){
        $rootScope.$apply(function(){
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    };

    /**
    * @function playSong
    * @desc Plays audio file at currentBuzzObject and sets song's playing attribute to true
    * @param {Object} song
    */
    var playSong = function(song){
      currentBuzzObject.play();
      song.playing = true;
    };
    /**
    * @function getSongIndex
    * @desc Returns the index of the song parameter
    * @param {Object} song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };
    /**
    * @function stopSong
    * @desc stops audio file at currentBuzzObject, sets song's playing attribute to null
    * @param {Object} song
    */
    var stopSong = function(song){
      currentBuzzObject.stop();
      song.playing = null;
    };
    /**
    *@desc Active song object from list of songs
    *@type {Object}
    */
    SongPlayer.currentSong = null;

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;


    /**
    * @desc Current volume of song.
    * @type {Number}
    */
    SongPlayer.volume = 60;

    /**
    * @method SongPlayer.play
    * @desc runs the setSong and playSong functions on a new song or paused song.
    * @param {Object} song
    */
    SongPlayer.play = function(song){
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song){
        if (currentBuzzObject.isPaused()){
          playSong(song);
        }
      }
    };

    /**
    * @method SongPlayer.pause
    * @desc Pauses a currently playing audio file and sets corresponding song's playing attribute to false.
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    * @method SongPlayer.previous
    * @desc Plays previous song on album
    */
    SongPlayer.previous = function(song) {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(song);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      };
    };

    /**
    * @method SongPlayer.next
    * @desc Plays next song on album
    */
    SongPlayer.next = function(){
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex > currentAlbum.songs.length){
        stopSong(song);
      } else{
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      };
    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
         currentBuzzObject.setTime(time);
      }
    };

    SongPlayer.setVolume = function (volume){
      if (currentBuzzObject){
        currentBuzzObject.setVolume(volume);
      }
      SongPlayer.volume = volume;
    }

    return SongPlayer;
  };


  angular
  .module('blocJams')
  .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
