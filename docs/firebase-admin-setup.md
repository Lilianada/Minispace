# Setting Up Firebase Admin Credentials

For MINISPACE to work properly in production, you need to set up Firebase Admin SDK credentials.

## Steps to Generate and Set Up Firebase Admin Credentials

1. **Go to Firebase Console**:
   - Navigate to [Firebase Console](https://console.firebase.google.com/)
   - Select your project

2. **Generate a Service Account Key**:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

3. **Encode the JSON Key**:
   - Convert the JSON file to base64 format using this command:
   ```bash
   cat path/to/your-service-account-key.json | base64
   ```

4. **Set Environment Variables**:
   - For local development, add to your `.env.local` file:
   ```
   FIREBASE_ADMIN_CREDENTIALS=your_base64_encoded_credentials
   ```
   
   - For production (e.g., Vercel), add the environment variable in your hosting dashboard

5. **Security Notes**:
   - NEVER commit the service account key to version control
   - Restrict the service account permissions to only what's needed
   - Rotate the key periodically for better security

## Verifying Setup

You can verify your setup is working by checking the server logs. If authentication is working properly, you should see no errors related to Firebase Admin initialization.
