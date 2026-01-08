// Meal database based on preferences and goals
const mealDatabase = {
  fat_loss: {
    vegetarian: {
      low: {
        breakfast: [
          { name: 'Oatmeal with Berries', items: ['Oatmeal (50g)', 'Blueberries (50g)', 'Almonds (10g)'], calories: 250, protein: 8, carbs: 45, fats: 5 },
          { name: 'Greek Yogurt Bowl', items: ['Greek Yogurt (150g)', 'Strawberries (100g)', 'Chia Seeds (10g)'], calories: 220, protein: 15, carbs: 25, fats: 6 },
        ],
        lunch: [
          { name: 'Quinoa Salad', items: ['Quinoa (100g)', 'Mixed Vegetables', 'Olive Oil (1 tsp)'], calories: 320, protein: 12, carbs: 50, fats: 8 },
          { name: 'Lentil Soup', items: ['Lentils (150g)', 'Vegetables', 'Whole Grain Bread (1 slice)'], calories: 350, protein: 18, carbs: 55, fats: 6 },
        ],
        dinner: [
          { name: 'Grilled Tofu with Vegetables', items: ['Tofu (150g)', 'Broccoli', 'Brown Rice (80g)'], calories: 380, protein: 25, carbs: 45, fats: 10 },
          { name: 'Chickpea Curry', items: ['Chickpeas (150g)', 'Tomatoes', 'Brown Rice (80g)'], calories: 400, protein: 20, carbs: 60, fats: 8 },
        ],
        snacks: [
          { name: 'Apple with Peanut Butter', items: ['Apple (1 medium)', 'Peanut Butter (1 tbsp)'], calories: 180, protein: 4, carbs: 25, fats: 8 },
          { name: 'Carrot Sticks with Hummus', items: ['Carrots (100g)', 'Hummus (50g)'], calories: 150, protein: 5, carbs: 20, fats: 6 },
        ],
      },
      medium: {
        breakfast: [
          { name: 'Avocado Toast', items: ['Whole Grain Bread (2 slices)', 'Avocado (1/2)', 'Eggs (2)'], calories: 380, protein: 18, carbs: 35, fats: 18 },
        ],
        lunch: [
          { name: 'Falafel Wrap', items: ['Falafel (4 pieces)', 'Whole Wheat Wrap', 'Tahini', 'Vegetables'], calories: 450, protein: 15, carbs: 55, fats: 18 },
        ],
        dinner: [
          { name: 'Paneer Tikka with Quinoa', items: ['Paneer (150g)', 'Quinoa (100g)', 'Vegetables'], calories: 480, protein: 28, carbs: 50, fats: 15 },
        ],
        snacks: [
          { name: 'Protein Smoothie', items: ['Plant Protein (30g)', 'Banana', 'Almond Milk'], calories: 250, protein: 25, carbs: 30, fats: 5 },
        ],
      },
      high: {
        breakfast: [
          { name: 'Acai Bowl', items: ['Acai (200g)', 'Granola (50g)', 'Berries', 'Nuts'], calories: 420, protein: 12, carbs: 60, fats: 15 },
        ],
        lunch: [
          { name: 'Tempeh Buddha Bowl', items: ['Tempeh (150g)', 'Quinoa', 'Avocado', 'Vegetables'], calories: 520, protein: 30, carbs: 55, fats: 20 },
        ],
        dinner: [
          { name: 'Mushroom Risotto', items: ['Arborio Rice (120g)', 'Mushrooms', 'Parmesan', 'Vegetables'], calories: 480, protein: 15, carbs: 65, fats: 12 },
        ],
        snacks: [
          { name: 'Trail Mix', items: ['Nuts (30g)', 'Dried Fruits', 'Dark Chocolate'], calories: 200, protein: 6, carbs: 20, fats: 12 },
        ],
      },
    },
    non_vegetarian: {
      low: {
        breakfast: [
          { name: 'Scrambled Eggs', items: ['Eggs (2)', 'Whole Grain Toast (1 slice)', 'Spinach'], calories: 280, protein: 18, carbs: 25, fats: 10 },
        ],
        lunch: [
          { name: 'Grilled Chicken Salad', items: ['Chicken Breast (150g)', 'Mixed Greens', 'Olive Oil Dressing'], calories: 350, protein: 35, carbs: 15, fats: 12 },
        ],
        dinner: [
          { name: 'Baked Fish with Vegetables', items: ['White Fish (150g)', 'Broccoli', 'Sweet Potato (100g)'], calories: 380, protein: 32, carbs: 40, fats: 8 },
        ],
        snacks: [
          { name: 'Greek Yogurt', items: ['Greek Yogurt (150g)', 'Berries'], calories: 150, protein: 15, carbs: 15, fats: 3 },
        ],
      },
      medium: {
        breakfast: [
          { name: 'Protein Pancakes', items: ['Protein Powder (30g)', 'Oats', 'Eggs', 'Berries'], calories: 400, protein: 35, carbs: 40, fats: 12 },
        ],
        lunch: [
          { name: 'Turkey Wrap', items: ['Turkey (120g)', 'Whole Wheat Wrap', 'Vegetables', 'Hummus'], calories: 420, protein: 30, carbs: 45, fats: 12 },
        ],
        dinner: [
          { name: 'Grilled Salmon with Quinoa', items: ['Salmon (150g)', 'Quinoa (100g)', 'Asparagus'], calories: 480, protein: 38, carbs: 45, fats: 18 },
        ],
        snacks: [
          { name: 'Protein Bar', items: ['Protein Bar (1)'], calories: 200, protein: 20, carbs: 20, fats: 6 },
        ],
      },
      high: {
        breakfast: [
          { name: 'Steak and Eggs', items: ['Lean Steak (100g)', 'Eggs (2)', 'Whole Grain Toast'], calories: 450, protein: 40, carbs: 30, fats: 18 },
        ],
        lunch: [
          { name: 'Chicken Burrito Bowl', items: ['Chicken (150g)', 'Brown Rice', 'Beans', 'Avocado'], calories: 520, protein: 42, carbs: 55, fats: 15 },
        ],
        dinner: [
          { name: 'Ribeye with Sweet Potato', items: ['Ribeye (200g)', 'Sweet Potato', 'Green Beans'], calories: 580, protein: 45, carbs: 50, fats: 22 },
        ],
        snacks: [
          { name: 'Beef Jerky', items: ['Beef Jerky (50g)'], calories: 180, protein: 25, carbs: 5, fats: 6 },
        ],
      },
    },
  },
  muscle_gain: {
    vegetarian: {
      low: {
        breakfast: [
          { name: 'Protein Oatmeal', items: ['Oats (80g)', 'Protein Powder (30g)', 'Banana', 'Nuts'], calories: 520, protein: 35, carbs: 65, fats: 12 },
        ],
        lunch: [
          { name: 'Lentil Curry with Rice', items: ['Lentils (200g)', 'Brown Rice (150g)', 'Vegetables'], calories: 580, protein: 28, carbs: 95, fats: 8 },
        ],
        dinner: [
          { name: 'Tofu Stir Fry', items: ['Tofu (200g)', 'Quinoa (120g)', 'Vegetables', 'Sesame Oil'], calories: 550, protein: 32, carbs: 70, fats: 15 },
        ],
        snacks: [
          { name: 'Protein Smoothie', items: ['Plant Protein (40g)', 'Banana', 'Oats', 'Almond Milk'], calories: 380, protein: 35, carbs: 50, fats: 8 },
        ],
      },
      medium: {
        breakfast: [
          { name: 'High Protein Pancakes', items: ['Protein Powder (40g)', 'Oats', 'Eggs', 'Greek Yogurt'], calories: 580, protein: 45, carbs: 55, fats: 15 },
        ],
        lunch: [
          { name: 'Paneer Tikka Bowl', items: ['Paneer (200g)', 'Quinoa (150g)', 'Vegetables'], calories: 650, protein: 42, carbs: 75, fats: 18 },
        ],
        dinner: [
          { name: 'Tempeh with Pasta', items: ['Tempeh (200g)', 'Whole Wheat Pasta (150g)', 'Vegetables'], calories: 680, protein: 40, carbs: 85, fats: 20 },
        ],
        snacks: [
          { name: 'Protein Bar + Nuts', items: ['Protein Bar', 'Almonds (30g)'], calories: 350, protein: 25, carbs: 30, fats: 15 },
        ],
      },
      high: {
        breakfast: [
          { name: 'Acai Bowl with Protein', items: ['Acai (250g)', 'Protein Powder (40g)', 'Granola', 'Nuts'], calories: 620, protein: 38, carbs: 75, fats: 18 },
        ],
        lunch: [
          { name: 'Seitan Steak with Potatoes', items: ['Seitan (250g)', 'Potatoes (200g)', 'Vegetables'], calories: 720, protein: 50, carbs: 90, fats: 15 },
        ],
        dinner: [
          { name: 'High Protein Pasta', items: ['Lentil Pasta (200g)', 'Tofu (150g)', 'Vegetables', 'Olive Oil'], calories: 680, protein: 45, carbs: 95, fats: 18 },
        ],
        snacks: [
          { name: 'Trail Mix + Protein Shake', items: ['Trail Mix (50g)', 'Protein Shake (40g)'], calories: 450, protein: 35, carbs: 40, fats: 20 },
        ],
      },
    },
    non_vegetarian: {
      low: {
        breakfast: [
          { name: 'High Protein Breakfast', items: ['Eggs (4)', 'Whole Grain Toast (2 slices)', 'Greek Yogurt'], calories: 520, protein: 42, carbs: 40, fats: 18 },
        ],
        lunch: [
          { name: 'Chicken and Rice', items: ['Chicken Breast (200g)', 'Brown Rice (150g)', 'Vegetables'], calories: 620, protein: 50, carbs: 75, fats: 12 },
        ],
        dinner: [
          { name: 'Salmon with Sweet Potato', items: ['Salmon (200g)', 'Sweet Potato (200g)', 'Broccoli'], calories: 580, protein: 45, carbs: 70, fats: 15 },
        ],
        snacks: [
          { name: 'Protein Shake', items: ['Whey Protein (40g)', 'Banana', 'Milk'], calories: 380, protein: 35, carbs: 45, fats: 8 },
        ],
      },
      medium: {
        breakfast: [
          { name: 'Steak and Eggs', items: ['Lean Steak (150g)', 'Eggs (3)', 'Toast', 'Avocado'], calories: 680, protein: 55, carbs: 45, fats: 25 },
        ],
        lunch: [
          { name: 'Turkey and Quinoa Bowl', items: ['Turkey (200g)', 'Quinoa (150g)', 'Vegetables', 'Nuts'], calories: 650, protein: 52, carbs: 70, fats: 18 },
        ],
        dinner: [
          { name: 'Ribeye with Potatoes', items: ['Ribeye (250g)', 'Potatoes (200g)', 'Vegetables'], calories: 780, protein: 58, carbs: 75, fats: 28 },
        ],
        snacks: [
          { name: 'Protein Bar + Greek Yogurt', items: ['Protein Bar', 'Greek Yogurt (200g)'], calories: 420, protein: 40, carbs: 35, fats: 12 },
        ],
      },
      high: {
        breakfast: [
          { name: 'High Calorie Breakfast', items: ['Eggs (5)', 'Bacon (4 slices)', 'Toast (2)', 'Butter'], calories: 750, protein: 48, carbs: 50, fats: 35 },
        ],
        lunch: [
          { name: 'Beef and Rice Bowl', items: ['Ground Beef (250g)', 'Brown Rice (200g)', 'Vegetables', 'Cheese'], calories: 850, protein: 60, carbs: 90, fats: 25 },
        ],
        dinner: [
          { name: 'Large Steak Dinner', items: ['Ribeye (300g)', 'Potatoes (250g)', 'Vegetables', 'Butter'], calories: 920, protein: 65, carbs: 85, fats: 35 },
        ],
        snacks: [
          { name: 'Mass Gainer Shake', items: ['Mass Gainer (60g)', 'Banana', 'Peanut Butter', 'Milk'], calories: 650, protein: 45, carbs: 85, fats: 18 },
        ],
      },
    },
  },
};

const calculateMacros = (goal, weight, height, age, gender = 'male') => {
  // BMR calculation (Mifflin-St Jeor Equation)
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // TDEE (assuming moderate activity)
  const tdee = bmr * 1.55;

  let targetCalories, targetProtein, targetCarbs, targetFats;

  if (goal === 'fat_loss') {
    targetCalories = Math.round(tdee * 0.8); // 20% deficit
    targetProtein = Math.round(weight * 2.2); // 2.2g per kg
    targetFats = Math.round(targetCalories * 0.25 / 9); // 25% of calories
    targetCarbs = Math.round((targetCalories - (targetProtein * 4) - (targetFats * 9)) / 4);
  } else if (goal === 'muscle_gain') {
    targetCalories = Math.round(tdee * 1.15); // 15% surplus
    targetProtein = Math.round(weight * 2.5); // 2.5g per kg
    targetFats = Math.round(targetCalories * 0.25 / 9); // 25% of calories
    targetCarbs = Math.round((targetCalories - (targetProtein * 4) - (targetFats * 9)) / 4);
  } else {
    targetCalories = Math.round(tdee);
    targetProtein = Math.round(weight * 1.8);
    targetFats = Math.round(targetCalories * 0.25 / 9);
    targetCarbs = Math.round((targetCalories - (targetProtein * 4) - (targetFats * 9)) / 4);
  }

  return { targetCalories, targetProtein, targetCarbs, targetFats };
};

export const generateDietPlan = (goal, preference, budget, weight, height, age, gender = 'male', duration = 7) => {
  const macros = calculateMacros(goal, weight, height, age, gender);
  const meals = mealDatabase[goal]?.[preference]?.[budget];

  if (!meals) {
    throw new Error('Invalid diet parameters');
  }

  const dailyMeals = [];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

  for (let day = 0; day < duration; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);

    const dailyMeal = {
      date,
      breakfast: meals.breakfast[day % meals.breakfast.length],
      lunch: meals.lunch[day % meals.lunch.length],
      dinner: meals.dinner[day % meals.dinner.length],
      snacks: meals.snacks.slice(0, 2), // 2 snacks per day
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
    };

    // Calculate totals
    dailyMeal.totalCalories = dailyMeal.breakfast.calories + 
                              dailyMeal.lunch.calories + 
                              dailyMeal.dinner.calories + 
                              dailyMeal.snacks.reduce((sum, snack) => sum + snack.calories, 0);

    dailyMeal.totalProtein = dailyMeal.breakfast.protein + 
                             dailyMeal.lunch.protein + 
                             dailyMeal.dinner.protein + 
                             dailyMeal.snacks.reduce((sum, snack) => sum + snack.protein, 0);

    dailyMeal.totalCarbs = dailyMeal.breakfast.carbs + 
                           dailyMeal.lunch.carbs + 
                           dailyMeal.dinner.carbs + 
                           dailyMeal.snacks.reduce((sum, snack) => sum + snack.carbs, 0);

    dailyMeal.totalFats = dailyMeal.breakfast.fats + 
                          dailyMeal.lunch.fats + 
                          dailyMeal.dinner.fats + 
                          dailyMeal.snacks.reduce((sum, snack) => sum + snack.fats, 0);

    dailyMeals.push(dailyMeal);
  }

  return {
    goal,
    preference,
    budget,
    dailyMeals,
    duration,
    ...macros,
  };
};






