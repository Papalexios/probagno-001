import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Download, FileText, ExternalLink, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CatalogPage() {
  const [scale, setScale] = useState(1);

  return (
    <Layout>
      <Helmet>
        <title>Κατάλογος 2026 | PROBAGNO - Έπιπλα Μπάνιου</title>
        <meta name="description" content="Κατεβάστε τον κατάλογο PROBAGNO 2026 με όλα τα έπιπλα μπάνιου, νιπτήρες, καθρέπτες και κολώνες. PDF κατάλογος με τιμές και διαστάσεις." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Κατάλογος 2026
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Ανακαλύψτε τη νέα συλλογή επίπλων μπάνιου PROBAGNO. 
              Περιηγηθείτε online ή κατεβάστε τον κατάλογο σε μορφή PDF.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/PROBAGNO_2026.pdf"
                download="PROBAGNO_CATALOG_2026.pdf"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Λήψη Καταλόγου (PDF)
              </a>
              <a
                href="/PROBAGNO_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border px-8 py-4 rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Άνοιγμα σε νέα καρτέλα
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catalog Info */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: FileText, label: 'Μέγεθος', value: '~15 MB' },
              { icon: FileText, label: 'Σελίδες', value: '66+' },
              { icon: FileText, label: 'Έκδοση', value: '2026' },
              { icon: FileText, label: 'Γλώσσα', value: 'Ελληνικά' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-muted/30 rounded-2xl"
              >
                <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-semibold text-lg">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Viewer */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-muted/30 rounded-2xl p-4">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <h2 className="font-display text-xl font-semibold">Προεπισκόπηση Καταλόγου</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setScale(Math.max(0.5, scale - 0.25))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setScale(Math.min(2, scale + 0.25))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* PDF Embed */}
            <div className="relative bg-background rounded-xl overflow-hidden" style={{ height: '80vh' }}>
              <iframe
                src="/PROBAGNO_2026.pdf#toolbar=1&navpanes=1&scrollbar=1"
                className="w-full h-full border-0"
                title="PROBAGNO Κατάλογος 2026"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Highlights */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Τι θα βρείτε στον κατάλογο
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Πλήρης κατάλογος με τιμές, διαστάσεις και τεχνικά χαρακτηριστικά
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Έπιπλα ELEGANT', description: 'Premium σειρά επίπλων μπάνιου με Swiss Krono υλικά', pages: 'Σελ. 10-62' },
              { title: 'Νιπτήρες', description: 'Square, Merkur, Chic, Hera, Vega σε πολλά μεγέθη', pages: 'Σελ. 64' },
              { title: 'Κολώνες & Ντουλάπια', description: 'Αποθηκευτικές λύσεις για κάθε χώρο', pages: 'Σελ. 40-62' },
              { title: 'Καθρέπτες LED', description: 'Στρογγυλοί και ορθογώνιοι με φωτισμό', pages: 'Σελ. 10-62' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background p-6 rounded-2xl"
              >
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <span className="text-xs text-primary font-medium">{item.pages}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Θέλετε περισσότερες πληροφορίες;
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Επικοινωνήστε μαζί μας για εξατομικευμένη προσφορά ή επισκεφθείτε το showroom μας.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors"
              >
                Επικοινωνία
              </a>
              <a
                href="tel:2106622215"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/20 px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
              >
                210 6622215
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
