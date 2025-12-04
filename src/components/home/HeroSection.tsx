import { motion } from 'framer-motion';
import { ArrowRight, Award, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBathroom from '@/assets/hero-bathroom.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src={heroBathroom}
          alt="Luxury Bathroom Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm tracking-[0.3em] uppercase text-primary mb-4"
          >
            Εδώ και 50 χρόνια
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6"
          >
            Αφοσίωση στην{' '}
            <span className="text-gradient">Λεπτομέρεια</span>,<br />
            Διαχρονική Ομορφιά
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8 max-w-lg"
          >
            Η εταιρεία μας, με συνεχή πορεία 50 ετών στο χώρο σχεδιασμού & κατασκευής 
            επίπλων μπάνιου, αποτελεί συνώνυμο υψηλής ποιότητας και αισθητικής.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="gap-2 group" asChild>
              <Link to="/products">
                Εξερευνήστε τα Προϊόντα
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">
                Η Ιστορία μας
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Feature Badges */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">50+ Χρόνια Εμπειρίας</h3>
                <p className="text-sm text-muted-foreground">Ελληνική παραγωγή</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Δωρεάν Παράδοση</h3>
                <p className="text-sm text-muted-foreground">Σε όλη την Ελλάδα</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">5 Χρόνια Εγγύηση</h3>
                <p className="text-sm text-muted-foreground">Σε όλα τα προϊόντα</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
