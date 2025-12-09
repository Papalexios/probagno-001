import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'el' | 'en';

type Translations = {
  [key: string]: {
    el: string;
    en: string;
  };
};

const translations: Translations = {
  // Navigation
  'nav.home': { el: 'Αρχική', en: 'Home' },
  'nav.products': { el: 'Προϊόντα', en: 'Products' },
  'nav.projects': { el: 'Έργα', en: 'Projects' },
  'nav.about': { el: 'Σχετικά', en: 'About' },
  'nav.contact': { el: 'Επικοινωνία', en: 'Contact' },
  'nav.catalog': { el: 'Κατάλογος', en: 'Catalog' },
  
  // Hero Section
  'hero.title': { el: 'Έπιπλα Μπάνιου Υψηλής Αισθητικής', en: 'Premium Bathroom Furniture' },
  'hero.subtitle': { el: 'Από το 1974, δημιουργούμε χώρους που εμπνέουν', en: 'Since 1974, creating spaces that inspire' },
  'hero.cta.products': { el: 'Ανακαλύψτε τη Συλλογή', en: 'Discover Collection' },
  'hero.cta.contact': { el: 'Επικοινωνήστε μαζί μας', en: 'Contact Us' },
  
  // Featured Products
  'featured.title': { el: 'Επιλεγμένα Προϊόντα', en: 'Featured Products' },
  'featured.subtitle': { el: 'Μια επιλεγμένη συλλογή από τα καλύτερα έπιπλα μπάνιου μας', en: 'A curated selection of our finest bathroom furniture' },
  'featured.viewAll': { el: 'Δείτε Όλα τα Προϊόντα', en: 'View All Products' },
  
  // Products Page
  'products.title': { el: 'Η Συλλογή μας', en: 'Our Collection' },
  'products.subtitle': { el: 'Ανακαλύψτε την πλήρη γκάμα επίπλων μπάνιου μας', en: 'Discover our complete range of bathroom furniture' },
  'products.search': { el: 'Αναζήτηση προϊόντων...', en: 'Search products...' },
  'products.filters': { el: 'Φίλτρα', en: 'Filters' },
  'products.sort': { el: 'Ταξινόμηση', en: 'Sort' },
  'products.sort.newest': { el: 'Νεότερα', en: 'Newest' },
  'products.sort.priceAsc': { el: 'Τιμή: Χαμηλή → Υψηλή', en: 'Price: Low → High' },
  'products.sort.priceDesc': { el: 'Τιμή: Υψηλή → Χαμηλή', en: 'Price: High → Low' },
  'products.sort.nameAsc': { el: 'Όνομα: Α → Ω', en: 'Name: A → Z' },
  'products.noResults': { el: 'Δεν βρέθηκαν προϊόντα', en: 'No products found' },
  'products.clearFilters': { el: 'Καθαρισμός φίλτρων', en: 'Clear filters' },
  'products.applyFilters': { el: 'Εφαρμογή Φίλτρων', en: 'Apply Filters' },
  'products.activeFilters': { el: 'Ενεργά Φίλτρα', en: 'Active Filters' },
  
  // Product Detail
  'product.addToCart': { el: 'Προσθήκη στο Καλάθι', en: 'Add to Cart' },
  'product.inStock': { el: 'Διαθέσιμο', en: 'In Stock' },
  'product.outOfStock': { el: 'Μη Διαθέσιμο', en: 'Out of Stock' },
  'product.dimensions': { el: 'Διαστάσεις', en: 'Dimensions' },
  'product.materials': { el: 'Υλικά', en: 'Materials' },
  'product.colors': { el: 'Χρώματα', en: 'Colors' },
  'product.features': { el: 'Χαρακτηριστικά', en: 'Features' },
  'product.shipping': { el: 'Αποστολή', en: 'Shipping' },
  'product.related': { el: 'Σχετικά Προϊόντα', en: 'Related Products' },
  'product.description': { el: 'Περιγραφή', en: 'Description' },
  'product.selectDimension': { el: 'Επιλέξτε διάσταση', en: 'Select dimension' },
  'product.quantity': { el: 'Ποσότητα', en: 'Quantity' },
  'product.freeShipping': { el: 'Δωρεάν αποστολή', en: 'Free shipping' },
  'product.warranty': { el: 'Εγγύηση 2 ετών', en: '2 year warranty' },
  'product.returns': { el: 'Εύκολες επιστροφές', en: 'Easy returns' },
  'product.shippingInfo': { el: 'Πληροφορίες Αποστολής', en: 'Shipping Info' },
  'product.shippingText': { el: 'Δωρεάν αποστολή σε όλη την Ελλάδα για παραγγελίες άνω των 500€. Παράδοση εντός 5-10 εργάσιμων ημερών.', en: 'Free shipping throughout Greece for orders over €500. Delivery within 5-10 business days.' },
  
  // Categories
  'category.all': { el: 'Όλα', en: 'All' },
  'category.vanities': { el: 'Έπιπλα Μπάνιου', en: 'Bathroom Vanities' },
  'category.mirrors': { el: 'Καθρέπτες', en: 'Mirrors' },
  'category.cabinets': { el: 'Ντουλάπια', en: 'Cabinets' },
  'category.columns': { el: 'Κολώνες', en: 'Columns' },
  'category.accessories': { el: 'Αξεσουάρ', en: 'Accessories' },
  'category.price': { el: 'Τιμή', en: 'Price' },
  
  // Contact Page
  'contact.title': { el: 'Επικοινωνήστε μαζί μας', en: 'Contact Us' },
  'contact.subtitle': { el: 'Είμαστε εδώ για να απαντήσουμε σε κάθε ερώτησή σας', en: 'We are here to answer all your questions' },
  'contact.phone': { el: 'Τηλέφωνο', en: 'Phone' },
  'contact.email': { el: 'Email', en: 'Email' },
  'contact.address': { el: 'Διεύθυνση', en: 'Address' },
  'contact.hours': { el: 'Ωράριο', en: 'Working Hours' },
  'contact.form.name': { el: 'Ονοματεπώνυμο', en: 'Full Name' },
  'contact.form.email': { el: 'Email', en: 'Email' },
  'contact.form.phone': { el: 'Τηλέφωνο', en: 'Phone' },
  'contact.form.subject': { el: 'Θέμα', en: 'Subject' },
  'contact.form.message': { el: 'Μήνυμα', en: 'Message' },
  'contact.form.send': { el: 'Αποστολή Μηνύματος', en: 'Send Message' },
  'contact.form.sending': { el: 'Αποστολή...', en: 'Sending...' },
  'contact.form.success': { el: 'Το μήνυμά σας στάλθηκε επιτυχώς!', en: 'Your message was sent successfully!' },
  'contact.form.successDesc': { el: 'Θα επικοινωνήσουμε μαζί σας σύντομα.', en: 'We will contact you soon.' },
  'contact.form.error': { el: 'Σφάλμα', en: 'Error' },
  'contact.form.errorDesc': { el: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.', en: 'Something went wrong. Please try again.' },
  'contact.social': { el: 'Ακολουθήστε μας', en: 'Follow Us' },
  'contact.sendMessage': { el: 'Στείλτε μας μήνυμα', en: 'Send us a message' },
  'contact.findUs': { el: 'Βρείτε μας', en: 'Find Us' },
  'contact.quickContact': { el: 'Γρήγορη Επικοινωνία', en: 'Quick Contact' },
  
  // About Page
  'about.title': { el: 'Σχετικά με εμάς', en: 'About Us' },
  'about.subtitle': { el: 'Η ιστορία μας από το 1974', en: 'Our story since 1974' },
  'about.story.title': { el: 'Η Ιστορία μας', en: 'Our Story' },
  'about.story.text1': { el: 'Από το 1974, η PROBAGNO αποτελεί συνώνυμο της ποιότητας και της αισθητικής στον χώρο του επίπλου μπάνιου. Ξεκινήσαμε ως ένα μικρό οικογενειακό εργαστήριο και εξελιχθήκαμε σε μία από τις πιο αξιόπιστες εταιρείες στον κλάδο.', en: 'Since 1974, PROBAGNO has been synonymous with quality and aesthetics in bathroom furniture. We started as a small family workshop and evolved into one of the most trusted companies in the industry.' },
  'about.story.text2': { el: 'Η δέσμευσή μας στην αριστεία και η προσοχή στη λεπτομέρεια μάς έχουν καθιερώσει ως την πρώτη επιλογή για όσους αναζητούν έπιπλα μπάνιου υψηλής ποιότητας.', en: 'Our commitment to excellence and attention to detail have established us as the first choice for those seeking high-quality bathroom furniture.' },
  'about.values.title': { el: 'Οι Αξίες μας', en: 'Our Values' },
  'about.values.quality': { el: 'Ποιότητα', en: 'Quality' },
  'about.values.qualityDesc': { el: 'Χρησιμοποιούμε μόνο υλικά υψηλής ποιότητας', en: 'We use only high-quality materials' },
  'about.values.innovation': { el: 'Καινοτομία', en: 'Innovation' },
  'about.values.innovationDesc': { el: 'Συνεχής αναζήτηση νέων σχεδίων και τεχνολογιών', en: 'Continuous pursuit of new designs and technologies' },
  'about.values.service': { el: 'Εξυπηρέτηση', en: 'Service' },
  'about.values.serviceDesc': { el: 'Πάντα δίπλα στον πελάτη', en: 'Always by the customer\'s side' },
  'about.values.tradition': { el: 'Παράδοση', en: 'Tradition' },
  'about.values.traditionDesc': { el: '50+ χρόνια εμπειρίας', en: '50+ years of experience' },
  'about.materials.title': { el: 'Υλικά & Φινιρίσματα', en: 'Materials & Finishes' },
  'about.materials.text': { el: 'Χρησιμοποιούμε μόνο τα καλύτερα υλικά για τα έπιπλά μας, εξασφαλίζοντας αντοχή και ομορφιά για χρόνια.', en: 'We use only the best materials for our furniture, ensuring durability and beauty for years.' },
  'about.timeline.title': { el: 'Η Πορεία μας', en: 'Our Journey' },
  'about.stats.years': { el: 'Χρόνια Εμπειρίας', en: 'Years of Experience' },
  'about.stats.clients': { el: 'Ευχαριστημένοι Πελάτες', en: 'Happy Customers' },
  'about.stats.products': { el: 'Προϊόντα', en: 'Products' },
  'about.stats.projects': { el: 'Ολοκληρωμένα Έργα', en: 'Completed Projects' },
  
  // Projects Page
  'projects.title': { el: 'Τα Έργα μας', en: 'Our Projects' },
  'projects.subtitle': { el: 'Ανακαλύψτε πώς τα προϊόντα μας μεταμορφώνουν χώρους', en: 'Discover how our products transform spaces' },
  'projects.filter.all': { el: 'Όλα', en: 'All' },
  'projects.filter.residential': { el: 'Κατοικίες', en: 'Residential' },
  'projects.filter.hotels': { el: 'Ξενοδοχεία', en: 'Hotels' },
  'projects.filter.commercial': { el: 'Επαγγελματικοί Χώροι', en: 'Commercial' },
  'projects.cta.title': { el: 'Έχετε ένα project στο μυαλό σας;', en: 'Have a project in mind?' },
  'projects.cta.subtitle': { el: 'Επικοινωνήστε μαζί μας για να συζητήσουμε τις ανάγκες σας', en: 'Contact us to discuss your needs' },
  'projects.cta.button': { el: 'Επικοινωνήστε μαζί μας', en: 'Contact Us' },
  
  // Catalog Page
  'catalog.title': { el: 'Κατάλογος Προϊόντων', en: 'Product Catalog' },
  'catalog.subtitle': { el: 'Κατεβάστε ή δείτε τον πλήρη κατάλογό μας', en: 'Download or view our complete catalog' },
  'catalog.download': { el: 'Κατέβασμα PDF', en: 'Download PDF' },
  'catalog.view': { el: 'Προβολή Online', en: 'View Online' },
  'catalog.info.size': { el: 'Μέγεθος', en: 'Size' },
  'catalog.info.pages': { el: 'Σελίδες', en: 'Pages' },
  'catalog.info.version': { el: 'Έκδοση', en: 'Version' },
  'catalog.info.language': { el: 'Γλώσσα', en: 'Language' },
  'catalog.highlights': { el: 'Επισκόπηση Καταλόγου', en: 'Catalog Overview' },
  'catalog.cta.title': { el: 'Χρειάζεστε βοήθεια;', en: 'Need help?' },
  'catalog.cta.text': { el: 'Επικοινωνήστε μαζί μας για περισσότερες πληροφορίες', en: 'Contact us for more information' },
  
  // Footer
  'footer.company': { el: 'Εταιρεία', en: 'Company' },
  'footer.products': { el: 'Προϊόντα', en: 'Products' },
  'footer.support': { el: 'Υποστήριξη', en: 'Support' },
  'footer.legal': { el: 'Νομικά', en: 'Legal' },
  'footer.privacy': { el: 'Πολιτική Απορρήτου', en: 'Privacy Policy' },
  'footer.terms': { el: 'Όροι Χρήσης', en: 'Terms of Use' },
  'footer.rights': { el: 'Με επιφύλαξη παντός δικαιώματος', en: 'All rights reserved' },
  'footer.quickLinks': { el: 'Γρήγοροι Σύνδεσμοι', en: 'Quick Links' },
  'footer.categories': { el: 'Κατηγορίες', en: 'Categories' },
  'footer.contact': { el: 'Επικοινωνία', en: 'Contact' },
  'footer.description': { el: 'Ελληνική εταιρεία κατασκευής επίπλων μπάνιου υψηλής αισθητικής από το 1974.', en: 'Greek manufacturer of premium bathroom furniture since 1974.' },
  
  // Brand Story
  'brandStory.title': { el: 'Η Ιστορία μας', en: 'Our Story' },
  'brandStory.subtitle': { el: 'Πάνω από 50 χρόνια δημιουργίας', en: 'Over 50 years of craftsmanship' },
  'brandStory.text1': { el: 'Από το 1974, η PROBAGNO δημιουργεί έπιπλα μπάνιου που συνδυάζουν την ελληνική τεχνογνωσία με τη σύγχρονη αισθητική.', en: 'Since 1974, PROBAGNO has been creating bathroom furniture that combines Greek craftsmanship with modern aesthetics.' },
  'brandStory.text2': { el: 'Κάθε κομμάτι που φτιάχνουμε αντανακλά τη δέσμευσή μας στην ποιότητα και την προσοχή στη λεπτομέρεια.', en: 'Every piece we create reflects our commitment to quality and attention to detail.' },
  'brandStory.cta': { el: 'Μάθετε περισσότερα', en: 'Learn More' },
  
  // Newsletter
  'newsletter.title': { el: 'Μείνετε Ενημερωμένοι', en: 'Stay Updated' },
  'newsletter.subtitle': { el: 'Εγγραφείτε για να λαμβάνετε τα νέα μας', en: 'Subscribe to receive our news' },
  'newsletter.placeholder': { el: 'Το email σας', en: 'Your email' },
  'newsletter.button': { el: 'Εγγραφή', en: 'Subscribe' },
  'newsletter.success': { el: 'Ευχαριστούμε για την εγγραφή!', en: 'Thank you for subscribing!' },
  
  // Projects Showcase
  'projectsShowcase.title': { el: 'Τα Έργα μας', en: 'Our Projects' },
  'projectsShowcase.subtitle': { el: 'Δείτε πώς τα προϊόντα μας μεταμορφώνουν χώρους σε όλη την Ελλάδα', en: 'See how our products transform spaces across Greece' },
  'projectsShowcase.viewAll': { el: 'Δείτε Όλα τα Έργα', en: 'View All Projects' },
  
  // Cart
  'cart.title': { el: 'Καλάθι Αγορών', en: 'Shopping Cart' },
  'cart.empty': { el: 'Το καλάθι σας είναι άδειο', en: 'Your cart is empty' },
  'cart.emptyText': { el: 'Προσθέστε προϊόντα για να ξεκινήσετε', en: 'Add products to get started' },
  'cart.continueShopping': { el: 'Συνέχεια Αγορών', en: 'Continue Shopping' },
  'cart.subtotal': { el: 'Υποσύνολο', en: 'Subtotal' },
  'cart.shipping': { el: 'Αποστολή', en: 'Shipping' },
  'cart.shippingCalc': { el: 'Υπολογίζεται κατά την ολοκλήρωση', en: 'Calculated at checkout' },
  'cart.total': { el: 'Σύνολο', en: 'Total' },
  'cart.checkout': { el: 'Ολοκλήρωση Παραγγελίας', en: 'Proceed to Checkout' },
  'cart.remove': { el: 'Αφαίρεση', en: 'Remove' },
  'cart.added': { el: 'Προστέθηκε στο καλάθι', en: 'Added to cart' },
  
  // General
  'general.loading': { el: 'Φόρτωση...', en: 'Loading...' },
  'general.error': { el: 'Σφάλμα', en: 'Error' },
  'general.success': { el: 'Επιτυχία', en: 'Success' },
  'general.save': { el: 'Αποθήκευση', en: 'Save' },
  'general.cancel': { el: 'Ακύρωση', en: 'Cancel' },
  'general.close': { el: 'Κλείσιμο', en: 'Close' },
  'general.from': { el: 'από', en: 'from' },
  'general.founded': { el: 'Ιδρύθηκε', en: 'Founded' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('probagno-language');
    return (saved as Language) || 'el';
  });

  useEffect(() => {
    localStorage.setItem('probagno-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
