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
  'nav.admin': { el: 'Διαχείριση', en: 'Admin' },
  'nav.menu': { el: 'Μενού', en: 'Menu' },
  
  // Hero Section
  'hero.title': { el: 'Έπιπλα Μπάνιου Υψηλής Αισθητικής', en: 'Premium Bathroom Furniture' },
  'hero.subtitle': { el: 'Από το 1974, δημιουργούμε χώρους που εμπνέουν', en: 'Since 1974, creating spaces that inspire' },
  'hero.cta.products': { el: 'Ανακαλύψτε τη Συλλογή', en: 'Discover Collection' },
  'hero.cta.contact': { el: 'Επικοινωνήστε μαζί μας', en: 'Contact Us' },
  
  // Home sections
  'home.featured.title': { el: 'Επιλεγμένα Προϊόντα', en: 'Featured Products' },
  'home.featured.subtitle': { el: 'Μια επιλεγμένη συλλογή από τα καλύτερα έπιπλα μπάνιου μας', en: 'A curated selection of our finest bathroom furniture' },
  'home.featured.viewAll': { el: 'Δείτε Όλα τα Προϊόντα', en: 'View All Products' },
  
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
  'products.sort.name': { el: 'Όνομα', en: 'Name' },
  'products.noResults': { el: 'Δεν βρέθηκαν προϊόντα', en: 'No products found' },
  'products.clearFilters': { el: 'Καθαρισμός φίλτρων', en: 'Clear filters' },
  'products.applyFilters': { el: 'Εφαρμογή Φίλτρων', en: 'Apply Filters' },
  'products.activeFilters': { el: 'Ενεργά Φίλτρα', en: 'Active Filters' },
  'products.filter': { el: 'Φίλτρα', en: 'Filters' },
  'products.clearAll': { el: 'Καθαρισμός όλων', en: 'Clear all' },
  'products.results': { el: 'προϊόντα', en: 'products' },
  
  // Filter labels
  'filter.categories': { el: 'Κατηγορίες', en: 'Categories' },
  'filter.color': { el: 'Χρώμα', en: 'Color' },
  'filter.material': { el: 'Υλικό', en: 'Material' },
  'filter.price': { el: 'Τιμή', en: 'Price' },
  'filter.priceRange': { el: 'Εύρος Τιμής', en: 'Price Range' },
  'filter.quickPrices': { el: 'Γρήγορη Επιλογή', en: 'Quick Select' },
  
  // Product Detail
  'product.addToCart': { el: 'Προσθήκη στο Καλάθι', en: 'Add to Cart' },
  'product.addedToCart': { el: 'προστέθηκε στο καλάθι', en: 'added to cart' },
  'product.inStock': { el: 'Διαθέσιμο', en: 'In Stock' },
  'product.outOfStock': { el: 'Μη Διαθέσιμο', en: 'Out of Stock' },
  'product.dimensions': { el: 'Διαστάσεις', en: 'Dimensions' },
  'product.materials': { el: 'Υλικά', en: 'Materials' },
  'product.colors': { el: 'Χρώματα', en: 'Colors' },
  'product.features': { el: 'Χαρακτηριστικά', en: 'Features' },
  'product.shipping': { el: 'Αποστολή', en: 'Shipping' },
  'product.related': { el: 'Σχετικά Προϊόντα', en: 'Related Products' },
  'product.relatedProducts': { el: 'Σχετικά Προϊόντα', en: 'Related Products' },
  'product.description': { el: 'Περιγραφή', en: 'Description' },
  'product.selectDimension': { el: 'Επιλέξτε διάσταση', en: 'Select dimension' },
  'product.selectDimensions': { el: 'Επιλέξτε διαστάσεις', en: 'Select Dimensions' },
  'product.availableColors': { el: 'Διαθέσιμα Χρώματα', en: 'Available Colors' },
  'product.quantity': { el: 'Ποσότητα', en: 'Quantity' },
  'product.freeShipping': { el: 'Δωρεάν αποστολή', en: 'Free shipping' },
  'product.warranty': { el: 'Εγγύηση 2 ετών', en: '2 year warranty' },
  'product.returns': { el: 'Εύκολες επιστροφές', en: 'Easy returns' },
  'product.shippingInfo': { el: 'Πληροφορίες Αποστολής', en: 'Shipping Info' },
  'product.shippingText': { el: 'Δωρεάν αποστολή σε όλη την Ελλάδα για παραγγελίες άνω των 500€. Παράδοση εντός 5-10 εργάσιμων ημερών.', en: 'Free shipping throughout Greece for orders over €500. Delivery within 5-10 business days.' },
  'product.shippingInfo1': { el: 'Δωρεάν αποστολή σε όλη την Ελλάδα για παραγγελίες άνω των €500.', en: 'Free shipping throughout Greece for orders over €500.' },
  'product.shippingInfo2': { el: 'Χρόνος παράδοσης: 5-10 εργάσιμες ημέρες.', en: 'Delivery time: 5-10 business days.' },
  'product.shippingInfo3': { el: 'Για ειδικές παραγγελίες ή κατασκευές σε ειδικές διαστάσεις επικοινωνήστε μαζί μας.', en: 'For special orders or custom dimensions, please contact us.' },
  'product.home': { el: 'Αρχική', en: 'Home' },
  'product.notFound': { el: 'Το προϊόν δεν βρέθηκε', en: 'Product not found' },
  'product.backToProducts': { el: 'Επιστροφή στα Προϊόντα', en: 'Back to Products' },
  
  // Categories
  'category.all': { el: 'Όλα', en: 'All' },
  'category.vanities': { el: 'Έπιπλα Μπάνιου', en: 'Bathroom Vanities' },
  'category.mirrors': { el: 'Καθρέπτες', en: 'Mirrors' },
  'category.cabinets': { el: 'Ντουλάπια', en: 'Cabinets' },
  'category.columns': { el: 'Κολώνες', en: 'Columns' },
  'category.accessories': { el: 'Αξεσουάρ', en: 'Accessories' },
  'category.sinks': { el: 'Νιπτήρες', en: 'Sinks' },
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
  'contact.name': { el: 'Ονοματεπώνυμο', en: 'Full Name' },
  'contact.namePlaceholder': { el: 'Το όνομά σας', en: 'Your name' },
  'contact.emailPlaceholder': { el: 'Το email σας', en: 'Your email' },
  'contact.phonePlaceholder': { el: 'Το τηλέφωνό σας', en: 'Your phone' },
  'contact.subject': { el: 'Θέμα', en: 'Subject' },
  'contact.subjectPlaceholder': { el: 'Θέμα μηνύματος', en: 'Message subject' },
  'contact.message': { el: 'Μήνυμα', en: 'Message' },
  'contact.messagePlaceholder': { el: 'Το μήνυμά σας...', en: 'Your message...' },
  'contact.send': { el: 'Αποστολή Μηνύματος', en: 'Send Message' },
  'contact.followUs': { el: 'Ακολουθήστε μας', en: 'Follow Us' },
  'contact.visitUs': { el: 'Επισκεφθείτε μας', en: 'Visit Us' },
  
  // About Page
  'about.title': { el: 'Σχετικά με εμάς', en: 'About Us' },
  'about.subtitle': { el: 'Η ιστορία μας από το 1974', en: 'Our story since 1974' },
  'about.heroSubtitle': { el: 'Πάνω από 50 χρόνια δημιουργούμε έπιπλα μπάνιου υψηλής αισθητικής', en: 'Over 50 years creating premium bathroom furniture' },
  'about.yearsExperience': { el: 'Χρόνια Εμπειρίας', en: 'Years of Experience' },
  'about.satisfiedClients': { el: 'Ικανοποιημένοι Πελάτες', en: 'Satisfied Clients' },
  'about.productModels': { el: 'Μοντέλα Προϊόντων', en: 'Product Models' },
  'about.greekProduction': { el: 'Ελληνική Παραγωγή', en: 'Greek Production' },
  'about.ourStory': { el: 'Η Ιστορία μας', en: 'Our Story' },
  'about.storyP1': { el: 'Η PROBAGNO ιδρύθηκε το 1974 ως μια μικρή οικογενειακή επιχείρηση στην Αθήνα. Από τότε, έχουμε εξελιχθεί σε έναν από τους κορυφαίους κατασκευαστές επίπλων μπάνιου στην Ελλάδα.', en: 'PROBAGNO was founded in 1974 as a small family business in Athens. Since then, we have evolved into one of the leading bathroom furniture manufacturers in Greece.' },
  'about.storyP2': { el: 'Η δέσμευσή μας στην ποιότητα και την καινοτομία μας έχει καθιερώσει ως την πρώτη επιλογή για όσους αναζητούν έπιπλα μπάνιου υψηλής αισθητικής. Κάθε προϊόν που δημιουργούμε αντανακλά την προσοχή μας στη λεπτομέρεια και την αγάπη μας για το σχεδιασμό.', en: 'Our commitment to quality and innovation has established us as the first choice for those seeking premium bathroom furniture. Every product we create reflects our attention to detail and love for design.' },
  'about.storyP3': { el: 'Σήμερα, με περισσότερα από 50 χρόνια εμπειρίας, συνεχίζουμε να προσφέρουμε προϊόντα που συνδυάζουν την ελληνική τεχνογνωσία με τη σύγχρονη αισθητική.', en: 'Today, with over 50 years of experience, we continue to offer products that combine Greek craftsmanship with modern aesthetics.' },
  'about.yearFounded': { el: 'Έτος Ίδρυσης', en: 'Year Founded' },
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
  'about.ourValues': { el: 'Οι Αξίες μας', en: 'Our Values' },
  'about.valuesSubtitle': { el: 'Οι αρχές που μας καθοδηγούν', en: 'The principles that guide us' },
  'about.quality': { el: 'Ποιότητα', en: 'Quality' },
  'about.qualityDesc': { el: 'Χρησιμοποιούμε μόνο κορυφαία υλικά για προϊόντα που αντέχουν στον χρόνο.', en: 'We use only premium materials for products that stand the test of time.' },
  'about.greekManufacturing': { el: 'Ελληνική Κατασκευή', en: 'Greek Manufacturing' },
  'about.greekManufacturingDesc': { el: 'Όλα τα προϊόντα μας κατασκευάζονται στην Ελλάδα με προσοχή στη λεπτομέρεια.', en: 'All our products are manufactured in Greece with attention to detail.' },
  'about.service': { el: 'Εξυπηρέτηση', en: 'Service' },
  'about.serviceDesc': { el: 'Προσωπική εξυπηρέτηση και υποστήριξη σε κάθε βήμα.', en: 'Personal service and support at every step.' },
  'about.environmental': { el: 'Περιβαλλοντική Ευαισθησία', en: 'Environmental Awareness' },
  'about.environmentalDesc': { el: 'Δέσμευση για βιώσιμες πρακτικές και υλικά.', en: 'Commitment to sustainable practices and materials.' },
  'about.ourJourney': { el: 'Η Πορεία μας', en: 'Our Journey' },
  'about.journeySubtitle': { el: '50 χρόνια δημιουργίας και εξέλιξης', en: '50 years of creation and evolution' },
  'about.founding': { el: 'Ίδρυση', en: 'Founding' },
  'about.timeline.1974': { el: 'Ίδρυση της PROBAGNO ως οικογενειακή επιχείρηση στην Αθήνα.', en: 'PROBAGNO founded as a family business in Athens.' },
  'about.expansion': { el: 'Επέκταση', en: 'Expansion' },
  'about.timeline.1985': { el: 'Μεταφορά σε νέες μεγαλύτερες εγκαταστάσεις και επέκταση της γκάμας προϊόντων.', en: 'Move to new larger facilities and expansion of product range.' },
  'about.exports': { el: 'Εξαγωγές', en: 'Exports' },
  'about.timeline.1995': { el: 'Έναρξη εξαγωγών σε χώρες της Ευρώπης και της Μέσης Ανατολής.', en: 'Start of exports to European and Middle Eastern countries.' },
  'about.ledTechnology': { el: 'Τεχνολογία LED', en: 'LED Technology' },
  'about.timeline.2010': { el: 'Εισαγωγή καινοτόμων καθρεπτών με ενσωματωμένο φωτισμό LED.', en: 'Introduction of innovative mirrors with integrated LED lighting.' },
  'about.digitalEra': { el: 'Ψηφιακή Εποχή', en: 'Digital Era' },
  'about.timeline.2020': { el: 'Ψηφιακός μετασχηματισμός και ηλεκτρονικό κατάστημα.', en: 'Digital transformation and online store.' },
  'about.today': { el: 'Σήμερα', en: 'Today' },
  'about.timeline.2024': { el: '50 χρόνια αριστείας στα έπιπλα μπάνιου, συνεχίζοντας να καινοτομούμε.', en: '50 years of excellence in bathroom furniture, continuing to innovate.' },
  'about.materialsFinishes': { el: 'Υλικά & Φινιρίσματα', en: 'Materials & Finishes' },
  'about.materialsSubtitle': { el: 'Χρησιμοποιούμε μόνο τα καλύτερα υλικά', en: 'We use only the finest materials' },
  'about.importantInfo': { el: 'Σημαντικές Πληροφορίες', en: 'Important Information' },
  'about.info1': { el: 'Όλα τα προϊόντα μας κατασκευάζονται στην Ελλάδα', en: 'All our products are manufactured in Greece' },
  'about.info2': { el: 'Εγγύηση 2 ετών σε όλα τα προϊόντα', en: '2 year warranty on all products' },
  'about.info3': { el: 'Δυνατότητα κατασκευής σε ειδικές διαστάσεις', en: 'Custom size manufacturing available' },
  'about.info4': { el: 'Πανελλαδική αποστολή και εγκατάσταση', en: 'Nationwide shipping and installation' },
  
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
  'projects.all': { el: 'Όλα', en: 'All' },
  'projects.residence': { el: 'Κατοικία', en: 'Residence' },
  'projects.hotel': { el: 'Ξενοδοχείο', en: 'Hotel' },
  'projects.haveProject': { el: 'Έχετε ένα project στο μυαλό σας;', en: 'Have a project in mind?' },
  'projects.ctaSubtitle': { el: 'Επικοινωνήστε μαζί μας για να συζητήσουμε τις ανάγκες σας', en: 'Contact us to discuss your needs' },
  
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
  'catalog.openNewTab': { el: 'Άνοιγμα σε νέα καρτέλα', en: 'Open in new tab' },
  'catalog.size': { el: 'Μέγεθος', en: 'Size' },
  'catalog.pages': { el: 'Σελίδες', en: 'Pages' },
  'catalog.version': { el: 'Έκδοση', en: 'Version' },
  'catalog.language': { el: 'Γλώσσα', en: 'Language' },
  'catalog.greek': { el: 'Ελληνικά', en: 'Greek' },
  'catalog.preview': { el: 'Προεπισκόπηση', en: 'Preview' },
  'catalog.whatYouFind': { el: 'Τι θα βρείτε', en: 'What you\'ll find' },
  'catalog.findSubtitle': { el: 'Ανακαλύψτε την πλήρη συλλογή μας', en: 'Discover our complete collection' },
  'catalog.elegantFurniture': { el: 'Κομψά Έπιπλα', en: 'Elegant Furniture' },
  'catalog.elegantDesc': { el: 'Πλήρης γκάμα επίπλων μπάνιου με κομψό σχεδιασμό.', en: 'Complete range of bathroom furniture with elegant design.' },
  'catalog.sinks': { el: 'Νιπτήρες', en: 'Sinks' },
  'catalog.sinksDesc': { el: 'Ποικιλία νιπτήρων σε διάφορα σχέδια και υλικά.', en: 'Variety of sinks in various designs and materials.' },
  'catalog.columnsCabinets': { el: 'Κολώνες & Ντουλάπια', en: 'Columns & Cabinets' },
  'catalog.columnsDesc': { el: 'Λύσεις αποθήκευσης για κάθε μπάνιο.', en: 'Storage solutions for every bathroom.' },
  'catalog.ledMirrors': { el: 'Καθρέπτες LED', en: 'LED Mirrors' },
  'catalog.ledMirrorsDesc': { el: 'Σύγχρονοι καθρέπτες με ενσωματωμένο φωτισμό LED.', en: 'Modern mirrors with integrated LED lighting.' },
  'catalog.moreInfo': { el: 'Περισσότερες Πληροφορίες', en: 'More Information' },
  'catalog.moreInfoSubtitle': { el: 'Επικοινωνήστε μαζί μας για οποιαδήποτε ερώτηση', en: 'Contact us for any questions' },
  
  // Footer
  'footer.company': { el: 'Εταιρεία', en: 'Company' },
  'footer.products': { el: 'Προϊόντα', en: 'Products' },
  'footer.support': { el: 'Υποστήριξη', en: 'Support' },
  'footer.legal': { el: 'Νομικά', en: 'Legal' },
  'footer.privacy': { el: 'Πολιτική Απορρήτου', en: 'Privacy Policy' },
  'footer.terms': { el: 'Όροι Χρήσης', en: 'Terms of Use' },
  'footer.rights': { el: 'Με επιφύλαξη παντός δικαιώματος', en: 'All rights reserved' },
  'footer.quickLinks': { el: 'Γρήγοροι Σύνδεσμοι', en: 'Quick Links' },
  'footer.navigation': { el: 'Πλοήγηση', en: 'Navigation' },
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
