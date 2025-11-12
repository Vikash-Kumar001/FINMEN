import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MainNavbar from "../components/MainNavbar";

const Privacy = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handlePillarsClick = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('features');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleWhyChooseClick = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.querySelector('.py-10.bg-gradient-to-r.from-blue-50.to-purple-50');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePricingClick = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.querySelector('.py-16.bg-gradient-to-br.from-purple-50.to-pink-50');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStudentServicesClick = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.querySelector('.py-16.bg-gradient-to-r.from-blue-600.to-purple-600');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFooterClick = () => {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <MainNavbar 
        handlePillarsClick={handlePillarsClick}
        handleWhyChooseClick={handleWhyChooseClick}
        handlePricingClick={handlePricingClick}
        handleStudentServicesClick={handleStudentServicesClick}
        handleFooterClick={handleFooterClick}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We collect personal information that you provide to us directly, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Student information (grade level, school)</li>
                <li>Parent/guardian information (for minor accounts)</li>
                <li>Payment information (processed securely through our payment partners)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-2">Usage Information</h3>
              <p className="text-gray-700 mb-4">
                We automatically collect information about how you interact with our services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Learning progress and achievements</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your learning experience</li>
                <li>Communicate with you about your account and our services</li>
                <li>Process transactions and send transactional notifications</li>
                <li>Analyze usage patterns to enhance our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our platform</li>
                <li><strong>Schools and Educational Institutions:</strong> With your consent or as required for educational purposes</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our services are designed for students and we take special care to protect children's privacy. We comply with applicable children's privacy laws, including COPPA. We do not knowingly collect personal information from children under 13 without parental consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience and analyze usage. You can control cookies through your browser settings. Please refer to our Cookie Policy for more information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: support@wisestudent.org
                <br />
                Address: Chennai, India
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;