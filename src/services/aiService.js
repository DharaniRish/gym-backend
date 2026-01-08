import OpenAI from "openai";
import User from "../models/User.js";
import ChatHistory from "../models/ChatHistory.js";

// ✅ Safe OpenAI initialization
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("✅ OpenAI initialized");
} else {
  console.warn("⚠️ OpenAI disabled (OPENAI_API_KEY not found)");
}

// -------------------- AI CHAT --------------------

export const getChatResponse = async (userId, userMessage) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let chatHistory = await ChatHistory.findOne({ user: userId });

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user: userId,
        messages: [],
        context: {
          userGoals: user.profile?.fitnessGoal || "general",
          currentWeight: user.profile?.weight || null,
          targetWeight: null,
          fitnessLevel: "beginner",
        },
      });
      await chatHistory.save();
    }

    // 🔴 If OpenAI is NOT enabled → return Smart Rule-Based Response
    if (!openai) {
      const ruleBasedResponse = getRuleBasedResponse(userMessage, user);

      chatHistory.messages.push(
        { role: "user", content: userMessage },
        { role: "assistant", content: ruleBasedResponse }
      );

      await chatHistory.save();
      return ruleBasedResponse;
    }

    // -------------------- REAL OPENAI FLOW --------------------

    const systemPrompt = `You are an AI-powered virtual gym trainer for GYMVERSE.

User:
- Name: ${user.name}
- Goal: ${user.profile?.fitnessGoal || "general fitness"}
- Height: ${user.profile?.height || "N/A"} cm
- Weight: ${user.profile?.weight || "N/A"} kg
- Level: ${user.gamification?.level || 1}

Be motivating, friendly, and safe.`;

    const recentMessages = chatHistory.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    chatHistory.messages.push({ role: "user", content: userMessage });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...recentMessages,
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0].message.content;

    chatHistory.messages.push({
      role: "assistant",
      content: assistantMessage,
    });

    await chatHistory.save();
    return assistantMessage;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error("Failed to get AI response");
  }
};

// -------------------- CHAT HISTORY --------------------

export const getChatHistory = async (userId) => {
  const chatHistory = await ChatHistory.findOne({ user: userId });
  return chatHistory?.messages || [];
};

// -------------------- RULE BASED LOGIC (FALLBACK) --------------------

const getRuleBasedResponse = (message, user) => {
  try {
    const msg = (message || "").toLowerCase();
    const name = (user?.name || "Friend").split(' ')[0];

    // 1. Greetings
    if (msg.match(/\b(hi|hello|hey|greetings)\b/)) {
      return `Hi ${name}! 👋 I'm your virtual trainer. How can I help you reach your ${user.profile?.fitnessGoal || 'fitness'} goals today?`;
    }

    // 2. Diet / Nutrition
    if (msg.match(/\b(diet|food|eat|meal|nutrition|protein|carbs)\b/)) {
      const goal = user.profile?.fitnessGoal || 'general';
      if (goal === 'fat_loss') {
        return `For **Fat Loss**, aim for a caloric deficit. \n- Prioritize protein (chicken, tofu, eggs) to save muscle.\n- Load up on veggies for volume.\n- Reduce processed sugars.\n\nWould you like me to generate a full diet plan? (Go to the Diet tab!)`;
      } else if (goal === 'muscle_gain') {
        return `For **Muscle Gain**, you need a surplus! \n- Eat 1.5g-2g of protein per kg of bodyweight.\n- Don't fear carbs (rice, oats, potatoes) – they fuel your lifts.\n- Eat every 3-4 hours.\n\nCheck the Diet tab to generate a high-protein plan! 🥩`;
      }
      return `Nutrition is key! Focus on whole foods: lean proteins, complex carbs, and healthy fats. Since your goal is **${goal.replace('_', ' ')}**, consistency is everything. Drink plenty of water! 💧`;
    }

    // 3. Workout / Exercise
    if (msg.match(/\b(workout|exercise|gym|train|lift|cardio|running)\b/)) {
      const level = user.gamification?.level || 1;
      if (level < 5) {
        return `Since you're starting out (Level ${level}), focus on form first! \n- Try full-body workouts 3x a week.\n- Key moves: Squats, Pushups, Lunges, Rows.\n- Don't forget 5-10 mins warm-up! 🏃‍♂️`;
      }
      return `Ready to crush it? At Level ${level}, you can increase intensity!\n- Try a Push/Pull/Legs split.\n- Focus on progressive overload (add weight/reps each week).\n- Recovery is when you grow, so sleep 7-8 hours! 🛌`;
    }

    // 4. Motivation
    if (msg.match(/\b(tired|give up|hard|motivat|lazy|quit)\b/)) {
      return `_"The only bad workout is the one that didn't happen."_\n\nYou're doing this for a reason, ${name}. Even 10 minutes is better than nothing. Get up, drink some water, and just move! You got this! 💪🔥`;
    }

    // 5. Stats
    if (msg.match(/\b(weight|height|stats|profile|level|points)\b/)) {
      const weight = user.profile?.weight ? `${user.profile.weight} kg` : "Not set (Go to Profile to update) ❌";
      const bmi = user.profile?.bmi || "N/A";

      let reply = `Here are your stats, ${name}: \n- **Level**: ${user.gamification?.level || 1}\n- **Points**: ${user.gamification?.points || 0}\n- **Weight**: ${weight}\n- **BMI**: ${bmi}\n`;

      if (!user.profile?.weight) {
        reply += `\n⚠️ **Wait!** I don't know your weight yet. Please go to the **Profile Page** and update it so I can give you better advice!`;
      } else {
        reply += `\nKeep grinding! 📈`;
      }
      return reply;
    }

    // Default
    return `I'm still learning! 🧠 but here is what I can help with:\n- **Diet tips** ("What should I eat?")\n- **Workout advice** ("Best beginner workout?")\n- **Motivation** ("I'm tired")\n- **Your stats** ("Show my level")\n\n(Note: Full AI is currently offline, operating in offline mode).`;
  } catch (error) {
    console.error("RuleBasedResponse Error:", error);
    return "I'm here to help with your fitness journey! Ask me about diets, workouts, or your stats.";
  }
};
