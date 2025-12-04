import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: 1,
    title: 'Λαγονήσι',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop',
    category: 'Residential',
  },
  {
    id: 2,
    title: 'Ύδρα',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop',
    category: 'Hotel',
  },
  {
    id: 3,
    title: 'Μύκονος',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    category: 'Villa',
  },
  {
    id: 4,
    title: 'Μοναστηράκι',
    image: 'https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?w=800&auto=format&fit=crop',
    category: 'Apartment',
  },
];

export function ProjectsShowcase() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm tracking-[0.3em] uppercase text-primary mb-2"
          >
            Σχεδιασμός & Κατασκευή
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-semibold mb-4"
          >
            Επιλεγμένα Έργα
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Δείτε μερικά από τα έργα που έχουμε ολοκληρώσει σε όλη την Ελλάδα
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-primary-foreground/70 text-sm mb-1">{project.category}</p>
                <h3 className="font-display text-2xl text-primary-foreground font-semibold">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" className="gap-2 group" asChild>
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
