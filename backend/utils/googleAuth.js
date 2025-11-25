import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return {
    email: payload.email,
    name: payload.name,
    avatar: payload.picture,
  };
};

// Verify Google access token and get user info
export const verifyGoogleAccessToken = async (accessToken) => {
  try {
    // Fetch user info from Google's userinfo endpoint
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      email: response.data.email,
      name: response.data.name,
      avatar: response.data.picture,
      googleId: response.data.id,
    };
  } catch (error) {
    console.error('Error verifying Google access token:', error);
    throw new Error('Invalid Google access token');
  }
};
