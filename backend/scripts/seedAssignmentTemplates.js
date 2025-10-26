import mongoose from 'mongoose';
import AssignmentTemplate from '../models/AssignmentTemplate.js';
import User from '../models/User.js';

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finmen';
await mongoose.connect(MONGO_URI);
console.log('Connected to MongoDB');

try {
  // Find a school teacher to assign templates to
  const teacher = await User.findOne({ role: 'school_teacher' });
  
  if (!teacher) {
    console.log('No school teacher found. Creating templates without assigned user.');
  }

  const tenantId = teacher?.tenantId || 'default';
  const createdBy = teacher?._id || null;

  console.log('Seeding assignment templates...');

  const defaultTemplates = [
    // Quiz Templates
    {
      title: "Multiple Choice Quiz",
      description: "A standard multiple choice quiz with 4 options per question",
      type: "quiz",
      category: "general",
      questionCount: 10,
      duration: 30,
      questions: [
        {
          type: "multiple_choice",
          question: "What is the capital of France?",
          options: [
            { left: "London", right: "" },
            { left: "Berlin", right: "" },
            { left: "Paris", right: "" },
            { left: "Madrid", right: "" }
          ],
          correctAnswer: 2,
          points: 1,
          explanation: "Paris is the capital and largest city of France."
        },
        {
          type: "multiple_choice",
          question: "Which planet is known as the Red Planet?",
          options: [
            { left: "Venus", right: "" },
            { left: "Mars", right: "" },
            { left: "Jupiter", right: "" },
            { left: "Saturn", right: "" }
          ],
          correctAnswer: 1,
          points: 1,
          explanation: "Mars is often called the Red Planet due to iron oxide on its surface."
        }
      ],
      instructions: "Choose the best answer for each question. You have 30 minutes to complete this quiz.",
      gradingType: "auto",
      allowRetake: true,
      maxAttempts: 3,
      tags: ["general", "multiple choice", "quick"]
    },
    {
      title: "True/False Quiz",
      description: "A simple true/false quiz format",
      type: "quiz",
      category: "general",
      questionCount: 15,
      duration: 20,
      questions: [
        {
          type: "true_false",
          question: "The Earth is round.",
          correctAnswer: true,
          points: 1,
          explanation: "The Earth is approximately spherical in shape."
        },
        {
          type: "true_false",
          question: "Water boils at 100°C at sea level.",
          correctAnswer: true,
          points: 1,
          explanation: "At standard atmospheric pressure, water boils at 100°C."
        }
      ],
      instructions: "Mark each statement as True or False.",
      gradingType: "auto",
      allowRetake: true,
      maxAttempts: 2,
      tags: ["general", "true false", "quick"]
    },

    // Test Templates
    {
      title: "Comprehensive Test",
      description: "A comprehensive test with multiple question types",
      type: "test",
      category: "general",
      questionCount: 25,
      duration: 90,
      questions: [
        {
          type: "multiple_choice",
          question: "What is photosynthesis?",
          options: [
            { left: "The process by which plants make food", right: "" },
            { left: "The process by which plants breathe", right: "" },
            { left: "The process by which plants grow", right: "" },
            { left: "The process by which plants reproduce", right: "" }
          ],
          correctAnswer: 0,
          points: 2,
          explanation: "Photosynthesis is the process by which plants convert light energy into chemical energy."
        },
        {
          type: "short_answer",
          question: "Name the three states of matter.",
          correctAnswer: "solid, liquid, gas",
          points: 3,
          explanation: "The three fundamental states of matter are solid, liquid, and gas."
        },
        {
          type: "essay",
          question: "Explain the water cycle in detail.",
          points: 10,
          explanation: "The water cycle involves evaporation, condensation, and precipitation."
        }
      ],
      instructions: "Answer all questions completely. Show your work for calculation problems.",
      gradingType: "manual",
      allowRetake: false,
      maxAttempts: 1,
      tags: ["comprehensive", "mixed types", "long form"]
    },

    // Homework Templates
    {
      title: "Problem Solving Homework",
      description: "A homework assignment focused on problem-solving skills",
      type: "homework",
      category: "math",
      questionCount: 8,
      duration: 60,
      questions: [
        {
          type: "problem_solving",
          question: "Solve the equation: 2x + 5 = 13",
          points: 5,
          explanation: "Show all steps: 2x = 8, x = 4"
        },
        {
          type: "word_problem",
          question: "A rectangle has a length of 8 cm and width of 5 cm. Find its area and perimeter.",
          points: 8,
          explanation: "Area = length × width = 8 × 5 = 40 cm², Perimeter = 2(length + width) = 2(8 + 5) = 26 cm"
        }
      ],
      instructions: "Solve each problem step by step. Show all your work clearly.",
      gradingType: "manual",
      allowRetake: true,
      maxAttempts: 2,
      tags: ["math", "problem solving", "homework"]
    },

    // Classwork Templates
    {
      title: "Interactive Classwork",
      description: "An interactive classwork activity for in-class participation",
      type: "classwork",
      category: "science",
      questionCount: 12,
      duration: 45,
      questions: [
        {
          type: "fill_in_blank",
          question: "The process of converting light energy to chemical energy is called __________.",
          correctAnswer: "photosynthesis",
          points: 2,
          explanation: "Photosynthesis is the process plants use to make food."
        },
        {
          type: "matching",
          question: "Match the following:",
          options: [
            { left: "Mitochondria", right: "Powerhouse of the cell" },
            { left: "Nucleus", right: "Control center of the cell" },
            { left: "Cell Wall", right: "Protective outer layer" }
          ],
          points: 6,
          explanation: "Each organelle has a specific function in the cell."
        }
      ],
      instructions: "Complete the activity during class time. Work with your partner if assigned.",
      gradingType: "auto",
      allowRetake: false,
      maxAttempts: 1,
      tags: ["science", "interactive", "classwork"]
    },

    // Project Templates
    {
      title: "Research Project",
      description: "A comprehensive research project with multiple components",
      type: "project",
      category: "social",
      questionCount: 5,
      duration: 480, // 8 hours over multiple days
      questions: [
        {
          type: "research_question",
          question: "Choose a historical event and analyze its causes and effects.",
          points: 20,
          explanation: "Include primary and secondary sources, analyze multiple perspectives."
        },
        {
          type: "presentation",
          question: "Create a 10-minute presentation about your research findings.",
          points: 15,
          explanation: "Use visual aids and cite all sources properly."
        },
        {
          type: "reflection",
          question: "Write a 500-word reflection on what you learned from this project.",
          points: 10,
          explanation: "Reflect on the research process and your findings."
        }
      ],
      instructions: "This is a multi-day project. Submit your work by the due date. Include a bibliography.",
      gradingType: "manual",
      allowRetake: false,
      maxAttempts: 1,
      tags: ["research", "project", "long term"]
    }
  ];

  // Check if templates already exist
  const existingTemplates = await AssignmentTemplate.countDocuments({ 
    tenantId: tenantId,
    createdBy: createdBy 
  });

  if (existingTemplates > 0) {
    console.log(`Templates already exist for tenant ${tenantId}. Found ${existingTemplates} templates.`);
    console.log('Skipping template creation.');
  } else {
    // Create templates
    const templates = await AssignmentTemplate.insertMany(
      defaultTemplates.map(template => ({
        ...template,
        tenantId: tenantId,
        createdBy: createdBy
      }))
    );

    console.log(`✅ Created ${templates.length} assignment templates for tenant: ${tenantId}`);
    console.log('Templates created:');
    templates.forEach(template => {
      console.log(`- ${template.title} (${template.type}) - ${template.questionCount} questions`);
    });
  }

} catch (error) {
  console.error('Error seeding templates:', error);
} finally {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}
