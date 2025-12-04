import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandStory } from '@/components/home/BrandStory';
import { ProjectsShowcase } from '@/components/home/ProjectsShowcase';
import { Newsletter } from '@/components/home/Newsletter';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PROBAGNO | Έπιπλα Μπάνιου Υψηλής Αισθητικής από το 1974</title>
        <meta name="description" content="Με 50+ χρόνια εμπειρίας στον σχεδιασμό και κατασκευή επίπλων μπάνιου, η PROBAGNO αποτελεί συνώνυμο ποιότητας και αισθητικής. Ανακαλύψτε τη συλλογή μας." />
      </Helmet>
      <Layout>
        <HeroSection />
        <FeaturedProducts />
        <BrandStory />
        <ProjectsShowcase />
        <Newsletter />
      </Layout>
    </>
  );
};

export default Index;
