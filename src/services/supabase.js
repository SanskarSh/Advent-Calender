import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'calendars';

// Initialize Supabase client
let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase credentials missing in .env');
}

/**
 * Uploads a file to Supabase Storage.
 * @param {File|Blob|string} file - The file to upload.
 * @param {string} folder - The folder path in Supabase (e.g., 'calendar/<token>').
 * @param {string} filename - The filename (e.g., 'calendar.json').
 * @returns {Promise<object>} - Object containing the public URL.
 */
export const uploadFile = async (file, folder, filename) => {
  if (!supabase) throw new Error('Supabase client not initialized');

  const filePath = `${folder}/${filename}`;
  
  // Upload file (upsert: true to overwrite)
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '0',
      upsert: true
    });

  if (error) {
    console.error('Supabase upload error details:', JSON.stringify(error, null, 2));
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return { secure_url: publicUrl }; // Matching Supabase response structure for minimal refactor
};

/**
 * Fetches a JSON file from Supabase Storage.
 * @param {string} token - The calendar token.
 * @param {string} filename - The filename (e.g., 'calendar.json' or 'day1/manifest.json').
 * @returns {Promise<object|null>} - The parsed JSON data or null if not found.
 */
export const fetchJson = async (token, filename) => {
  if (!supabase) return null;

  // Construct path: calendar/<token>/<filename>
  const filePath = `calendar/${token}/${filename}`;

  try {
    // Get public URL
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) return null;

    // Fetch with cache busting
    const response = await fetch(`${data.publicUrl}?t=${Date.now()}`);
    
    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // console.error('Error parsing JSON:', error);
    return null;
  }
};

/**
 * Lists files in a folder.
 * @param {string} folder - The folder path (e.g., 'calendar/<token>').
 * @returns {Promise<string[]>} - List of filenames/paths.
 */
export const listFiles = async (folder) => {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder);

    if (error) {
      console.error('Error listing files:', error);
      return [];
    }

    return data.map(item => item.name);
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

/**
 * Generates a unique token for the calendar.
 * @returns {string}
 */
export const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
