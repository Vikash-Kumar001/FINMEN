import { useState, useEffect } from "react";
import { Download, X, Smartphone, Monitor, Share2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState("unknown");
  const [isStandalone, setIsStandalone] = useState(false);

  // Detect platform and if app is already installed
  useEffect(() => {
    console.log('[InstallPWA] Component mounted');
    
    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const isStandaloneCheck = standalone || window.navigator.standalone;
    
    console.log('[InstallPWA] Standalone check:', standalone, window.navigator.standalone);
    setIsStandalone(standalone);

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    let detectedPlatform = "desktop";
    if (isIOS) {
      detectedPlatform = "ios";
    } else if (isAndroid) {
      detectedPlatform = "android";
    }
    
    console.log('[InstallPWA] Platform detected:', detectedPlatform);
    setPlatform(detectedPlatform);

    // Check if already installed
    if (isStandaloneCheck) {
      console.log('[InstallPWA] App already installed, hiding component');
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event (Android/Desktop Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      console.log('[InstallPWA] beforeinstallprompt event received');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if PWA is installable (show button after a delay for better UX)
    const timer = setTimeout(() => {
      // Show button after 3 seconds if not already installed
      // Check again if installed (state might have changed)
      const isNowStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
      
      console.log('[InstallPWA] 3 second timer fired');
      console.log('[InstallPWA] Platform:', detectedPlatform);
      console.log('[InstallPWA] Standalone:', isNowStandalone);
      console.log('[InstallPWA] Is installed:', isInstalled);
      
      if (!isNowStandalone) {
        console.log('[InstallPWA] Showing install button');
        setShowInstallButton(true);
      } else {
        console.log('[InstallPWA] Not showing button - already installed');
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  // Handle install button click
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show install prompt (Android/Desktop Chrome/Edge)
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowInstallButton(false);
      }
      
      setDeferredPrompt(null);
    } else if (platform === "ios") {
      // For iOS, show instructions
      setShowInstructions(true);
    } else {
      // For other browsers, show instructions
      setShowInstructions(true);
    }
  };

  // If already installed, don't show anything
  if (isInstalled || isStandalone) {
    return null;
  }

  // iOS-specific instructions
  const iOSInstructions = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto border border-gray-200"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Install on iOS</h3>
        <button
          onClick={() => setShowInstructions(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-purple-100 rounded-full p-2">
            <Share2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Step 1</p>
            <p className="text-gray-600 text-sm">Tap the Share button (square with arrow ↑) at the bottom</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-2">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Step 2</p>
            <p className="text-gray-600 text-sm">Scroll down and select "Add to Home Screen"</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Step 3</p>
            <p className="text-gray-600 text-sm">Tap "Add" in the top right corner</p>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-purple-50 rounded-xl">
        <p className="text-sm text-purple-800">
          <strong>Tip:</strong> After installation, open the app from your home screen for the best experience!
        </p>
      </div>
    </motion.div>
  );

  // Android/Desktop instructions
  const AndroidDesktopInstructions = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto border border-gray-200"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Install {platform === "android" ? "on Android" : "on Desktop"}
        </h3>
        <button
          onClick={() => setShowInstructions(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        {platform === "android" ? (
          <>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Method 1: Install Prompt</p>
                <p className="text-gray-600 text-sm">
                  A prompt may appear automatically. Tap "Install" to add to your home screen.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Method 2: Menu Option</p>
                <p className="text-gray-600 text-sm">
                  Tap the 3-dot menu (⋮) → "Install app" or "Add to Home screen"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Method 3: Address Bar</p>
                <p className="text-gray-600 text-sm">
                  Look for the install icon (⊕) in your browser's address bar
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Method 1: Address Bar</p>
                <p className="text-gray-600 text-sm">
                  Click the install icon (⊕) in your browser's address bar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Method 2: Menu Option</p>
                <p className="text-gray-600 text-sm">
                  Click the 3-dot menu (⋮) → "Install Wise Student..." or "Apps" → "Install this site as an app"
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Benefits:</strong> Works offline, faster access, and notifications!
        </p>
      </div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {showInstallButton && !showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Install App</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {platform === "ios" ? iOSInstructions : AndroidDesktopInstructions}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPWA;

