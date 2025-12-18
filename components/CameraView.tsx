import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface CameraViewProps {
  onStreamReady?: () => void;
  isActive: boolean;
  facingMode: 'user' | 'environment';
}

export interface CameraHandle {
  capture: () => string | null;
}

const CameraView = forwardRef<CameraHandle, CameraViewProps>(({ onStreamReady, isActive, facingMode }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (!videoRef.current) return null;
      
      // Ensure we have dimensions
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      
      if (width === 0 || height === 0) return null;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the capture ONLY if the video is mirrored (front camera)
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0);
        return canvas.toDataURL('image/jpeg', 1.0); // Maximum quality for AI analysis
      }
      return null;
    }
  }), [facingMode]);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Request 4K resolution (Ultra HD) to maximize detail
        // Browsers will fallback to the highest available resolution if 4K is not supported
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 3840 }, 
            height: { ideal: 2160 }
          },
          audio: false,
        });

        currentStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // onloadedmetadata is crucial to know when video dimensions are ready
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Play error:", e));
            onStreamReady?.();
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, onStreamReady, facingMode]);

  return (
    <div className="absolute inset-0 bg-black z-0">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}
        playsInline
        muted
        autoPlay
      />
    </div>
  );
});

export default CameraView;