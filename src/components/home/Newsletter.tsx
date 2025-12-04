import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Ευχαριστούμε για την εγγραφή σας!');
    setEmail('');
    setIsLoading(false);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg"
          >
            <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4"
          >
            Εγγραφείτε στο Newsletter
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-primary-foreground/70 mb-6 sm:mb-8 text-sm sm:text-base px-4"
          >
            Μάθετε πρώτοι για νέα προϊόντα, προσφορές και έμπνευση για το μπάνιο σας
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-4 sm:px-0"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Το email σας"
              required
              className="h-12 sm:h-14 rounded-xl bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:ring-primary-foreground/30 text-base"
            />
            <Button
              type="submit"
              disabled={isLoading}
              variant="secondary"
              className="h-12 sm:h-14 gap-2 whitespace-nowrap rounded-xl px-6 font-semibold"
            >
              {isLoading ? 'Εγγραφή...' : 'Εγγραφή'}
              <Send className="w-4 h-4" />
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-[10px] sm:text-xs text-primary-foreground/50 mt-4 px-4"
          >
            Με την εγγραφή σας συμφωνείτε με την Πολιτική Απορρήτου μας
          </motion.p>
        </div>
      </div>
    </section>
  );
}