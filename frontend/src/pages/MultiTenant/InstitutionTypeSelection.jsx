import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { School } from "lucide-react";

const InstitutionTypeSelection = () => {
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  const institutionTypes = [
    {
      id: "school",
      title: "School",
      subtitle: "Primary & Secondary Education",
      description: "Manage classes 1–12, students, teachers, parents, and academic activities.",
      icon: <School className="w-10 h-10 text-white" />,
      gradient: "from-blue-500 to-cyan-500",
      border: "border-blue-500",
      features: [
        "✔ Classes 1–12 Management",
        "✔ Student & Parent Tracking",
        "✔ Teacher Assignments",
        "✔ Fee Management",
        "✔ Attendance & Grades",
        "✔ Academic Reports"
      ],
      route: "/school-registration"
    }
  ];

  const handleContinue = () => {
    if (selectedType) {
      const selectedInstitution = institutionTypes.find(type => type.id === selectedType);
      navigate(selectedInstitution.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all z-50"
      >
        ← Back
      </button>

      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10 w-full">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-2">Choose Your Institution Type</h2>
        <p className="text-center text-gray-600 mb-6">
          Select whether you're registering a School to get started with the appropriate management system.
        </p>

        {/* Institution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          {institutionTypes.map((type) => (
            <div
              key={type.id}
              className={`bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center cursor-pointer border-2 ${selectedType === type.id ? type.border : "border-transparent"
                }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className={`w-full h-8 bg-gradient-to-r ${type.gradient} rounded-t-xl mb-2`} />
              <div className={`w-16 h-16 bg-gradient-to-r ${type.gradient} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                {type.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{type.title}</h3>
              <p className="text-gray-600 mb-1">{type.subtitle}</p>
              <p className="text-gray-600 mb-2">{type.description}</p>
              <div className="text-left">
                <span className="font-medium text-gray-800">Key Features:</span>
                <ul className="mt-1 space-y-1 text-gray-700">
                  {type.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            className={`py-2 px-6 rounded-lg font-semibold transition-all ${selectedType
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-purple-500"
                : "bg-gray-200 text-gray-800 cursor-not-allowed"
              }`}
            onClick={handleContinue}
            disabled={!selectedType}
          >
            Continue to Registration →
          </button>
        </div>
        <p className="text-center text-gray-600 mt-4">
          Need help choosing? Contact our support team for guidance on selecting the right platform for your institution.
        </p>
      </div>
    </div>
  );
};

export default InstitutionTypeSelection;