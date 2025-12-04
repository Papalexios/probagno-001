import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import monastirakiImg from '@/assets/projects/monastiraki-1.jpg';
import hydraImg from '@/assets/projects/hydra-1.jpg';
import mykonosImg from '@/assets/projects/mykonos-1.jpg';
import lagonisiImg from '@/assets/projects/lagonisi-1.jpg';

const projects = [
  {
    id: 1,
    title: 'Λαγονήσι',
    image: lagonisiImg,
    category: 'Residential',
  },
  {
    id: 2,
    title: 'Ύδρα',
    image: hydraImg,
    category: 'Hotel',
  },
  {
    id: 3,
    title: 'Μύκονος',
    image: mykonosImg,
    category: 'Villa',
  },
  {
    id: 4,
    title: 'Μοναστηράκι',
    image: monastirakiImg,
    category: 'Apartment',
  },
];

export function ProjectsShowcase() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Σχεδιασμός & Κατασκευή
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4"
          >
            Επιλεγμένα Έργα
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base"
          >
            Δείτε μερικά από τα έργα που έχουμε ολοκληρώσει σε όλη την Ελλάδα
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-lg"
            >
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <span className="inline-block px-2.5 py-1 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground/90 text-[10px] sm:text-xs font-medium mb-2">
                  {project.category}
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-primary-foreground font-semibold">
                  {project.title}
                </h3>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12"
        >
          <Button variant="outline" size="lg" className="gap-2 group rounded-xl h-12 sm:h-14" asChild>
            <Link to="/projects">
              Δείτε όλα τα Έργα
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}