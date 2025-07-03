// import { OpenAI } from 'openai'; // If using the openai SDK (npm install openai)

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export const generateCBTReply = async (userMessage) => {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4",
//     messages: [
//       {
//         role: "system",
//         content: "You are a CBT therapist chatbot helping Indian students aged 8–25. Respond with empathy, positive CBT techniques, and age-appropriate guidance.",
//       },
//       {
//         role: "user",
//         content: userMessage,
//       },
//     ],
//     temperature: 0.7,
//   });

//   return response.choices[0].message.content;
// };


import { OpenAI } from 'openai'; // If using the openai SDK (npm install openai)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateCBTReply = async (userMessage) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a CBT therapist chatbot helping Indian students aged 8–25. Respond with empathy, positive CBT techniques, and age-appropriate guidance.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};
