import { useState, useEffect } from "react";
import { Download, X, Smartphone, Monitor, Share2, CheckCircle } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const InstallPWA = ({ variant = "floating" }) => {
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

    // Show button immediately if not already installed (removed delay)
    if (!isStandaloneCheck) {
      console.log('[InstallPWA] Showing install button immediately');
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showInstructions) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scrolling
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [showInstructions]);

  // Handle install button click - directly start installation for all devices
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show install prompt (Android/Desktop Chrome/Edge)
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === "accepted") {
          setIsInstalled(true);
          setShowInstallButton(false);
        }
      } catch (error) {
        console.error('Install prompt error:', error);
      }
      
      setDeferredPrompt(null);
    }
    // For iOS or browsers without deferredPrompt, do nothing (no modal, no toast)
    // iOS requires manual installation via browser menu
  };

  // Handle actual installation (kept for backward compatibility if needed)
  const handleConfirmInstall = async () => {
    if (deferredPrompt) {
      // Show install prompt (Android/Desktop Chrome/Edge)
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === "accepted") {
          setIsInstalled(true);
          setShowInstallButton(false);
          setShowInstructions(false);
        } else {
          setShowInstructions(false);
        }
      } catch (error) {
        console.error('Install prompt error:', error);
        setShowInstructions(false);
      }
      
      setDeferredPrompt(null);
    } else {
      // For iOS or browsers without deferredPrompt, just close the modal
      setShowInstructions(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowInstructions(false);
  };

  // If already installed, don't show anything
  if (isInstalled || isStandalone) {
    return null;
  }

  // iOS-specific instructions
  const iOSInstructions = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl w-full max-w-sm sm:max-w-md mx-auto border border-gray-100 overflow-hidden"
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -z-0"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
                Install on iOS
              </h3>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Follow these simple steps</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCancel}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>

        {/* Steps */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">1</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Tap Share Button</p>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">Find the Share button (square with arrow ↑) at the bottom of your screen</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">2</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Add to Home Screen</p>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">Scroll down and tap "Add to Home Screen" option</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">3</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Confirm Installation</p>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">Tap "Add" in the top right corner to complete</p>
            </div>
          </motion.div>
        </div>

        {/* Tip Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl border border-purple-100"
        >
          <p className="text-xs sm:text-sm text-purple-800 flex items-start gap-1.5 sm:gap-2">
            <span className="text-purple-500 font-bold flex-shrink-0">💡</span>
            <span><strong>Pro Tip:</strong> After installation, open the app from your home screen for the best experience!</span>
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCancel}
          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg"
        >
          Got it, thanks!
        </motion.button>
      </div>
    </motion.div>
  );

  // Android/Desktop install modal
  const AndroidDesktopInstructions = (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl w-full max-w-sm sm:max-w-md mx-auto border border-gray-100 overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-pink-200/40 to-indigo-200/40 rounded-full blur-3xl -z-0"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                Install Wise Student
              </h3>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Get the app experience</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
          Install Wise Student as an app for a better experience with offline access, faster loading, and notifications.
        </p>
        
        {/* Features */}
        <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-md flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <p className="text-gray-700 font-medium text-sm sm:text-base">Works offline</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg shadow-md flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <p className="text-gray-700 font-medium text-sm sm:text-base">Faster access and loading</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg shadow-md flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <p className="text-gray-700 font-medium text-sm sm:text-base">Push notifications support</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg shadow-md flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <p className="text-gray-700 font-medium text-sm sm:text-base">App-like experience</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          {deferredPrompt ? (
            <button
              onClick={handleConfirmInstall}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Install Now</span>
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Navbar mobile variant button
  if (variant === "navbar-mobile") {
    if (isInstalled || isStandalone || !showInstallButton) {
      return null;
    }
    return (
      <>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleInstallClick}
          className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all font-medium flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Install App</span>
        </motion.button>
        {showInstructions && (
          <>
            <div
              onClick={handleCancel}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
              <div className="pointer-events-auto w-full">
                {platform === "ios" ? iOSInstructions : AndroidDesktopInstructions}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Navbar variant button (desktop)
  if (variant === "navbar") {
    if (isInstalled || isStandalone || !showInstallButton) {
      return null;
    }
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInstallClick}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:scale-105 duration-200 ease-in-out hover:bg-opacity-90 transition-all text-sm font-medium cursor-pointer flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Install App</span>
        </motion.button>
        {showInstructions && (
          <>
            <div
              onClick={handleCancel}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
              <div className="pointer-events-auto w-full">
                {platform === "ios" ? iOSInstructions : AndroidDesktopInstructions}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Floating variant (default)
  return (
    <>

      {showInstructions && (
        <>
          <div
            onClick={handleCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
            <div className="pointer-events-auto w-full">
              {platform === "ios" ? iOSInstructions : AndroidDesktopInstructions}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InstallPWA;

