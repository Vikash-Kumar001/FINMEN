import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

// Import all logo images
import rbiLogo from "../assets/NA_Images/rbi.png";
import sebiLogo from "../assets/NA_Images/SEBI_Investor.png";
import ncfeLogo from "../assets/NA_Images/NCFE.png";
import pmJanDhanLogo from "../assets/NA_Images/Pradhan_Jan.png";
import nationalMentalHealthLogo from "../assets/NA_Images/National_Mental_Health.png";
import manasLogo from "../assets/NA_Images/MANAS.png";
import ayushmanBharatSchoolLogo from "../assets/NA_Images/Ayushman_Bharat.png";
import ncertLifeSkillsLogo from "../assets/NA_Images/NCERT_Life_Skills.png";
import unicefLogo from "../assets/NA_Images/UNICEF_adolescent.png";
import youthLogo from "../assets/NA_Images/Youth.png";
import meityLogo from "../assets/NA_Images/MeitY_Cyber_Surakshit.png";
import cyberSafetyLogo from "../assets/NA_Images/Cyber_Safety.png";
import ncertICTLogo from "../assets/NA_Images/NCERT_ICT.png";
import ncertValueEducationLogo from "../assets/NA_Images/NCERT_Value_Education.png";
import ministryOfCultureLogo from "../assets/NA_Images/Ministry_of_Culture.png";
import nehruYuvaLogo from "../assets/NA_Images/Nehru_Yuva.png";
import nitiAayogLogo from "../assets/NA_Images/NITI_Aayog__AIForAll.png";
import cbseAILogo from "../assets/NA_Images/CBSE_AI_Curriculum.png";
import digitalIndiaLogo from "../assets/NA_Images/Digital_India.png";
import ayushmanBharatLogo from "../assets/NA_Images/Ayushman_Bharat.png";
import rashtriyaKishorLogo from "../assets/NA_Images/Rashtriya_Kishor.png";
import fitIndiaLogo from "../assets/NA_Images/Fit_India.png";
import menstrualHygieneLogo from "../assets/NA_Images/Menstrual_Hygiene.png";
import betiBachaoLogo from "../assets/NA_Images/Beti_Bachao.png";
import poshanLogo from "../assets/NA_Images/Poshan.png";
import atalInnovationLogo from "../assets/NA_Images/Atal_Innovation_Mission.png";
import skillIndiaLogo from "../assets/NA_Images/Skill_India.png";
import startupIndiaLogo from "../assets/NA_Images/Startup_India.png";
import nssLogo from "../assets/NA_Images/NSS.png";
import swachhBharatLogo from "../assets/NA_Images/Swachh_Bharat.png";
import ekBharatLogo from "../assets/NA_Images/Ek_Bharat.png";
import unSDGLogo from "../assets/NA_Images/UN_SDG.png";

// Mapping service titles to their logo images
const logoMap = {
  "RBI Financial Literacy Centres": rbiLogo,
  "SEBI Investor Education": sebiLogo,
  "NCFE": ncfeLogo,
  "PM Jan Dhan Yojana": pmJanDhanLogo,
  "National Mental Health Programme": nationalMentalHealthLogo,
  "MANAS App": manasLogo,
  "Ayushman Bharat School Health": ayushmanBharatSchoolLogo,
  "NCERT Life Skills": ncertLifeSkillsLogo,
  "UNICEF Adolescent Development": unicefLogo,
  "Youth Affairs Programmes": youthLogo,
  "MeitY Cyber Surakshit Bharat": meityLogo,
  "Cyber Safety Drives": cyberSafetyLogo,
  "NCERT ICT Curriculum": ncertICTLogo,
  "NCERT Value Education": ncertValueEducationLogo,
  "Ministry of Culture Initiatives": ministryOfCultureLogo,
  "Nehru Yuva Kendra": nehruYuvaLogo,
  "NITI Aayog": nitiAayogLogo,
  "CBSE AI Curriculum": cbseAILogo,
  "Digital India": digitalIndiaLogo,
  "Ayushman Bharat": ayushmanBharatLogo,
  "Rashtriya Kishor Swasthya Karyakram (RKSK)": rashtriyaKishorLogo,
  "Fit India": fitIndiaLogo,
  "Menstrual Hygiene Scheme": menstrualHygieneLogo,
  "Beti Bachao Beti Padhao": betiBachaoLogo,
  "Poshan Abhiyan": poshanLogo,
  "Atal Innovation Mission": atalInnovationLogo,
  "Skill India": skillIndiaLogo,
  "Startup India": startupIndiaLogo,
  "NSS": nssLogo,
  "Swachh Bharat Mission": swachhBharatLogo,
  "Ek Bharat Shreshtha Bharat": ekBharatLogo,
  "UN SDG 4.7": unSDGLogo,
};

const defaultServices = [
  { title: "RBI Financial Literacy Centres" },
  { title: "SEBI Investor Education" },
  { title: "NCFE" },
  { title: "PM Jan Dhan Yojana" },
  { title: "National Mental Health Programme" },
  { title: "MANAS App" },
  { title: "Ayushman Bharat School Health" },
  { title: "NCERT Life Skills" },
  { title: "UNICEF Adolescent Development" },
  { title: "Youth Affairs Programmes" },
  { title: "MeitY Cyber Surakshit Bharat" },
  { title: "Cyber Safety Drives" },
  { title: "NCERT ICT Curriculum" },
  { title: "NCERT Value Education" },
  { title: "Ministry of Culture Initiatives" },
  { title: "Nehru Yuva Kendra" },
  { title: "NITI Aayog" },
  { title: "CBSE AI Curriculum" },
  { title: "Digital India" },
  { title: "Ayushman Bharat" },
  { title: "Rashtriya Kishor Swasthya Karyakram (RKSK)" },
  { title: "Fit India" },
  { title: "Menstrual Hygiene Scheme" },
  { title: "Beti Bachao Beti Padhao" },
  { title: "Poshan Abhiyan" },
  { title: "Atal Innovation Mission" },
  { title: "Skill India" },
  { title: "Startup India" },
  { title: "NSS" },
  { title: "Swachh Bharat Mission" },
  { title: "Ek Bharat Shreshtha Bharat" },
  { title: "UN SDG 4.7" },
];

function NationalAlignments({ services = defaultServices, sectionRef }) {
  // Transform services into card items for InfiniteMovingCards
  const cardItems = services.map((service) => (
    <div key={service.title} className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5">
      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                    <img 
                      src={logoMap[service.title]} 
                      alt={service.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
      <div className="whitespace-nowrap px-1">
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white text-center leading-tight">{service.title}</h3>
                  </div>
                </div>
  ));

  return (
    <div ref={sectionRef} className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="w-full mx-auto">
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-10 text-center">National Alignments</h2>

          <div className="relative overflow-hidden bg-white/10 py-4 sm:py-6 md:py-8 lg:py-12">
            <InfiniteMovingCards 
              items={cardItems} 
              direction="left" 
              speed="slow"
              pauseOnHover={true}
            />
          </div>
          </div>
      </div>
    </div>
  );
}

export default NationalAlignments;


