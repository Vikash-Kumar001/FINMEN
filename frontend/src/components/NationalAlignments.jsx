import React from "react";
import { motion } from "framer-motion";

const defaultServices = [
  { title: "RBI Financial Literacy Centres", logo: "🏦" },
  { title: "SEBI Investor Education", logo: "📈" },
  { title: "NCFE", logo: "🎓" },
  { title: "PM Jan Dhan Yojana", logo: "💰" },
  { title: "National Mental Health Programme", logo: "🧠" },
  { title: "MANAS App", logo: "📱" },
  { title: "Ayushman Bharat School Health", logo: "🏥" },
  { title: "NCERT Life Skills", logo: "🌟" },
  { title: "UNICEF Adolescent Development", logo: "👥" },
  { title: "Youth Affairs Programmes", logo: "🎯" },
  { title: "MeitY Cyber Surakshit Bharat", logo: "🛡️" },
  { title: "Cyber Safety Drives", logo: "🔒" },
  { title: "NCERT ICT Curriculum", logo: "💻" },
  { title: "NCERT Value Education", logo: "📚" },
  { title: "Ministry of Culture Initiatives", logo: "🎭" },
  { title: "Nehru Yuva Kendra", logo: "🏛️" },
  { title: "NITI Aayog", logo: "🤖" },
  { title: "CBSE AI Curriculum", logo: "🧠" },
  { title: "Digital India", logo: "💻" },
  { title: "Ayushman Bharat", logo: "🏥" },
  { title: "Rashtriya Kishor Swasthya Karyakram (RKSK)", logo: "💪" },
  { title: "Fit India", logo: "🏃" },
  { title: "Menstrual Hygiene Scheme", logo: "🌸" },
  { title: "Beti Bachao Beti Padhao", logo: "👧" },
  { title: "Poshan Abhiyan", logo: "🥗" },
  { title: "Atal Innovation Mission", logo: "🚀" },
  { title: "Skill India", logo: "🛠️" },
  { title: "Startup India", logo: "💡" },
  { title: "NSS", logo: "🎓" },
  { title: "Swachh Bharat Mission", logo: "🧹" },
  { title: "Ek Bharat Shreshtha Bharat", logo: "🇮🇳" },
  { title: "UN SDG 4.7", logo: "🌍" },
];

function NationalAlignments({ services = defaultServices, sectionRef }) {
  return (
    <div ref={sectionRef} className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-left"
        >
          <h2 className="text-4xl font-bold text-white mb-10 text-center">National Alignments</h2>

          <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-12">
            <motion.div
              animate={{ x: [0, -100 * services.length * 12] }}
              transition={{ duration: 500, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 whitespace-nowrap"
              style={{ width: "max-content" }}
            >
              {services.map((service, index) => (
                <div key={`first-${index}`} className="flex items-center gap-3 flex-shrink-0 px-4 py-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-lg">{service.logo}</span>
                  </div>
                  <div className="whitespace-nowrap">
                    <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                  </div>
                </div>
              ))}

              {services.map((service, index) => (
                <div key={`second-${index}`} className="flex items-center gap-3 flex-shrink-0 px-4 py-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-lg">{service.logo}</span>
                  </div>
                  <div className="whitespace-nowrap">
                    <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                  </div>
                </div>
              ))}

              {services.map((service, index) => (
                <div key={`third-${index}`} className="flex items-center gap-3 flex-shrink-0 px-4 py-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-lg">{service.logo}</span>
                  </div>
                  <div className="whitespace-nowrap">
                    <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NationalAlignments;


