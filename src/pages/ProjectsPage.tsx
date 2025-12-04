import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { ArrowRight, MapPin, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

// Import project images
import monastiraki1 from '@/assets/projects/monastiraki-1.jpg';
import monastiraki2 from '@/assets/projects/monastiraki-2.jpg';
import hydra1 from '@/assets/projects/hydra-1.jpg';
import hydra2 from '@/assets/projects/hydra-2.jpg';
import glyfada1 from '@/assets/projects/glyfada-1.jpg';
import lagonisi1 from '@/assets/projects/lagonisi-1.jpg';
import mykonos1 from '@/assets/projects/mykonos-1.jpg';
import mykonos2 from '@/assets/projects/mykonos-2.jpg';

const projects = [
  {
    id: 1,
    title: 'Μοναστηράκι',
    location: 'Αθήνα',
    description: 'Πολυτελής ανακαίνιση μπάνιου σε ιστορικό κτίριο στο κέντρο της Αθήνας. Συνδυασμός μοντέρνου design με κλασικά στοιχεία.',
    category: 'Κατοικία',
    images: [monastiraki1, monastiraki2],
  },
  {
    id: 2,
    title: 'Ύδρα',
    location: 'Ύδρα',
    description: 'Νησιωτική κατοικία με μίνιμαλ αισθητική. Έπιπλα μπάνιου σε λευκό γυαλιστερό που αντανακλούν το φως του Αιγαίου.',
    category: 'Villa',
    images: [hydra1, hydra2],
  },
  {
    id: 3,
    title: 'Γλυφάδα',
    location: 'Γλυφάδα, Αθήνα',
    description: 'Μοντέρνο διαμέρισμα στα νότια προάστια. Premium έπιπλα μπάνιου με LED καθρέπτες και custom λύσεις αποθήκευσης.',
    category: 'Κατοικία',
    images: [glyfada1],
  },
  {
    id: 4,
    title: 'Λαγονήσι',
    location: 'Λαγονήσι, Αττική',
    description: 'Παραθαλάσσια κατοικία με σύγχρονο σχεδιασμό. Ανθεκτικά υλικά ιδανικά για το θαλασσινό περιβάλλον.',
    category: 'Villa',
    images: [lagonisi1],
  },
  {
    id: 5,
    title: 'Μύκονος',
    location: 'Μύκονος',
    description: 'Luxury villa στη Μύκονο με πολλαπλά μπάνια. Λευκά έπιπλα σε αρμονία με την κυκλαδίτικη αρχιτεκτονική.',
    category: 'Villa',
    images: [mykonos1, mykonos2],
  },
];

const categories = ['Όλα', 'Κατοικία', 'Villa', 'Ξενοδοχείο'];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Όλα');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const filteredProjects = selectedCategory === 'Όλα' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <Layout>
      <Helmet>
        <title>Έργα | PROBAGNO - Έπιπλα Μπάνιου</title>
        <meta name="description" content="Δείτε τα έργα μας σε Μοναστηράκι, Ύδρα, Γλυφάδα, Λαγονήσι και Μύκονο. Πολυτελή έπιπλα μπάνιου σε κατοικίες και villas." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={monastiraki1} 
            alt="PROBAGNO Projects" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Έργα
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            50 χρόνια εμπειρίας σε κατοικίες, ξενοδοχεία και villas σε όλη την Ελλάδα
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div 
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer mb-4"
                      onClick={() => {
                        setSelectedProject(project);
                        setSelectedImageIndex(0);
                      }}
                    >
                      <img 
                        src={project.images[0]} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <Maximize2 className="w-4 h-4" />
                          Περισσότερα
                        </Button>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                          {project.category}
                        </span>
                      </div>
                      {project.images.length > 1 && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-1 bg-background/80 text-foreground text-xs rounded-full">
                            {project.images.length} φωτογραφίες
                          </span>
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="space-y-4">
                      {/* Main Image */}
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={project.images[selectedImageIndex]} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Thumbnails */}
                      {project.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {project.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedImageIndex(idx)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                selectedImageIndex === idx ? 'border-primary' : 'border-transparent'
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Info */}
                      <div className="space-y-3">
                        <h3 className="font-display text-2xl font-bold">{project.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </div>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Έχετε ένα project;
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Επικοινωνήστε μαζί μας για εξατομικευμένη προσφορά για το δικό σας έργο.
            </p>
            <Link to="/contact">
              <Button variant="secondary" size="lg" className="gap-2">
                Επικοινωνία <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
