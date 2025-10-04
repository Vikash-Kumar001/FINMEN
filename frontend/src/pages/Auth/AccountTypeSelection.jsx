import { motion } from "framer-motion";
import { GraduationCap, Users, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountTypeSelection() {
  const navigate = useNavigate();

  const cards = [
    {
      key: "parent",
      title: "Parent",
      description:
        "Track your child’s progress, support their well-being, and stay involved in their learning.",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Child Progress Monitoring",
        "Wellness & Activity Reports",
        "Parental Engagement Tools",
        "Secure Account",
      ],
      icon: Users,
      cta: () => navigate("/register-parent"),
    },
    {
      key: "seller",
      title: "Seller",
      description:
        "Join our marketplace to offer educational resources and track performance.",
      color: "from-green-500 to-emerald-500",
      features: [
        "Business Profile",
        "Product & Resource Listings",
        "Performance Insights",
        "Secure Account",
      ],
      icon: Store,
      cta: () => navigate("/register-seller"),
    },
    {
      key: "teacher",
      title: "Teacher/Mentors",
      description:
        "Access teaching tools, manage classes, and track student progress effectively.",
      color: "from-purple-500 to-pink-500",
      features: [
        "Classes & Learning Tools",
        "Student Progress Tracking",
        "Gamified Challenges",
        "Secure Account",
      ],
      icon: GraduationCap,
      cta: () => navigate("/register-teacher"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative">
      {/* Back to Homepage Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
      >
        ← Back to Homepage
      </button>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Choose Your Account Type</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select whether you're registering as a Parent, Seller, or Teacher to get started with the option that fits you best.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map(({ key, title, description, color, icon: Icon, cta }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all text-center"
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}>
                <Icon className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600 mb-6">{description}</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cta}
                className={`w-full bg-gradient-to-r ${color} text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2`}
              >
                Continue to Registration →
              </motion.button>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-gray-600">
          Need help choosing? Contact our support team for guidance.
        </p>
      </main>
    </div>
  );
}