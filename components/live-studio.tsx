'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Settings, Play, Square, MonitorUp, Radio } from 'lucide-react';

export default function LiveStudio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Stream Destinations
  const [twitchUrl, setTwitchUrl] = useState('');
  const [kickUrl, setKickUrl] = useState('');

  // Recording References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      stopStream();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !videoEnabled));
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !audioEnabled));
      setAudioEnabled(!audioEnabled);
    }
  };

  const startStream = () => {
    if (!stream) return;
    if (!twitchUrl && !kickUrl) {
      alert("Please enter at least one full RTMP destination URL.");
      return;
    }

    // Connect to your VPS WebSocket Bridge
    const wsUrl = `ws://${window.location.hostname}:3001/?url1=${encodeURIComponent(twitchUrl)}&url2=${encodeURIComponent(kickUrl)}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsLive(true);
      
      // Force H.264 encoding so your 1-Core VPS doesn't have to transcode video
      const options = { mimeType: 'video/webm; codecs="h264"' };
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          ws.send(e.data); // Send video chunk to Node.js bridge
        }
      };

      mediaRecorder.start(1000); // Send 1-second chunks
      mediaRecorderRef.current = mediaRecorder;
    };

    ws.onclose = () => stopStream();
  };

  const stopStream = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsLive(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Video Preview Canvas */}
      <div className="lg:col-span-2 space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover transition-opacity duration-300 ${videoEnabled ? 'opacity-100' : 'opacity-0'}`}
          />
          {!videoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="h-16 w-16 text-neutral-700" />
            </div>
          )}
          
          {isLive && (
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-md bg-red-600/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-[#0a0a0a] p-4">
          <div className="flex gap-3">
            <button onClick={toggleAudio} className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${audioEnabled ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}>
              {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button onClick={toggleVideo} className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${videoEnabled ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}>
              {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800 text-white transition-colors hover:bg-neutral-700">
              <MonitorUp size={20} />
            </button>
          </div>

          <div className="flex gap-3">
            <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white">
              <Settings size={20} />
            </button>
            <button 
              onClick={isLive ? stopStream : startStream}
              className={`flex items-center gap-2 rounded-lg px-6 font-bold transition-all ${isLive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-volt text-black hover:brightness-110'}`}
            >
              {isLive ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {isLive ? 'END STREAM' : 'GO LIVE'}
            </button>
          </div>
        </div>
      </div>

      {/* Destinations Panel */}
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-[#0a0a0a] p-6">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-4">
          <Radio className="text-volt" size={20} />
          <h2 className="text-lg font-bold text-white">Destinations</h2>
        </div>
        
        <div className="flex flex-col gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Twitch Full RTMP URL</label>
            <input 
              type="password" 
              value={twitchUrl}
              onChange={(e) => setTwitchUrl(e.target.value)}
              placeholder="rtmp://live.twitch.tv/app/live_XXX..." 
              className="w-full rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-white focus:border-volt focus:outline-none focus:ring-1 focus:ring-volt" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kick Full RTMP URL</label>
            <input 
              type="password" 
              value={kickUrl}
              onChange={(e) => setKickUrl(e.target.value)}
              placeholder="rtmps://fa723fc...live-video.net:443/app/kick_XXX..." 
              className="w-full rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-white focus:border-volt focus:outline-none focus:ring-1 focus:ring-volt" 
            />
          </div>
        </div>
      </div>

    </div>
  );
}