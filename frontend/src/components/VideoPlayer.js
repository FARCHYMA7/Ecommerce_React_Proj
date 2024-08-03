import React, { useRef, useState } from 'react';
import { Pause, Play } from 'react-feather';
import videoFile from '../assets/media/video.mp4'; 

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playVideo = () => {
        videoRef.current.play();
        setIsPlaying(true);
    };

    const pauseVideo = () => {
        videoRef.current.pause();
        setIsPlaying(false);
    };

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                height="600"
                width="auto"
                controls // Always show the video controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                <source src={videoFile} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {!isPlaying ? (
                <div className="play-overlay" onClick={playVideo}>
                    <Play size={48} color="white" />
                </div>
            ) : (
                <div className="stop-overlay" onClick={pauseVideo}>
                    <Pause size={48} color="white" />
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
