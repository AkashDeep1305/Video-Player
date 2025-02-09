const video_player = document.querySelector('#videoplayer'),
    mainVideo = video_player.querySelector('#main-video'),
    progressAreaTime = video_player.querySelector('.progresstime'),
    controls = video_player.querySelector('.controls'),
    progress_area = video_player.querySelector('.progress-area'),
    progress_bar = video_player.querySelector('.progress-bar'),
    rewind = video_player.querySelector('.rewind'),
    play_pause = video_player.querySelector('.play'),
    forward = video_player.querySelector('.forward'),
    vol = video_player.querySelector('.vol'),
    title = video_player.querySelector('.title'),
    curent = video_player.querySelector('.curent'),
    vol_ran = video_player.querySelector('.vol_ran'),
    duration = video_player.querySelector('.duration'),
    setting = video_player.querySelector('.setting'),
    settinghome = video_player.querySelectorAll('#setting [data-label="settinghome"] > ul > li'),
    pip = video_player.querySelector('.pip'),
    full = video_player.querySelector('.full'),
    Setting = video_player.querySelector('#setting'),
    spinner = video_player.querySelector('.spinner'),
    playback = video_player.querySelectorAll('.playback li'),
    qualityElements = video_player.querySelectorAll('.quality li');

let thumbnail = video_player.querySelector(".thumbnail");
//Play Video
function playVideo() {
    play_pause.innerHTML = "pause_circle";
    play_pause.title = "play";
    video_player.classList.add('pause')
    mainVideo.play();
}
//Pause Video
function pauseVideo() {
    play_pause.innerHTML = "play_circle";
    play_pause.title = "pause";
    video_player.classList.remove('pause')
    mainVideo.pause();
}
//Pause_Play Video
play_pause.addEventListener('click', () => {
    if (mainVideo.paused) {
        playVideo();
    } else {
        pauseVideo();
    }
});

//Update play/pause button when video ends
mainVideo.addEventListener('ended', pauseVideo);

//rewind
rewind.addEventListener("click", function () {
    rewind.title = "Rewind";
    mainVideo.currentTime -= 10;
})
//forward
forward.addEventListener("click", function () {
    forward.title = "Forward"
    mainVideo.currentTime += 10;
})

/////////////////////////// Volume ////////////////////////////////////
// Set the default volume to 70
mainVideo.volume = 0.7;
vol_ran.value = 70;
var initialrange = (vol_ran.value - vol_ran.min) / (vol_ran.max - vol_ran.min) * 100;
vol_ran.style.setProperty('--value', initialrange + '%');
vol_ran.addEventListener("input", () => {
    mainVideo.volume = vol_ran.value / 100;
    if (mainVideo.volume == 0) {
        vol.innerHTML = "volume_off";
    } else if (mainVideo.volume <= 0.5) {
        vol.innerHTML = "volume_down";
    } else {
        vol.innerHTML = "volume_up";
    }
});
vol.addEventListener("click", () => {
    var val = vol.classList.contains("mute") ? "volume_off" : "volume_up";
    vol.innerHTML = val;
    vol.classList.toggle("mute");
    mainVideo.volume = vol.classList.contains("mute") ? 0.7 : 0;
    vol_ran.value = mainVideo.volume * 100;
    var range = (vol_ran.value - vol_ran.min) / (vol_ran.max - vol_ran.min) * 100;
    vol_ran.style.setProperty('--value', range + '%');
});

// Add an input event listener
vol_ran.addEventListener('input', function () {
    // Calculate the percentage of the current value
    var percentage = (this.value - this.min) / (this.max - this.min) * 100;

    // Update the --value CSS variable
    this.style.setProperty('--value', percentage + '%');
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load video duration////////////////////////////////
mainVideo.addEventListener("loadeddata", function (e) {
    let videoDuration = e.target.duration;
    let minutes = Math.floor(videoDuration / 60);
    let seconds = Math.floor(videoDuration % 60);

    seconds < 10 ? seconds = "0" + seconds : seconds;
    duration.innerHTML = `${minutes}:${seconds}`;
})
// current video duration
mainVideo.addEventListener('timeupdate', function (e) {
    let currentVidTime = e.target.currentTime;
    let minutes = Math.floor(currentVidTime / 60);
    let seconds = Math.floor(currentVidTime % 60);

    seconds < 10 ? seconds = `0${seconds}` : seconds;
    curent.innerHTML = `${minutes}:${seconds}`;

    // Progress bar
    let videoDuration = e.target.duration
    let progressWidth = (currentVidTime / videoDuration) * 100;
    progress_bar.style.width = `${progressWidth}%`;
})
// Progress Area
progress_area.addEventListener("pointerdown", function (e) {
    TimelinePosition(e);
    progress_area.addEventListener('pointermove', TimelinePosition);
    progress_area.addEventListener('pointerup', () => {
        progress_area.removeEventListener('pointermove', TimelinePosition)
    })
});

function TimelinePosition(e) {
    let progressWidthval = progress_area.offsetWidth; // Get the width of the progress area
    let clickedPosition = e.offsetX; // Get the position where the progress area was clicked
    let videoDuration = mainVideo.duration;

    // Calculate the new current time for the video based on the click position
    let newCurrentTime = (clickedPosition / progressWidthval) * videoDuration;

    // Update the video's current time
    mainVideo.currentTime = newCurrentTime;

    let progressWidth = (mainVideo.currentTime / videoDuration) * 100;
    progress_bar.style.width = `${progressWidth}%`;

    let currentVidTime = mainVideo.currentTime;
    let minutes = Math.floor(currentVidTime / 60);
    let seconds = Math.floor(currentVidTime % 60);

    seconds < 10 ? seconds = `0${seconds}` : seconds;
    curent.innerHTML = `${minutes}:${seconds}`;
}

///////////////////////////// SPINNER //////////////////////////////////////////
mainVideo.addEventListener('waiting', () => {
    spinner.style.display = 'block';
})
mainVideo.addEventListener('canplay', function () {
    spinner.style.display = 'none';
});
mainVideo.addEventListener('seeking', function () {
    spinner.style.display = 'block';
});
mainVideo.addEventListener('seeked', function () {
    if (!mainVideo.paused) {
        spinner.style.display = 'none';
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////

// Fullscreen/////////////////////////////////////////////////////////////////////////////
full.addEventListener("click", function () {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        full.innerHTML = "fullscreen";
    } else {
        video_player.requestFullscreen().then(() => {
            full.innerHTML = "fullscreen_exit";
        }).catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    }
});
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////// (All pip Settings) /////////////////////////////////////////////
// Picture in Picture////////
pip.addEventListener("click", function () {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
            .catch(error => {
                // Video failed to leave Picture-in-Picture mode.
                console.error(error);
            });
    } else {
        mainVideo.requestPictureInPicture()
            .catch(error => {
                // Video failed to enter Picture-in-Picture mode.
                console.error(error);
            });
    }
});
///////////////////////////////////////////////////////////////////////////////////

// Listen for the enterpictureinpicture event, which is fired when a video enters PiP mode////////////
mainVideo.addEventListener('enterpictureinpicture', function () {
    if (mainVideo.paused) {
        pauseVideo();
    } else {
        playVideo();
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Listen for the leavepictureinpicture event, which is fired when a video leaves PiP mode ///////////////////////////////////////
mainVideo.addEventListener('leavepictureinpicture', function () {
    if (mainVideo.paused) {
        pauseVideo();
    } else {
        playVideo();
    }
});
pip.addEventListener('leavepip', function () {
    if (mainVideo.paused) {
        playVideo()
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////

/// update progress time and Thumbnail//////////////////////////////////////////////////////////////////////////
progress_area.addEventListener('mousemove', function (e) {
    let progressWidth = progress_area.clientWidth + 1.8;
    let offsetX = e.offsetX;
    // progressAreaTime.style.setProperty('--x', `${offsetX}px`);
    progressAreaTime.style.display = "block";
    let videoDuration = mainVideo.duration;
    let newTime = Math.floor((offsetX / progressWidth) * videoDuration);
    let minutes = Math.floor(newTime / 60);
    let seconds = Math.floor(newTime % 60);

    if (offsetX >= progressWidth - 80) {
        offsetX = progressWidth - 80;
    } else if (offsetX <= 75) {
        offsetX = 75;
    } else {
        offsetX = e.offsetX;
    }

    seconds < 10 ? seconds = `0${seconds}` : seconds;
    progressAreaTime.innerHTML = `${minutes}:${seconds}`;
    thumbnail.style.setProperty('--x', `${offsetX}px`);
    thumbnail.style.display = "block";
    progressAreaTime.style.setProperty('--x', `${offsetX}px`);

    for (var item of thumbnails) {
        var data = item.sec.find(x1 => x1.index === Math.floor(newTime));

        // Check if thumbnail data is found
        if (data) {
            if (item.data != undefined) {
                // Construct the style string
                var styleString = `
            background-image: url(${item.data});
            background-position-x: ${data.backgroundPositionX}px;
            background-position-y: ${data.backgroundPositionY}px;
            --x: ${offsetX}px;
            display: block;
        `;
                thumbnail.setAttribute("style", styleString);

                // Exit the loop since a matching thumbnail is found
                return;
            }
        }
    }
});
progress_area.addEventListener("mouseout", () => {
    progressAreaTime.style.display = "none";
    thumbnail.style.display = "none";
})
///////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////// All Setting codes/////////////////////////
// Changes in Setting for datalabels
var dataLabels = document.querySelectorAll('[data-speed], [data-quality], [data-subtitle]');

// Add click event listener to each data label
dataLabels.forEach(function (dataLabel) {
    dataLabel.onclick = function (event) {
        // Remove the "active" class from the setting and Setting elements
        setting.classList.remove("active");
        Setting.classList.remove("active");

        // Reset the settings menu to its initial state
        settingdiv.forEach(function (div) {
            if (div.getAttribute('data-label') == 'settinghome') {
                // This is the initial section, show it
                div.removeAttribute('hidden');
            } else {
                // This is not the initial section, hide it
                div.setAttribute('hidden', '');
            }
        });
        event.stopPropagation(); // Stop the event from propagating to the document
    }
});

/// opening setting
const cont = document.querySelector(".controls");
setting.onclick = function (event) {
    setting.classList.toggle("active");
    Setting.classList.toggle("active");
    // Show controls when the setting is active
    cont.style.display = setting.classList.contains("active") ? 'block' : 'none';
    event.stopPropagation(); // Stop the event from propagating to the document
}
document.addEventListener('click', function (event) {
    var isClickInsideSetting = setting.contains(event.target);
    var isClickInsideSettingHome = Setting.contains(event.target);

    if (!isClickInsideSetting && !isClickInsideSettingHome) {
        // The click was outside the settings elements, hide them
        setting.classList.remove("active");
        Setting.classList.remove("active");

        // Reset the settings menu to its initial state
        settingdiv.forEach(function (div) {
            if (div.getAttribute('data-label') == 'settinghome') {
                // This is the initial section, show it
                div.removeAttribute('hidden');
            } else {
                // This is not the initial section, hide it
                div.setAttribute('hidden', '');
            }
        });
    }
});

// Assuming 'video' is your video element
playback.forEach(function (speed) {
    speed.addEventListener('click', function () {
        // Remove 'active' class from all speeds
        playback.forEach(function (s) {
            s.classList.remove('active');
        });

        // Add 'active' class to clicked speed
        this.classList.add('active');

        // Change video playback speed
        mainVideo.playbackRate = this.getAttribute('data-speed');
    });
});
/// other setting changes
const settingdiv = video_player.querySelectorAll('#setting > div');
const settingback = video_player.querySelectorAll('#setting > div .back');
settingback.forEach((e) => {
    e.addEventListener('click', (ele) => {
        let setting_labe = ele.target.getAttribute('data-label');
        for (let i = 0; i < settingdiv.length; i++) {
            if (settingdiv[i].getAttribute('data-label') == setting_labe) {
                settingdiv[i].removeAttribute('hidden');
            } else {
                settingdiv[i].setAttribute('hidden', '');
            }
        }
    })
})
settinghome.forEach((e) => {
    e.addEventListener('click', (ele) => {
        let setting_labe = ele.target.getAttribute('data-label');
        for (let i = 0; i < settingdiv.length; i++) {
            if (settingdiv[i].getAttribute('data-label') == setting_labe) {
                settingdiv[i].removeAttribute('hidden');
            } else {
                settingdiv[i].setAttribute('hidden', '');
            }
        }
    })
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// Hide the controls/////( All Video controls )////////////////////////////////////////////////
var timeout;
var backe = document.querySelector('.backe');
var caption_ = document.querySelector('.caption_text');

// Function to show controls and reset timeout
function showControls() {
    clearTimeout(timeout);
    controls.style.display = 'block';
    title.style.display = 'block';
    backe.style.display = 'block';
}
video_player.addEventListener('mousemove', () => {
    showControls();
    timeout = setTimeout(function () {
        // Only hide controls if settings are not active
        if (!setting.classList.contains("active") && !mainVideo.paused && !controls.classList.contains('hover')) {
            controls.style.display = 'none';
            title.style.display = 'none';
            backe.style.display = 'none';
            caption_.style.bottom = '10px';
        }

    }, 4000);
    caption_.style.bottom = '65px';
});

video_player.addEventListener('mouseleave', () => {
    timeout = setTimeout(function () {
        // Only hide controls if settings are not active
        if (!setting.classList.contains("active") && !mainVideo.paused && !controls.classList.contains("hover")) {
            controls.style.display = 'none';
            title.style.display = 'none';
            backe.style.display = "none";
            caption_.style.bottom = '10px';
        }

    }, 500);
});
////////////////////////////////////////////////////////////////////////////////////////////////

/// ///////////  Automatic  video and quality extractor ////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    // Fetch the video data from the JSON file
    fetch("videoData.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(videoData => {
            if (videoData.length > 0) {
                const selectedVideo = videoData[0];

                // Set the video title
                const videoTitleElement = document.querySelector(".title h4");
                videoTitleElement.textContent = selectedVideo.title;

                // Set the video sources and quality options
                const videoElement = document.getElementById("main-video");
                const playButton = document.querySelector('.play');
                const qualityOptions = selectedVideo.qualityOptions;
                const subtitleOptions = selectedVideo.subtitle;

                // Set the default quality as 'auto'
                let defaultQuality = 'Auto';
                if (selectedVideo.videoSources[defaultQuality]) {
                    videoElement.setAttribute("src", selectedVideo.videoSources[defaultQuality]);
                } else {
                    console.error("Video source not found for the 'Auto' quality.");
                    return;
                }

                // Load the new video source and start playing
                videoElement.addEventListener('loadedmetadata', function () {
                    playButton.innerHTML = 'play_circle';
                    videoElement.pause();
                });

                // Change the play-pause button to show the play icon when the video is paused
                videoElement.addEventListener('pause', function () {
                    playButton.innerHTML = 'play_circle';
                });

                // Create quality options list
                const qualityOptionsElement = document.querySelector('.quality-options ul');
                qualityOptionsElement.innerHTML = ''; // Clear existing options
                qualityOptions.forEach(quality => {
                    const li = document.createElement('li');
                    li.textContent = quality;
                    li.setAttribute('data-quality', quality);
                    qualityOptionsElement.appendChild(li);
                });

                // Set the default quality as active
                let defaultQualityOption = document.querySelector('.quality-options li[data-quality="' + defaultQuality + '"]');
                defaultQualityOption.classList.add('active');

                // Add event listeners
                document.querySelectorAll('.quality-options li').forEach(function (li) {
                    li.addEventListener('click', function () {
                        // Save the current playback time
                        let currentTime = videoElement.currentTime;
                        videoElement.pause();

                        // Hide the settings
                        const settingElement = document.getElementById('setting');
                        if (settingElement) {
                            settingElement.classList.remove('active');
                        } else {
                            console.error("Setting element not found in the DOM.");
                        }

                        // Reset the settings menu to its initial state
                        const settingHome = document.querySelector('div[data-label="settinghome"]');
                        const settingOptions = document.querySelectorAll('#setting > div');
                        if (settingHome && settingOptions.length > 0) {
                            // Hide all setting options
                            settingOptions.forEach(function (option) {
                                option.hidden = true;
                            });

                            // Show the home setting
                            settingHome.hidden = false;
                        } else {
                            console.error("Setting options or home setting not found in the DOM.");
                        }

                        // Change the video source based on the selected quality
                        let quality = this.getAttribute('data-quality');
                        if (selectedVideo.videoSources[quality]) {
                            videoElement.src = selectedVideo.videoSources[quality];

                            videoElement.load();
                            // Load the new video source and restore the playback time
                            videoElement.addEventListener('canplaythrough', function () {
                                videoElement.currentTime = currentTime;
                                videoElement.play();
                            }, { once: true });

                            // Remove the active class from the previously active quality option
                            let activeQualityOption = document.querySelector('.quality-options li.active');
                            if (activeQualityOption) {
                                activeQualityOption.classList.remove('active');
                            }

                            // Add the active class to the selected quality option
                            this.classList.add('active');
                        } else {
                            console.error("Video source not found for the selected quality.");
                        }
                    });
                });

                // Create subtitle options list
                const subtitleOptionsElement = document.querySelector('.subtitle ul');
                subtitleOptionsElement.innerHTML = ''; // Clear existing options
                subtitleOptions.forEach(subtitle => {
                    const li = document.createElement('li');
                    li.textContent = subtitle;
                    li.setAttribute('data-subtitle', subtitle);
                    subtitleOptionsElement.appendChild(li);
                });

                // Set the default subtitle as 'OFF'
                let defaultSubtitleOption = document.querySelector('.subtitle li[data-subtitle="OFF"]');
                defaultSubtitleOption.classList.add('active');

                // Set vtt data
                function parseVtt(data) {
                    const regex = /(\d+:\d+:\d+\.\d+) --> (\d+:\d+:\d+\.\d+)(.*?)(?=(\d+:\d+:\d+\.\d+ --> \d+:\d+:\d+\.\d+|$))/gs;
                    let result = [];
                    let match;

                    while ((match = regex.exec(data)) !== null) {
                        result.push({
                            start: convertTimeToSeconds(match[1]),
                            end: convertTimeToSeconds(match[2]),
                            text: match[3].trim()
                        });
                    }

                    return result;
                }

                function convertTimeToSeconds(time) {
                    let parts = time.split(':');
                    return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
                }

                // Add event listeners
                document.querySelectorAll('.subtitle li').forEach(function (li) {
                    li.addEventListener('click', function () {
                        videoElement.ontimeupdate = null;
                        // Change the subtitle track based on the selected subtitle
                        let subtitle = this.getAttribute('data-subtitle');
                        let trackElement = document.querySelector('#main-video track');

                        // Remove the active class from the previously active subtitle option
                        let activeSubtitleOption = document.querySelector('.subtitle li.active');
                        if (activeSubtitleOption) {
                            activeSubtitleOption.classList.remove('active');
                        }

                        // Add the active class to the selected subtitle option
                        this.classList.add('active');

                        // Show the caption text when a subtitle is selected
                        let captionTextElement = document.querySelector('.caption_text');

                        if (subtitle !== 'OFF') {
                            if (selectedVideo.Tracks[subtitle]) {
                                trackElement.src = selectedVideo.Tracks[subtitle];
                                trackElement.kind = 'subtitles';
                                trackElement.srclang = subtitle;
                                trackElement.label = subtitle;

                                // Fetch the .vtt file
                                fetch(selectedVideo.Tracks[subtitle])
                                    .then(response => response.text())
                                    .then(data => {
                                        let captions = parseVtt(data);

                                        videoElement.ontimeupdate = function () {
                                            let currentTime = videoElement.currentTime;
                                            let caption = captions.find(caption => currentTime >= caption.start && currentTime <= caption.end);

                                            captionTextElement.textContent = caption ? caption.text : '';
                                            captionTextElement.classList.toggle('active', Boolean(caption));
                                            if (caption) {
                                                let mark = `<span><mark>${caption.text}</mark></span>`;
                                                captionTextElement.innerHTML = mark;
                                            } else {
                                                captionTextElement.innerHTML = '';
                                            }

                                        };

                                    })
                                    .catch((error) => {
                                        console.error("could not load subtitle", error);
                                    });
                            } else {
                                console.error("Subtitle track not found for the selected subtitle.");
                            }
                        } else {
                            captionTextElement.textContent = '';
                            captionTextElement.classList.remove('active');
                            videoElement.ontimeupdate = null;
                            trackElement.src = ""; // Clear track source for 'OFF' option
                        }

                    });
                });

                generatePreviewThumbnails(selectedVideo);
            } else {
                console.error("No video data found in the JSON file.");
            }
        })
        .catch(error => console.error("Error fetching or parsing video data:", error));
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////// video preview ////
var thumbnails = [];

var thumbnailWidth = 220;
var thumbnailHeight = 140;
var horizontalItemCount = 5;
var verticalItemCount = 5;

function generatePreviewThumbnails(selectedVideo) {
    let preview_video = document.createElement('video');
    preview_video.width = "500";
    preview_video.height = "300";
    preview_video.controls = true;
    const defaultQuality = 'Auto';
    preview_video.src = selectedVideo.videoSources[defaultQuality]
    // console.log(preview_video.src);

    preview_video.addEventListener('loadeddata', async function () {
        //
        preview_video.pause();

        //
        var count = 1;

        //
        var id = 1;

        //
        var x = 0, y = 0;

        //
        var array = [];

        //
        var duration = parseInt(this.duration);
        // console.log(duration);

        //
        for (var i = 0; i <= duration; i++) {
            array.push(i);
        }

        //
        var canvas;

        //
        var i, j;

        for (i = 0, j = array.length; i < j; i += horizontalItemCount) {
            //
            for (var startIndex of array.slice(i, i + horizontalItemCount)) {
                //
                var backgroundPositionX = x * thumbnailWidth;

                //
                var backgroundPositionY = y * thumbnailHeight;

                //
                var item = thumbnails.find(x => x.id === id);

                if (!item) {
                    //

                    //
                    canvas = document.createElement('canvas');

                    //
                    canvas.width = thumbnailWidth * horizontalItemCount;
                    canvas.height = thumbnailHeight * verticalItemCount;

                    //
                    thumbnails.push({
                        id: id,
                        canvas: canvas,
                        sec: [{
                            index: startIndex,
                            backgroundPositionX: -backgroundPositionX,
                            backgroundPositionY: -backgroundPositionY
                        }]
                    });
                } else {
                    //

                    //
                    canvas = item.canvas;

                    //
                    item.sec.push({
                        index: startIndex,
                        backgroundPositionX: -backgroundPositionX,
                        backgroundPositionY: -backgroundPositionY
                    });
                }

                //
                var context = canvas.getContext('2d');

                //
                preview_video.currentTime = startIndex;

                //
                await new Promise(function (resolve) {
                    var event = function () {
                        //
                        context.drawImage(preview_video, backgroundPositionX, backgroundPositionY,
                            thumbnailWidth, thumbnailHeight);

                        //
                        x++;

                        // removing duplicate events
                        preview_video.removeEventListener('canplay', event);

                        //
                        resolve();
                    };

                    //
                    preview_video.addEventListener('canplay', event);
                });


                // 1 thumbnail is generated completely
                count++;
            }

            // reset x coordinate
            x = 0;

            // increase y coordinate
            y++;

            // checking for overflow
            if (count > horizontalItemCount * verticalItemCount) {
                //
                count = 1;

                //
                x = 0;

                //
                y = 0;

                //
                id++;
            }

        }
        // console.log(thumbnails)
        // looping through thumbnail list to update thumbnail
        thumbnails.forEach(function (item) {
            // converting canvas to blob to get short url
            item.canvas.toBlob(blob => item.data = URL.createObjectURL(blob), 'image/jpeg');

            // deleting unused property
            delete item.canvas;
        });

        console.log('done...');
    });
}

/// Transparency seeker ////
document.addEventListener('DOMContentLoaded', function () {
    // Get the video player and seeker elements
    const videoPlayer = document.querySelector('#videoplayer');
    const seeker = document.querySelector('.seeker');

    seeker.value = 100;
    seeker.addEventListener('input', function () {
        const opacityValue = this.value / 100;

        videoPlayer.style.opacity = opacityValue;
        updateTooltip(opacityValue);
    });
    seeker.addEventListener('mouseover', function () {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerText = `Transparency: ${this.value}%`;

        // Append the tooltip to the body
        document.body.appendChild(tooltip);

        // Position the tooltip next to the seeker
        const rect = this.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 30}px`;
        tooltip.style.left = `${rect.left}px`;
    });

    seeker.addEventListener('mouseout', function () {
        // Remove the tooltip when the mouse leaves the seeker
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
    // Function to update the tooltip content
    function updateTooltip(opacityValue) {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.innerText = `Transparency: ${Math.round(opacityValue * 100)}%`;
        }
    }
});
