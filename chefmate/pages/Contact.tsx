
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ViewState } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { submitContactForm } from '../lib/actions/contact';
import { Mail, Send, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactProps {
  onNavigate: (view: ViewState) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
        await submitContactForm(null, formData);
        setIsSuccess(true);
    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 relative">
      <Navbar currentView="contact" onNavigate={onNavigate} />
      
      <main className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          
          <div className="text-center mb-10">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-chef-green" />
             </div>
             <h1 className="text-3xl font-bold text-chef-black tracking-tight mb-2">Get in touch</h1>
             <p className="text-chef-dark">
               Questions about the AI? Feature request? Let us know.
             </p>
          </div>

          <div className="
            bg-white/70 backdrop-blur-xl 
            border border-white/50 
            shadow-sm rounded-2xl p-8
            relative overflow-hidden
          ">
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                        >
                            <CheckCircle2 className="w-10 h-10 text-chef-green" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-chef-black mb-2">Message Sent!</h2>
                        <p className="text-chef-dark mb-8 max-w-xs">
                            Thanks for reaching out. We'll get back to you shortly.
                        </p>
                        <Button variant="outline" onClick={() => onNavigate('landing')}>
                            Back to Home
                        </Button>
                    </motion.div>
                ) : (
                    <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit} 
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                name="name"
                                label="Name" 
                                placeholder="Gordon Ramsay" 
                                className="h-12 bg-white/50 border-zinc-200 focus:ring-emerald-500/20"
                                required
                            />
                            <Input 
                                name="email"
                                type="email"
                                label="Email" 
                                placeholder="you@example.com"
                                className="h-12 bg-white/50 border-zinc-200 focus:ring-emerald-500/20" 
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-chef-dark mb-2">Subject</label>
                            <div className="relative">
                                <select 
                                    name="subject"
                                    className="w-full h-12 px-4 bg-white/50 border border-zinc-200 rounded-xl text-chef-black appearance-none focus:outline-none focus:ring-2 focus:ring-chef-green/20 focus:border-chef-green transition-all"
                                >
                                    <option>Support Question</option>
                                    <option>Feature Request</option>
                                    <option>Partnership</option>
                                    <option>Other</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-chef-dark mb-2">Message</label>
                            <textarea 
                                name="message"
                                rows={4}
                                className="w-full p-4 bg-white/50 border border-zinc-200 rounded-xl text-chef-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chef-green/20 focus:border-chef-green transition-all resize-none"
                                placeholder="How can we help you today?"
                                required
                            ></textarea>
                        </div>

                        <Button 
                            type="submit" 
                            fullWidth 
                            size="lg" 
                            disabled={isSubmitting}
                            className="h-12 text-base shadow-lg shadow-emerald-500/20"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                            ) : (
                                <><Send className="w-4 h-4 mr-2" /> Send Message</>
                            )}
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 text-center">
             <p className="text-xs text-zinc-400">
                Or email us directly at <a href="mailto:support@chefmate.ai" className="text-chef-green hover:underline">support@chefmate.ai</a>
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};
