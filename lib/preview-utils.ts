/**
 * Utility functions for handling preview functionality
 */

/**
 * Generate preview settings for a user's blog or page.
 * This creates a temporary preview ID that can be used to view content
 * before publishing.
 * 
 * @param username - The username of the site owner
 * @param settings - The settings to preview (theme, layout, colors, etc)
 * @returns Promise with the previewId for accessing the preview
 */
export async function generatePreviewId(username: string, settings: any): Promise<string> {
  try {
    // Ensure username is included in settings
    const previewSettings = {
      ...settings,
      username,
      timestamp: new Date().toISOString(),
    };

    // Store the preview settings via the API
    const response = await fetch('/api/preview/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(previewSettings),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate preview');
    }

    const data = await response.json();
    return data.previewId;
  } catch (error) {
    console.error('Error generating preview:', error);
    throw error;
  }
}

/**
 * Helper function to create a preview URL
 * 
 * @param username - The username of the site owner
 * @param previewId - The preview ID generated from generatePreviewId
 * @returns The full URL for accessing the preview
 */
export function getPreviewUrl(username: string, previewId: string): string {
  return `/preview/${username}?id=${previewId}`;
}
