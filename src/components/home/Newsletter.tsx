import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Ευχαριστούμε για την εγγραφή σας!');
    setEmail('');
    setIsLoading(false);
  };

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-16 h-16 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center mb-6"
          >
            <Mail className="w-8 h-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-semibold mb-4"
          >
            Εγγραφείτε στο Newsletter
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-primary-foreground/70 mb-8"
          >
            Μάθετε πρώτοι για νέα προϊόντα, προσφορές και έμπνευση για το μπάνιο σας
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Το email σας"
              required
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:ring-primary-foreground/30"
            />
            <Button
              type="submit"
              disabled={isLoading}
              variant="secondary"
              className="gap-2 whitespace-nowrap"
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
            className="text-xs text-primary-foreground/50 mt-4"
          >
            Με την εγγραφή σας συμφωνείτε με την Πολιτική Απορρήτου μας
          </motion.p>
        </div>
      </div>
    </section>
  );
}
