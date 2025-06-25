import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const handleSuccess = (credentialResponse) => {
        const token = credentialResponse.credential;
        console.log("Google token:", token);

        // Optionally: call your backend
        window.location.href = `${import.meta.env.VITE_API}/auth/google?token=${token}`;
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="flex justify-center items-center h-screen">
                <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
            </div>
        </GoogleOAuthProvider>
    );
}

export default Login;
