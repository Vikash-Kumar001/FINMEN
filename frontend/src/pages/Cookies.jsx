import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MainNavbar from "../components/MainNavbar";

const Cookies = () => {
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
              Cookie Policy
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are stored on your device when you visit websites. They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies to enhance your experience on our platform, analyze usage patterns, and improve our services. Cookies help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Remember your preferences and settings</li>
                <li>Understand how you interact with our platform</li>
                <li>Improve website performance and functionality</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze traffic and usage patterns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-2">Essential Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-2">Performance Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-2">Functional Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-2">Targeting Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We may use third-party services that use cookies to collect information about your online activities across websites. These services include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Analytics Services:</strong> Google Analytics, Mixpanel</li>
                <li><strong>Advertising Networks:</strong> Google Ads, Facebook Ads</li>
                <li><strong>Social Media Platforms:</strong> Facebook, Twitter, LinkedIn</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Cookies</h2>
              <p className="text-gray-700 mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-2">Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookie Duration</h2>
              <p className="text-gray-700 mb-4">
                Cookies can be either "session" or "persistent" cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Session Cookies:</strong> These are temporary cookies that expire at the end of a browser session. They allow websites to link the actions of a user during a browser session.</li>
                <li><strong>Persistent Cookies:</strong> These remain on your device for a set period of time specified in the cookie. They are activated each time you visit the website that created that particular cookie.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Cookie Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Cookie Policy, please contact us at:
                <br />
                Email: cookies@wisestudent.com
                <br />
                Address: [Company Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;