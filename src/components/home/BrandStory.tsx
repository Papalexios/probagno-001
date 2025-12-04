import { motion } from 'framer-motion';

export function BrandStory() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800&auto=format&fit=crop"
                alt="Probagno Workshop"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 -right-8 md:-right-16 bg-primary text-primary-foreground p-8 rounded-lg shadow-xl"
            >
              <div className="text-5xl font-display font-bold mb-2">50+</div>
              <div className="text-sm opacity-80">Χρόνια<br />Εμπειρίας</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">
              PROBAGNO
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8 leading-tight">
              Η Φιλοσοφία μας<br />
              <span className="text-muted-foreground">από το 1974</span>
            </h2>

            <div className="space-y-6 text-muted-foreground">
              <p>
                Τα προϊόντα μας διακρίνονται για το φινίρισμά τους, την μοναδική τους αρμονία, 
                την έμφαση στην λεπτομέρεια, την καινοτομία στις γραμμές και τις πρώτες ύλες 
                που χρησιμοποιούνται.
              </p>
              <p>
                Η εταιρεία μας λειτουργεί έχοντας πάντα ως γνώμονα το θεμελιωτικό τρίπτυχο 
                που συνοψίζει τη βασική φιλοσοφία του ιδρυτή της:
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-4">
                  <span className="font-display text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-medium text-sm">Σεβασμός<br />στον πελάτη</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-4">
                  <span className="font-display text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-medium text-sm">Ποιότητα<br />εργασίας</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-4">
                  <span className="font-display text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-medium text-sm">Τεχνολογική<br />εξέλιξη</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
