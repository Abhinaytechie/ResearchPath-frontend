import { motion } from 'framer-motion';
import { MousePointer2, Sparkles, BookOpen, Quote, Cpu, Github, Globe, ArrowRight, Layout, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const floatingElements = [
  { icon: <BookOpen className="w-6 h-6" />, color: 'bg-primary/20', pos: 'top-20 left-10', delay: 0 },
  { icon: <Quote className="w-5 h-5" />, color: 'bg-accent/20', pos: 'top-40 right-20', delay: 1 },
  { icon: <Cpu className="w-7 h-7" />, color: 'bg-emerald-500/20', pos: 'bottom-20 left-1/4', delay: 2 },
  { icon: <Sparkles className="w-6 h-6" />, color: 'bg-orange-500/20', pos: 'bottom-40 right-1/3', delay: 0.5 },
];

export default function Landing() {
  const { currentUser } = useAuth();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative min-h-screen bg-mesh overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"></div>
         
         {floatingElements.map((el, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
              transition={{ delay: el.delay, duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute ${el.pos} p-4 rounded-2xl ${el.color} backdrop-blur-md border border-white/20 shadow-xl hidden md:block`}
            >
              {el.icon}
            </motion.div>
         ))}
      </div>

      <div className="container mx-auto px-6 min-h-[90vh] flex flex-col justify-center items-center text-center relative z-10 pt-20">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl">
           <motion.div variants={item} className="inline-flex items-center gap-2 px-6 py-2 bg-white/50 backdrop-blur-xl border border-white/40 rounded-full shadow-lg mb-8">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">The Ultimate Research Assistant</span>
           </motion.div>
           
           <motion.h1 variants={item} className="text-6xl md:text-8xl font-heading font-black text-slate-900 mb-8 leading-[1.05] tracking-tight">
              Publishing, <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">Redefined.</span>
           </motion.h1>
           
           <motion.p variants={item} className="text-lg md:text-2xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              ResearchPath connects your manuscript to the world's most prestigious journals using real-time AI analytics and seamless LaTeX formatting.
           </motion.p>
           
           <motion.div variants={item} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              {currentUser ? (
                <>
                  <Link to="/upload" className="btn-primary !px-10 !py-5 !rounded-2xl text-lg group">
                    Initialize Draft <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform ml-2" />
                  </Link>
                  <Link to="/dashboard" className="px-10 py-5 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-md text-slate-800 font-black text-xs uppercase tracking-widest hover:bg-white hover:border-primary/30 transition-all hover:shadow-xl flex items-center gap-3">
                     <Layout className="w-4 h-4" /> Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-primary !px-10 !py-5 !rounded-2xl text-lg group">
                    Start Submitting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                  </Link>
                  <Link to="/login" className="px-10 py-5 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-md text-slate-800 font-black text-xs uppercase tracking-widest hover:bg-white hover:border-primary/30 transition-all hover:shadow-xl">
                     Account Entry
                  </Link>
                </>
              )}
           </motion.div>
           
           <motion.div variants={item} className="mt-20 flex gap-10 items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <div className="flex items-center gap-2"><Globe className="w-5 h-5" /><span className="font-bold text-sm tracking-tighter">Global Scholar Reach</span></div>
              <div className="flex items-center gap-2"><Cpu className="w-5 h-5" /><span className="font-bold text-sm tracking-tighter">AI Verification Core</span></div>
              <div className="flex items-center gap-2"><Github className="w-5 h-5" /><span className="font-bold text-sm tracking-tighter">Open Access Integrity</span></div>
           </motion.div>
        </motion.div>
      </div>
      
      {/* Floating Action Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-widest"
      >
        Scroll to discover
        <div className="w-px h-10 bg-slate-200 overflow-hidden relative">
           <motion.div animate={{ y: [0, 40] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-full h-1/2 bg-primary absolute top-0" />
        </div>
      </motion.div>
    </div>
  );
}
