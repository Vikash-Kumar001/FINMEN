import React from "react";
// Remove unused motion import
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
} from "lucide-react";
import { globalStatsService } from "../services/globalStatsService";

const MainFooter = () => {
  const [email, setEmail] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [globalStats, setGlobalStats] = React.useState({
    totalSchools: 0,
    totalStudents: 0,
    loading: true
  });

  // Remove unused services array

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
      color: "hover:bg-blue-600",
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
      color: "hover:bg-sky-500",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      color: "hover:bg-pink-600",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
      color: "hover:bg-blue-700",
    },
  ];

  const handleSubscribe = () => {
    if (email) {
      console.log("Subscribing email:", email);
      setEmail("");
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Fetch global stats on component mount
  React.useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const response = await globalStatsService.getCachedGlobalStats();
        
        if (response.success) {
          setGlobalStats({
            totalSchools: response.data.totalSchools,
            totalStudents: response.data.totalStudents,
            loading: false
          });
        } else {
          // Fallback to regular stats if cached fails
          const fallbackResponse = await globalStatsService.getGlobalStats();
          
          if (fallbackResponse.success) {
            setGlobalStats({
              totalSchools: fallbackResponse.data.totalSchools,
              totalStudents: fallbackResponse.data.totalStudents,
              loading: false
            });
          } else {
            setGlobalStats({
              totalSchools: 0,
              totalStudents: 0,
              loading: false
            });
          }
        }
      } catch (error) {
        console.error('MainFooter: Error fetching global stats:', error);
        setGlobalStats({
          totalSchools: 0,
          totalStudents: 0,
          loading: false
        });
      }
    };

    fetchGlobalStats();
  }, []);

  React.useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-100/40 to-pink-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:mt-20 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-2xl">WS</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Wise Student
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Empowering education with innovative management and wellness
                  solutions for the next generation.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">
                  Stay Updated
                </p>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm outline-none"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ArrowUp className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-300"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Contact Us
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:support@wisestudent.org"
                  className="flex items-start gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300 flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium">
                      support@wisestudent.org
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+919043411110"
                  className="flex items-start gap-3 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-all duration-300 flex-shrink-0">
                    <Phone className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm font-medium">+91-904-341-1110</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-gray-600 group">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm font-medium">Delhi | Bangalore | Chennai</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Follow Us
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Join our community and stay connected with the latest updates
                and educational insights.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 hover:border-transparent hover:shadow-lg hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Trusted by</p>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-xs font-semibold text-blue-600 border border-blue-100">
                    {globalStats.loading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      `${globalStats.totalSchools}+ Schools`
                    )}
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-xs font-semibold text-purple-600 border border-purple-100">
                    {globalStats.loading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      `${formatNumber(globalStats.totalStudents)}+ Students`
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Wise Student. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                <a
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Terms of Service
                </a>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <a
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Privacy Policy
                </a>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <a
                  href="/cookies"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </footer>

      {/* Back to Top Button */}
      {isVisible && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all z-50 border-1 border-white/40 cursor-pointer hover:scale-105 duration-200 ease-in-out"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default MainFooter;
