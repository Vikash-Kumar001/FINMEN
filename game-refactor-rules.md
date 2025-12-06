





# Game Refactoring Master Rules & Workflow

**Objective:** Standardize all Student games (HealthMale, HealthFemale, CRGC, EHE) for both Kids and Teens to align strictly with the layout, styling, logic, and reward structure of the **Finance** games.

## 1. General Workflow
1.  **Batch Processing:** Refactor games in sets of **10** at a time.
2.  **Source of Truth:** Always refer to `Student/Finance/Kids` (or Teens) games for the "Gold Standard" of implementation.
3.  **Registry Check:** Check the category's `index.js` (e.g., `HealthMale/Kids/index.js`) to identify the next 10 games and their import names.

## 2. Core Game Rules (Non-Negotiable)

### A. Structure & Logic
*   **5 Questions Per Game:** Every game MUST have exactly **5** questions, rounds, or tasks.
*   **No Random Shuffling:** Do **NOT** use `Math.random()` or shuffling functions to randomize options at runtime.
*   **Hardcoded Variance:** Manually arrange the correct options in the `questions` array so the position varies (e.g., Q1: Option A, Q2: Option C, Q3: Option B...). This prevents pattern recognition while ensuring predictable rendering.
*   **Navigation:**
    *   Use `useNavigate` from `react-router-dom`.
    *   On game completion (after the 5th question/result screen), navigate back to the menu (e.g., `/games/health-male/kids`).

### B. Reward System
All games must strictly follow this reward calculation:
*   **Coins Per Level/Question:** `1` (Hardcoded)
*   **Total Coins:** `5` (1 coin × 5 questions)
*   **Total XP:** `10` (Fixed per game)
*   **Max Score:** `5`

**Code Implementation:**
```javascript
// Inside component
const coinsPerLevel = 1;
const totalCoins = 5;
const totalXp = 10;

// In GameShell props
<GameShell
  coinsPerLevel={coinsPerLevel}
  totalCoins={totalCoins}
  totalXp={totalXp}
  maxScore={5}
  // ... other props
/>
```

### C. Styling Standards (Finance Style)
*   **Container:** Use `GameShell` as the wrapper.
*   **Inner Cards:** Use `bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20`.
*   **Typography:** White text (`text-white`), bold headers (`font-bold`), clear hierarchy.
*   **Buttons:**
    *   **Standard Option:** `bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700`
    *   **Correct State:** `bg-green-500` or `ring-4 ring-yellow-400` (depending on game type).
    *   **Action Button:** `bg-gradient-to-r from-green-500 to-emerald-600`.
*   **Icons:** Use Emojis or `lucide-react` icons (e.g., `Shield`, `Star`, `Award`).

## 3. Specific Game Type Implementations

### Type A: Standard Quiz / Story
*   **Reference:** `Finance/Kids/ATMStory.jsx`
*   **Flow:** Question -> Select Option -> Feedback (Confetti/Flash) -> Delay -> Next Question.
*   **State:** `currentQuestion` (0-4), `score`, `showResult`.

### Type B: Reflex Games
*   **Reference:** `Finance/Kids/ReflexBank.jsx`
*   **Features:**
    *   **Start Screen:** "Get Ready" overlay with a "Start Game" button.
    *   **Timer:** **5-second** countdown per question.
    *   **Timer Logic:** Must reset on every round. Add `currentRound` to `useEffect` dependency to fix timer bugs.
    *   **Rounds:** 5 Rounds.
    *   **Scoring:** +1 Coin for correct answer within time.

### Type C: Poster Games
*   **Reference:** `Finance/Kids/PosterSavingHabit.jsx`
*   **Flow:** "Which poster shows [concept]?"
*   **UI:** Grid of 3 poster cards (Emoji + Title + Description).
*   **Feedback:** Show specific "Correct/Incorrect" feedback screen with an explanation before moving to next.

### Type D: Badge Games
*   **Reference:** `Finance/Kids/BadgeSaverKid.jsx`
*   **Flow:** Answer 5 questions to "earn" the badge.
*   **UI:** Use large Icons (`lucide-react`) for each level/question.
*   **Completion:** Show a "Badge Earned" screen with the final score.

## 4. Step-by-Step Refactoring Checklist

1.  **Identify Game:** Open the file (e.g., `FruitVsCandyStory.jsx`).
2.  **Check Type:** Is it a Story, Reflex, Puzzle, or Poster game?
3.  **Copy Template:** Open the corresponding **Finance** game file to see the structure.
4.  **Update Imports:**
    *   `import GameShell from "../../Finance/GameShell";`
    *   `import useGameFeedback from "../../../../hooks/useGameFeedback";`
    *   `import { getGameDataById } from "../../../../utils/getGameData";`
5.  **Hardcode Data:**
    *   Set `gameId` (check `index.js` or use sequential ID).
    *   Set Rewards (1 coin/q, 5 total, 10 XP).
6.  **Refactor Questions:**
    *   Ensure 5 questions.
    *   Hardcode options (remove `Math.random()`).
    *   Ensure varying correct positions.
7.  **Implement Logic:**
    *   `handleAnswer`: Update score, show feedback (`showCorrectAnswerFeedback(1, true)`), set timeout for next.
    *   `handleNext`: Navigate to menu if finished.
8.  **Apply Styling:** Wrap in `GameShell` and apply Tailwind classes.
9.  **Verify Timer (Reflex only):** Ensure `useEffect` depends on `currentRound`.
10. **Remove the unused variable in new refactore code mostly gameData and location** First check if there is being used or not if not then remove it

## 5. Common Pitfalls to Avoid
*   **Forgot `currentRound` dependency:** Causes timer to stop working after Q1 in Reflex games.
*   **Wrong `gameId`:** Prevents the *next* game from unlocking.
*   **Shuffling Options:** Breaks the "hardcoded variance" rule.
*   **Missing Navigation:** User gets stuck on the "Game Over" screen.


also make option styling universal same in most of the que
bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600