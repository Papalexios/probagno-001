/**
 * Enterprise-grade search utilities for product filtering
 * STRICT MODE: Only returns results that actually match
 */

/**
 * Normalize text for search: remove accents, lowercase, trim
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Remove Greek accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Normalize common variations
    .replace(/ά/g, 'α')
    .replace(/έ/g, 'ε')
    .replace(/ή/g, 'η')
    .replace(/ί/g, 'ι')
    .replace(/ό/g, 'ο')
    .replace(/ύ/g, 'υ')
    .replace(/ώ/g, 'ω')
    .replace(/ΐ/g, 'ι')
    .replace(/ΰ/g, 'υ')
    .replace(/ς/g, 'σ') // Final sigma to regular sigma
    // Normalize special characters
    .replace(/[/\\]/g, ' ') // Slashes to spaces
    .replace(/\s+/g, ' '); // Multiple spaces to single
}

/**
 * Tokenize text into searchable words
 */
export function tokenize(text: string): string[] {
  const normalized = normalizeSearchText(text);
  // Split by spaces, hyphens, slashes, commas
  return normalized
    .split(/[\s\-\/,]+/)
    .filter(token => token.length >= 2); // Minimum 2 characters
}

/**
 * Check if search term matches target text
 * STRICT: Returns false if no match found
 */
export function matchesSearch(searchTerm: string, targetText: string): boolean {
  if (!searchTerm || !targetText) return false;
  
  const normalizedSearch = normalizeSearchText(searchTerm);
  const normalizedTarget = normalizeSearchText(targetText);
  
  // Must have minimum length after normalization
  if (normalizedSearch.length < 2) return false;
  
  // Strategy 1: Direct substring match (fastest)
  if (normalizedTarget.includes(normalizedSearch)) {
    return true;
  }
  
  // Strategy 2: Tokenized word match
  const searchTokens = tokenize(searchTerm);
  if (searchTokens.length === 0) return false; // No valid tokens
  
  const targetTokens = tokenize(targetText);
  if (targetTokens.length === 0) return false; // No valid tokens
  
  // Check if ALL search tokens match at least one target token
  // This ensures "White LED" requires BOTH white AND LED
  for (const searchToken of searchTokens) {
    let tokenMatched = false;
    
    for (const targetToken of targetTokens) {
      // Full token match
      if (targetToken === searchToken) {
        tokenMatched = true;
        break;
      }
      // Token starts with search (e.g., "cori" matches "corian")
      if (targetToken.startsWith(searchToken) && searchToken.length >= 3) {
        tokenMatched = true;
        break;
      }
      // Token contains search in the middle (for compound words)
      if (targetToken.includes(searchToken) && searchToken.length >= 4) {
        tokenMatched = true;
        break;
      }
    }
    
    // If this search token didn't match anything, the whole search fails
    if (!tokenMatched) {
      return false;
    }
  }
  
  // All tokens matched
  return true;
}

/**
 * Check if search term matches any item in an array
 */
export function matchesSearchArray(searchTerm: string, items: string[]): boolean {
  if (!searchTerm || !items || items.length === 0) return false;
  
  return items.some(item => matchesSearch(searchTerm, item));
}

/**
 * Advanced product search that checks multiple fields
 */
export interface SearchableProduct {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn?: string;
  colors: string[];
  materials: string[];
  features: string[];
  tags?: string[];
  category?: string;
  subcategory?: string;
}

export function searchProduct(product: SearchableProduct, searchTerm: string): boolean {
  // CRITICAL FIX: Only return true if search is EXPLICITLY empty/null
  if (!searchTerm || searchTerm.trim().length === 0) {
    return true; // Empty search = show all products
  }
  
  if (!product) return false; // No product = no match
  
  const normalizedSearch = normalizeSearchText(searchTerm);
  
  // CRITICAL FIX: If normalized search is too short or empty, return FALSE
  if (normalizedSearch.length < 2) {
    return false; // Invalid search = hide all products
  }
  
  // Search in name (Greek and English)
  if (matchesSearch(searchTerm, product.name)) return true;
  if (matchesSearch(searchTerm, product.nameEn)) return true;
  
  // Search in description
  if (matchesSearch(searchTerm, product.description)) return true;
  if (product.descriptionEn && matchesSearch(searchTerm, product.descriptionEn)) return true;
  
  // Search in colors
  if (matchesSearchArray(searchTerm, product.colors)) return true;
  
  // Search in materials
  if (matchesSearchArray(searchTerm, product.materials)) return true;
  
  // Search in features
  if (matchesSearchArray(searchTerm, product.features)) return true;
  
  // Search in tags/categories
  if (product.tags && matchesSearchArray(searchTerm, product.tags)) return true;
  if (product.category && matchesSearch(searchTerm, product.category)) return true;
  if (product.subcategory && matchesSearch(searchTerm, product.subcategory)) return true;
  
  // CRITICAL FIX: If nothing matched, return FALSE (not true!)
  return false;
}

/**
 * Debug helper to see what matches
 */
export function debugSearch(product: SearchableProduct, searchTerm: string): string[] {
  const matches: string[] = [];
  
  if (matchesSearch(searchTerm, product.name)) matches.push(`Name: ${product.name}`);
  if (matchesSearch(searchTerm, product.nameEn)) matches.push(`Name EN: ${product.nameEn}`);
  if (matchesSearch(searchTerm, product.description)) matches.push(`Description`);
  
  product.colors.forEach(color => {
    if (matchesSearch(searchTerm, color)) matches.push(`Color: ${color}`);
  });
  
  product.materials.forEach(material => {
    if (matchesSearch(searchTerm, material)) matches.push(`Material: ${material}`);
  });
  
  product.features.forEach(feature => {
    if (matchesSearch(searchTerm, feature)) matches.push(`Feature: ${feature}`);
  });
  
  return matches;
}
