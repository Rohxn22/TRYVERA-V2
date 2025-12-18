import React, { useState, useRef, useCallback, useEffect } from 'react';
import CameraView, { CameraHandle } from './components/CameraView';
import UIOverlay from './components/UIOverlay';
import LoginPage from './components/LoginPage';
import { PRODUCTS } from './constants';
import { Product } from './types';
import { generateTryOn } from './services/gemini';
import { Sparkles } from 'lucide-react';

const COMPLIMENTS = [
  "It's lit! 🔥",
  "Looking sharp! ✨",
  "Slay! 💅",
  "Fire fit! 🚒",
  "Absolute vibe. 💯",
  "Trendsetter alert! 🚨",
  "10/10 Look 🌟",
  "Main character energy 💫",
  "That drip though 💧"
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const cameraRef = useRef<CameraHandle>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compliment, setCompliment] = useState<string | null>(null);
  
  // Camera State
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Countdown State
  const [countdown, setCountdown] = useState<number | null>(null);

  // 1. Triggered when user clicks a product
  const handleProductSelect = useCallback((product: Product) => {
    if (selectedProduct?.id === product.id && generatedImage) return; 
    
    // Reset states
    setSelectedProduct(product);
    setGeneratedImage(null);
    setCompliment(null);
    setError(null);
    
    // Start countdown
    setCountdown(3);
  }, [selectedProduct, generatedImage]);

  const handleReset = useCallback(() => {
    setSelectedProduct(null);
    setGeneratedImage(null);
    setCompliment(null);
    setError(null);
    setCountdown(null);
  }, []);

  const handleToggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  // 2. Perform the actual capture and API call (Extracted function)
  const performCaptureAndGenerate = async (product: Product) => {
    // Capture current frame
    const imageBase64 = cameraRef.current?.capture();
    
    if (!imageBase64) {
      console.error("Camera capture failed - video might not be ready");
      setError("Could not capture camera. Please ensure camera is on.");
      setCountdown(null);
      return;
    }

    setIsProcessing(true);

    try {
      // Pass the category to the service to adjust the prompt (Upper vs Lower body)
      const resultImage = await generateTryOn(imageBase64, product.description, product.category);
      setGeneratedImage(resultImage);
      
      // Set a random compliment
      setCompliment(COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.message || "Failed to generate try-on. Please try again.";
      setError(errorMessage);
      
      setTimeout(() => {
        setSelectedProduct(null);
        setError(null);
      }, 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Countdown Timer Effect
  useEffect(() => {
    if (countdown === null || !selectedProduct) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Timer finished, capture!
      setCountdown(null);
      performCaptureAndGenerate(selectedProduct);
    }
  }, [countdown, selectedProduct]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden font-sans">
      
      {/* 1. Camera Feed (Background) */}
      <CameraView 
        ref={cameraRef} 
        isActive={!generatedImage} 
        facingMode={facingMode}
      />

      {/* 2. Generated Image Layer */}
      {generatedImage && (
        <div className="absolute inset-0 z-0 opacity-0 animate-[fadeIn_0.7s_ease-out_forwards]">
           <img 
             src={generatedImage} 
             alt="Virtual Try-On Result" 
             className="w-full h-full object-cover"
           />
           <div className="absolute top-20 left-4 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-2">
             <Sparkles className="w-3 h-3 text-yellow-400" />
             <span className="text-[10px] font-medium text-white/90">AI Generated</span>
           </div>

           {/* Compliment Overlay - Positioned Top Right */}
           {compliment && (
             <div className="absolute top-28 right-6 z-30 pointer-events-none">
               <h2 className="text-3xl md:text-4xl font-black italic text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] animate-[popInCorner_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)] stroke-black tracking-tighter rotate-12">
                 {compliment}
               </h2>
             </div>
           )}
        </div>
      )}

      {/* 3. Countdown Overlay */}
      {countdown !== null && countdown > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="text-[10rem] font-black text-white animate-pulse drop-shadow-2xl">
            {countdown}
          </div>
          <div className="absolute bottom-1/4 text-white text-xl font-medium tracking-widest uppercase bg-black/50 px-4 py-2 rounded-lg">
             Strike a Pose
          </div>
        </div>
      )}

      {/* 4. Processing State Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            {/* Spinner handles by UIOverlay, this blocks interaction */}
        </div>
      )}

      {/* 5. Error Toast */}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-sm bg-red-600/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl z-50 text-sm font-medium text-center animate-bounce">
          {error}
        </div>
      )}

      {/* 6. Main UI Layer */}
      <UIOverlay 
        products={PRODUCTS}
        selectedProduct={selectedProduct}
        isProcessing={isProcessing}
        onSelectProduct={handleProductSelect}
        onReset={handleReset}
        onToggleCamera={handleToggleCamera}
        hasResult={!!generatedImage}
      />
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popInCorner {
          0% { opacity: 0; transform: scale(0.5) rotate(12deg); }
          100% { opacity: 1; transform: scale(1) rotate(12deg); }
        }
      `}</style>
    </div>
  );
};

export default App;