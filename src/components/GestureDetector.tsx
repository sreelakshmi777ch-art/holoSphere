import React, { useEffect, useRef, useState } from 'react';
import { GestureType } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Camera, CameraOff, Hand, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface GestureDetectorProps {
  onGestureDetected: (gesture: GestureType) => void;
  onClose: () => void;
}

// MediaPipe 21 Hand Landmark connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [9, 13], [13, 14], [14, 15], [15, 16],// Ring
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20] // Pinky
];

export const GestureDetector: React.FC<GestureDetectorProps> = ({
  onGestureDetected,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [activeGesture, setActiveGesture] = useState<GestureType>('NONE');
  const [trackingStatus, setTrackingStatus] = useState<string>('Initializing MediaPipe...');

  const prevXRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(Date.now());
  const lastGestureTimeRef = useRef<number>(0);

  // Initialize MediaPipe Hands & Webcam Loop
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animFrameId: number;
    let handsInstance: any = null;

    async function setupHandTracker() {
      try {
        // Request webcam
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => resolve(true);
            } else resolve(true);
          });
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              if (err.name !== 'AbortError') console.warn('Video play error:', err);
            });
          }
        }
        setCameraPermission('granted');

        // Dynamically load MediaPipe Hands if window.Hands is not available
        if (!(window as any).Hands) {
          setTrackingStatus('Loading MediaPipe JS models...');
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
            script.crossOrigin = 'anonymous';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load MediaPipe CDN'));
            document.head.appendChild(script);
          });
        }

        const HandsClass = (window as any).Hands;
        if (HandsClass) {
          handsInstance = new HandsClass({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
          });

          handsInstance.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });

          handsInstance.onResults((results: any) => {
            drawAndClassify(results);
          });

          setTrackingStatus('Hand Tracker Ready - Show Hand to Camera');

          // Frame Loop
          const processFrame = async () => {
            if (videoRef.current && videoRef.current.readyState >= 2 && handsInstance) {
              try {
                await handsInstance.send({ image: videoRef.current });
              } catch (e) {
                // Ignore transient frame errors
              }
            }
            animFrameId = requestAnimationFrame(processFrame);
          };
          processFrame();
        } else {
          setTrackingStatus('MediaPipe fallback - Use controls below');
        }
      } catch (err) {
        console.warn('Camera / MediaPipe setup error:', err);
        setCameraPermission('denied');
        setTrackingStatus('Camera disabled or denied');
      }
    }

    setupHandTracker();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (handsInstance) {
        try {
          handsInstance.close();
        } catch (e) {}
      }
    };
  }, []);

  // Draw 21 landmarks on canvas and classify gestures
  const drawAndClassify = (results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setTrackingStatus('No hand detected in view');
      prevXRef.current = null;
      return;
    }

    setTrackingStatus('Tracking 21 Landmark Points');
    const landmarks = results.multiHandLandmarks[0];

    // Draw Skeleton Lines
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    HAND_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      ctx.beginPath();
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    });

    // Draw Glowing Points
    landmarks.forEach((p: any, idx: number) => {
      ctx.beginPath();
      ctx.arc(p.x * canvas.width, p.y * canvas.height, idx === 8 || idx === 4 ? 5 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = idx === 8 || idx === 4 ? '#38bdf8' : '#10b981';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    // Classify Gesture
    classifyLandmarks(landmarks);
  };

  const classifyLandmarks = (landmarks: any[]) => {
    const now = Date.now();
    if (now - lastGestureTimeRef.current < 800) return; // Cooldown to avoid trigger spam

    // Finger extensions check
    const indexExtended = landmarks[8].y < landmarks[6].y;
    const middleExtended = landmarks[12].y < landmarks[10].y;
    const ringExtended = landmarks[16].y < landmarks[14].y;
    const pinkyExtended = landmarks[20].y < landmarks[18].y;

    // Pinch distance between thumb tip (4) and index tip (8)
    const pinchDist = Math.hypot(landmarks[8].x - landmarks[4].x, landmarks[8].y - landmarks[4].y);

    // Wrist X for swipe detection
    const wristX = landmarks[0].x;
    const dt = (now - prevTimeRef.current) / 1000;
    prevTimeRef.current = now;

    let detected: GestureType = 'NONE';

    if (prevXRef.current !== null && dt > 0) {
      const dx = wristX - prevXRef.current;
      if (dx > 0.22) {
        detected = 'SWIPE_LEFT'; // Mirrored video
      } else if (dx < -0.22) {
        detected = 'SWIPE_RIGHT';
      }
    }
    prevXRef.current = wristX;

    if (detected === 'NONE') {
      if (pinchDist < 0.06) {
        detected = 'ZOOM_IN';
      } else if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
        detected = 'PALM_OPEN';
      } else if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        detected = 'FIST_CLOSED';
      } else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && pinchDist > 0.22) {
        detected = 'ZOOM_OUT';
      }
    }

    if (detected !== 'NONE') {
      lastGestureTimeRef.current = now;
      triggerGesture(detected);
    }
  };

  const triggerGesture = (gesture: GestureType) => {
    soundEngine.playClickSound();
    setActiveGesture(gesture);
    onGestureDetected(gesture);

    setTimeout(() => {
      setActiveGesture('NONE');
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-xs font-mono select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50 mb-3">
        <div className="flex items-center gap-2 text-cyan-200 font-bold">
          <Hand className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>MEDIAPIPE GESTURE ENGINE</span>
        </div>
        <button
          onClick={onClose}
          className="text-cyan-500 hover:text-cyan-200 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Video / Preview Stage */}
      <div className="relative w-full h-44 bg-black/90 rounded-xl overflow-hidden border border-cyan-900/50 flex items-center justify-center mb-2">
        <video
          ref={videoRef}
          className="w-full h-full object-cover transform -scale-x-100 opacity-80"
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
        />

        {cameraPermission === 'pending' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-cyan-400 gap-2 p-2 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Requesting Camera Stream...</span>
          </div>
        )}

        {cameraPermission === 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-cyan-300 gap-2 p-3 text-center">
            <CameraOff className="w-6 h-6 text-pink-400" />
            <span className="font-semibold text-pink-300">Camera Permission Denied</span>
            <span className="text-[10px] text-slate-400">
              Use simulated gesture controls below
            </span>
          </div>
        )}

        {/* Active Gesture Overlay Badge */}
        {activeGesture !== 'NONE' && (
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-cyan-400 text-black font-extrabold text-[10px] shadow-[0_0_15px_#22d3ee] flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            {activeGesture}
          </div>
        )}
      </div>

      {/* Tracking Status Indicator */}
      <div className="mb-3 px-2.5 py-1 rounded-lg bg-black/60 border border-cyan-900/40 text-[10px] text-cyan-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <span className="truncate">{trackingStatus}</span>
      </div>

      {/* Gesture Controls Tester (Interactive Buttons) */}
      <div>
        <div className="text-[10px] text-cyan-400/70 mb-2 uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Test Gesture Actions
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => triggerGesture('PALM_OPEN')}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/50 text-cyan-300 transition-all cursor-pointer text-[11px]"
          >
            ✋ Palm Open (Spin)
          </button>
          <button
            onClick={() => triggerGesture('FIST_CLOSED')}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/50 text-cyan-300 transition-all cursor-pointer text-[11px]"
          >
            ✊ Fist (Pause)
          </button>
          <button
            onClick={() => triggerGesture('SWIPE_LEFT')}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/50 text-cyan-300 transition-all cursor-pointer text-[11px]"
          >
            👈 Swipe Left
          </button>
          <button
            onClick={() => triggerGesture('SWIPE_RIGHT')}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/50 text-cyan-300 transition-all cursor-pointer text-[11px]"
          >
            👉 Swipe Right
          </button>
          <button
            onClick={() => triggerGesture('ZOOM_IN')}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/50 text-cyan-300 transition-all cursor-pointer text-[11px]"
          >
            🔍 Zoom In
          </button>
          <button
            onClick={() => triggerGesture('ZOOM_OUT')}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/50 text-cyan-300 transition-all cursor-pointer text-[11px]"
          >
            🔎 Zoom Out
          </button>
        </div>
      </div>
    </div>
  );
};

