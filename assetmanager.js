class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.bgmCache = [];
        this.sfxCache = [];
        this.bgmDQ = [];
        this.sfxDQ = [];
        this.downloadQueue = [];
    };
    clearEntities() {
        this.cache = [];
        this.downloadQueue = [];
    }
    queueBGMDownload(path) {
        this.bgmDQ.push(path);
    }
    queueSFXDownload(path) {
        this.sfxDQ.push(path);
    }
    queueDownload(path) {
        // console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };
    downloadAll(callback) {
        // if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (var i = 0; i < this.downloadQueue.length; i++) {
            var that = this;

            var path = this.downloadQueue[i];
            // console.log(path);
            var ext = path.substring(path.length - 3);

            switch (ext) {
                case 'jpg':
                case 'png':
                case 'ebp':
                    var img = new Image();
                    img.addEventListener("load", function () {
                        // console.log("Loaded " + this.src);
                        that.successCount++;
                        if (that.isDone()) callback();
                    });

                    img.addEventListener("error", function () {
                        console.log("Error loading " + this.src);
                        that.errorCount++;
                        if (that.isDone()) callback();
                    });

                    img.src = path;
                    this.cache[path] = img;
                    break;
                case 'wav':
                case 'mp3':
                case 'mp4':
                    var aud = new Audio();
                    aud.addEventListener("loadeddata", function () {
                        // console.log("Loaded " + this.src);
                        that.successCount++;
                        if (that.isDone()) callback();
                    });

                    aud.addEventListener("error", function () {
                        console.log("Error loading " + this.src);
                        that.errorCount++;
                        if (that.isDone()) callback();
                    });

                    aud.addEventListener("ended", function () {
                        aud.pause();
                        aud.currentTime = 0;
                    });

                    aud.src = path;
                    aud.load();

                    this.cache[path] = aud;
                    break;
            }
        }
    };
    downloadBGM(callback) {
        for (var i = 0; i < this.bgmDQ.length; i++) {
            var that = this;

            var path = this.bgmDQ[i];
            // console.log(path);
            var ext = path.substring(path.length - 3);

            switch (ext) {
                case 'wav':
                case 'mp3':
                case 'mp4':
                    var aud = new Audio();
                    aud.addEventListener("loadeddata", function () {
                        // console.log("Loaded " + this.src);
                        that.successCount++;
                        if (that.isDone()) callback();
                    });

                    aud.addEventListener("error", function () {
                        console.log("Error loading " + this.src);
                        that.errorCount++;
                        if (that.isDone()) callback();
                    });

                    aud.addEventListener("ended", function () {
                        aud.pause();
                        aud.currentTime = 0;
                    });

                    aud.src = path;
                    aud.load();

                    this.bgmCache[path] = aud;
                    break;
            }
        }
    };
    downloadSFX(callback) {
        for (var i = 0; i < this.sfxDQ.length; i++) {
            var that = this;

            var path = this.sfxDQ[i];
            // console.log(path);
            var ext = path.substring(path.length - 3);

            switch (ext) {
                case 'wav':
                case 'mp3':
                case 'mp4':
                    var aud = new Audio();
                    aud.addEventListener("loadeddata", function () {
                        // console.log("Loaded " + this.src);
                        that.successCount++;
                        if (that.isDone()) callback();
                    });

                    aud.addEventListener("error", function () {
                        console.log("Error loading " + this.src);
                        that.errorCount++;
                        if (that.isDone()) callback();
                    });

                    aud.addEventListener("ended", function () {
                        aud.pause();
                        aud.currentTime = 0;
                    });

                    aud.src = path;
                    aud.load();

                    this.sfxCache[path] = aud;
                    break;
            }
        }
    };
    getAsset(path) {
        return this.cache[path];
    };
    getAudioAsset(path, cache) {
        let audio;
        if (cache == 'bgm')
            audio = this.bgmCache[path];
        else
            audio = this.sfxCache[path];
        return audio;
    };
    playAssetTime(path, time, cache) {
        let audio, volumeid;
        if (cache == 'bgm') {
            audio = this.bgmCache[path];
            volumeid = 'volumebg';
        }
        else {
            audio = this.sfxCache[path];
            volumeid = 'volumesfx';
        }
        if (audio instanceof Audio) {
            audio.currentTime = time;
            audio.volume = document.getElementById(volumeid).value;
            audio.play();
        }
    };
    playAsset(path, cache) {
        let audio, volumeid;
        if (cache == 'bgm') {
            audio = this.bgmCache[path];
            volumeid = 'volumebg';
        }
        else {
            audio = this.sfxCache[path];
            volumeid = 'volumesfx';
        }
        if (audio instanceof Audio) {
            audio.currentTime = 0;
            audio.volume = document.getElementById(volumeid).value;
            audio.play();
        }
    };

    muteAudio(value, cache) {
        let audioCache;
        if (cache == 'bgm')
            audioCache = this.bgmCache;
        else
            audioCache = this.sfxCache;
        for (var key in audioCache) {
            let asset = audioCache[key];
            if (asset instanceof Audio) {
                asset.muted = value;
            }
        }
    };

    adjustVolume(volume, cache) {
        let audioCache;
        if (cache == 'bgm')
            audioCache = this.bgmCache;
        else
            audioCache = this.sfxCache;
        for (var key in audioCache) {
            let asset = audioCache[key];
            if (asset instanceof Audio) {
                asset.volume = volume;
            }
        }
    };

    pauseAsset(asset, cache) {
        let audioCache;
        if (cache == 'bgm')
            audioCache = this.bgmCache;
        else
            audioCache = this.sfxCache;
        audioCache[asset].pause();
    }
    pauseBackgroundMusic() {
        for (var key in this.bgmCache) {
            let asset = this.bgmCache[key];
            if (asset instanceof Audio) {
                asset.pause();
                asset.currentTime = 0;
            }
        }
    };

    autoRepeat(path, cache) {
        let audioCache;
        if (cache == 'bgm')
            audioCache = this.bgmCache;
        else
            audioCache = this.sfxCache;
        let aud = audioCache[path];
        aud.addEventListener("ended", function () {
            aud.play();
        });
    };
    startAtAutoRepeatTime(path, first, time, cache) {
        let audioCache;
        if (cache == 'bgm')
            audioCache = this.bgmCache;
        else
            audioCache = this.sfxCache;
        let aud = audioCache[path];
        ASSET_MANAGER.playAssetTime(path, first, cache);
        aud.addEventListener("ended", function () {
            ASSET_MANAGER.playAssetTime(path, time, cache);
        });
    };
};

