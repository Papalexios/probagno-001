import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const statsY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

  const values = [
    { num: '1', title: 'Σεβασμός', subtitle: 'στον πελάτη' },
    { num: '2', title: 'Ποιότητα', subtitle: 'εργασίας' },
    { num: '3', title: 'Τεχνολογική', subtitle: 'εξέλιξη' },
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <motion.div style={{ y: imageY }} className="w-full h-[120%] -mt-[10%]">
                <img
                  src="https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800&auto=format&fit=crop"
                  alt="Probagno Workshop"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
            {/* Floating Stats Card */}
            <motion.div
              style={{ y: statsY }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 lg:-right-12 bg-primary text-primary-foreground p-5 sm:p-6 lg:p-8 rounded-2xl shadow-2xl"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-1">50+</div>
              <div className="text-xs sm:text-sm opacity-80 leading-tight">Χρόνια<br />Εμπειρίας</div>
            </motion.div>

            {/* Decorative Element */}
            <div className="absolute -z-10 -top-4 -left-4 sm:-top-6 sm:-left-6 w-full h-full border-2 border-primary/20 rounded-2xl sm:rounded-3xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6"
            >
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                PROBAGNO
              </span>
            </motion.div>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 sm:mb-8 leading-tight">
              Η Φιλοσοφία μας
              <br />
              <span className="text-muted-foreground">από το 1974</span>
            </h2>

            <div className="space-y-4 sm:space-y-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
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

            {/* Values Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-10">
              {values.map((value, index) => (
                <motion.div
                  key={value.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                    <span className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-primary">{value.num}</span>
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm text-foreground">{value.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{value.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}