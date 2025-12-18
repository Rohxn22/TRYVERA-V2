import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay for realism
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  // Simple validation or error state could be added here
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787&auto=format&fit=crop" 
          alt="Fashion Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm px-8">
        <div className="flex flex-col items-center mb-10 animate-[fadeIn_1s_ease-out]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">AI Powered Fashion</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-2xl">
            Tryvera
          </h1>
          <p className="text-gray-300 text-sm font-light tracking-wide text-center">
            {isSignUp ? "Create your virtual wardrobe." : "Experience the future of virtual try-ons."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-[fadeIn_1.2s_ease-out]">
          
          {isSignUp && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/10 focus-within:border-white/40 transition-colors animate-[slideDown_0.3s_ease-out]">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder-gray-400 text-sm"
                required={isSignUp}
              />
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/10 focus-within:border-white/40 transition-colors">
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder-gray-400 text-sm"
              required
            />
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/10 focus-within:border-white/40 transition-colors">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder-gray-400 text-sm"
              required
            />
          </div>

          {!isSignUp && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-gray-400 hover:text-white transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <span className="animate-pulse">{isSignUp ? 'Creating Account...' : 'Signing in...'}</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </div>
          </button>
        </form>
        
        <div className="mt-8 text-center animate-[fadeIn_1.4s_ease-out]">
           <p className="text-xs text-gray-500">
             {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
             <button 
               type="button"
               onClick={toggleMode}
               className="text-white font-medium hover:underline focus:outline-none"
             >
               {isSignUp ? "Sign In" : "Sign Up"}
             </button>
           </p>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; height: 0; margin: 0; }
          to { opacity: 1; height: auto; margin-bottom: 0.5rem; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;