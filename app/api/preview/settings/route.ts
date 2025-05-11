import { NextRequest, NextResponse } from 'next/server';

// In-memory store for temporary preview settings
// NOTE: This will be cleared on server restart - in production you might want to use
// Redis or another persistence layer for longer-lived preview settings
const PREVIEW_SETTINGS_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
const previewSettingsStore: Record<string, {
  settings: any;
  expires: number;
}> = {};

/**
 * Clean up expired preview settings
 */
function cleanupExpiredSettings() {
  const now = Date.now();
  Object.keys(previewSettingsStore).forEach(key => {
    if (previewSettingsStore[key].expires < now) {
      delete previewSettingsStore[key];
    }
  });
}

/**
 * Store temporary preview settings
 */
export async function POST(request: NextRequest) {
  try {
    // Clean up expired settings
    cleanupExpiredSettings();
    
    // Get the settings from the request body
    const settings = await request.json();
    
    // Validate the request
    if (!settings || !settings.username) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    // Generate a unique preview ID
    const previewId = `${settings.username}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Store the settings with an expiration
    previewSettingsStore[previewId] = {
      settings,
      expires: Date.now() + PREVIEW_SETTINGS_TTL,
    };
    
    // Return the preview ID
    return NextResponse.json({ previewId });
  } catch (error) {
    console.error('Error storing preview settings:', error);
    return NextResponse.json({ error: 'Failed to store preview settings' }, { status: 500 });
  }
}

/**
 * Retrieve temporary preview settings
 */
export async function GET(request: NextRequest) {
  try {
    // Clean up expired settings
    cleanupExpiredSettings();
    
    // Get the preview ID from the URL
    const { searchParams } = new URL(request.url);
    const previewId = searchParams.get('id');
    
    // Validate the preview ID
    if (!previewId || !previewSettingsStore[previewId]) {
      return NextResponse.json({ error: 'Preview not found or expired' }, { status: 404 });
    }
    
    // Get the settings
    const { settings } = previewSettingsStore[previewId];
    
    // Return the settings
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error retrieving preview settings:', error);
    return NextResponse.json({ error: 'Failed to retrieve preview settings' }, { status: 500 });
  }
}