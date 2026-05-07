import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractDomain(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    let domain = urlObj.hostname;
    
    domain = domain.replace(/^www\./i, '');
    
    return domain;
  } catch {
    let cleaned = url.trim();
    
    cleaned = cleaned.replace(/^https?:\/\//i, '');
    cleaned = cleaned.replace(/^www\./i, '');
    
    const pathIndex = cleaned.indexOf('/');
    if (pathIndex !== -1) {
      cleaned = cleaned.substring(0, pathIndex);
    }
    
    const queryIndex = cleaned.indexOf('?');
    if (queryIndex !== -1) {
      cleaned = cleaned.substring(0, queryIndex);
    }
    
    const hashIndex = cleaned.indexOf('#');
    if (hashIndex !== -1) {
      cleaned = cleaned.substring(0, hashIndex);
    }
    
    return cleaned || url;
  }
}