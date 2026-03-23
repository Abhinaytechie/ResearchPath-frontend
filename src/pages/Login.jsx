import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../firebase/auth';
import { Mail, Lock, Chrome, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login({ addToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      addToast('Successfully signed in with Google!');
      navigate('/dashboard');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }
    
    try {
      setLoading(true);
      if (isLogin) {
        await signInWithEmail(email, password);
        addToast('Welcome back!');
      } else {
        await signUpWithEmail(email, password);
        addToast('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8ff] flex relative overflow-hidden font-body">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="flex-1 flex items-center justify-center p-6 z-10 w-full lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg luxury-card p-10 md:p-14 bg-white/50 backdrop-blur-3xl border-white shadow-2xl relative overflow-hidden"
        >
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse"></div>

          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-100 mb-6 shadow-xl relative group"
            >
              <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookOpen className="text-primary w-8 h-8 relative z-10" />
            </motion.div>
            <h2 className="text-4xl font-heading font-black text-slate-900 mb-2 tracking-tight">{isLogin ? 'Neural Access' : 'Core Registration'}</h2>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Scientific Integrity Realized</p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  className="w-full bg-white border border-slate-100 text-slate-900 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium placeholder:text-slate-500"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Protocol (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  className="w-full bg-white border border-slate-100 text-slate-900 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium placeholder:text-slate-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group mt-4 bg-primary hover:bg-accent text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(108,71,255,0.3)] transition-all flex justify-center items-center gap-4 text-[11px] uppercase tracking-[0.3em] disabled:opacity-50"
            >
              {loading ? 'Initializing...' : (isLogin ? 'Authenticate Core' : 'Execute Uplink')}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
            </button>
          </form>

          <div className="mt-12 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Interconnect</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full mt-8 flex items-center justify-center gap-4 bg-white hover:bg-slate-100 text-[#0f0e17] font-black py-4 rounded-2xl transition-all shadow-xl text-[10px] uppercase tracking-[0.2em] disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" /> Google Gateway
          </button>
          
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              {isLogin ? "New Researcher?" : "Existing operative?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-3 text-primary hover:text-accent transition-colors underline underline-offset-4"
              >
                {isLogin ? 'Initialize Account' : 'Secure Entry'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-white/50 backdrop-blur-3xl relative overflow-hidden border-l border-white shadow-inner">
         <div className="max-w-xl text-left z-10 px-16">
            <motion.div initial={{opacity: 0, x: 40}} animate={{opacity: 1, x: 0}} transition={{delay: 0.3, duration: 0.8}}>
              <div className="w-20 h-2 bg-primary mb-12 rounded-full" />
              <h3 className="font-heading font-black text-6xl text-slate-900 mb-8 tracking-tighter leading-tight">Empowering <br /><span className="text-slate-400">Scholarship.</span></h3>
              <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium">Bypass predatory barriers. Deploy adaptive AI to refine your manuscript and discover verified Scopus venues with surgical precision.</p>
              
              <div className="space-y-6">
                 {[
                   "Global Scopus/SCI Metadata Index",
                   "Adaptive LLM Abstract Optimization",
                   "One-Click Publisher LaTeX Synthesis",
                   "Real-time Neural Integrity Scoring"
                 ].map((feat, i) => (
                   <div key={i} className="flex items-center gap-5 text-slate-400">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-slate-400">{feat}</span>
                   </div>
                 ))}
              </div>

              <div className="mt-20 pt-12 border-t border-slate-100 flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-slate-100 bg-[url('https://i.pravatar.cc/100?img=${i+10}')] bg-cover`} />
                  ))}
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined by 12,000+ <br />Verified Scholars</p>
              </div>
            </motion.div>
         </div>
         
         {/* Decorative Element */}
         <div className="absolute right-[-10%] top-[20%] w-[400px] h-[400px] border border-slate-100 rounded-full" />
         <div className="absolute right-[-15%] top-[15%] w-[600px] h-[600px] border border-slate-100 rounded-full" />
      </div>
    </div>
  );
}
