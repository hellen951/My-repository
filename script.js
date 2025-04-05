// Sample recipe data
const recipes = [
    {
        id: 1,
        title: "Rice Beef Stir Fry",
        image: "images/rice-beef.jpg",
        category: "quick",
        time: "25 mins",
        servings: 4,
        calories: 420,
        ingredients: [
            "2 cups cooked rice",
            "1 cup thinly sliced beef",
            "1 onion, diced",
            "2 cloves garlic, minced",
            "1 cup frozen peas and carrots",
            "2 tbsp vegetable oil",
            "3 tbsp soy sauce"
        ],
        instructions: [
            "Heat oil in a large skillet over medium-high heat",
            "Sauté onions and garlic until translucent",
            "Add beef and cook until browned (3-4 mins)",
            "Stir in frozen peas and carrots (2-3 mins)",
            "Add cooked rice and sauces, stir to coat",
            "Cook 2-3 more minutes until heated through"
        ]
    },
    {
        id: 2,
        title: "Persian Rice",
        image: "images/persian-rice.jpg",
        category: "healthy",
        time: "1 hour",
        servings: 6,
        calories: 380,
        ingredients: [
            "2 cups basmati rice",
            "3 tbsp kosher salt",
            "2 tbsp olive oil",
            "1 russet potato (¼-inch slices)",
            "1 pinch ground cumin",
            "3 tbsp butter",
            "1 pinch saffron threads"
        ],
        instructions: [
            "Boil water with salt. Add rice; cook 7 minutes. Drain",
            "Heat oil, layer potatoes in pot. Sprinkle cumin/salt",
            "Cook potatoes 2-3 mins until sizzling",
            "Add rice layer, then butter slices",
            "Cover with paper towels and lid. Steam 45 mins"
        ]
    }
];

// Days for meal planner
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize meal planner
    initMealPlanner();
    
    // Load recipes
    loadRecipes();
    
    // Filter functionality
    setupFilters();
});

function initMealPlanner() {
    const planningGrid = document.querySelector('.planning-grid');
    
    days.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.dataset.day = day.toLowerCase();
        
        dayCard.innerHTML = `
            <h4>${day}</h4>
            <p class="planned-meal">No meal planned</p>
        `;
        
        dayCard.addEventListener('click', function() {
            document.querySelectorAll('.day-card').forEach(card => {
                card.classList.remove('selected');
            });
            this.classList.add('selected');
        });
        
        planningGrid.appendChild(dayCard);
    });
    
    // Load saved meal plan
    const mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
    Object.entries(mealPlan).forEach(([day, recipe]) => {
        const dayCard = document.querySelector(`.day-card[data-day="${day}"]`);
        if (dayCard) {
            dayCard.querySelector('.planned-meal').textContent = recipe;
        }
    });
}

function loadRecipes(filter = 'all') {
    const recipeContainer = document.querySelector('.recipe-cards');
    recipeContainer.innerHTML = '';
    
    const filteredRecipes = filter === 'all' 
        ? recipes 
        : recipes.filter(recipe => recipe.category === filter);
    
    filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.dataset.id = recipe.id;
        
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                    <span><i class="fas fa-fire"></i> ${recipe.calories} cal</span>
                    <span><i class="fas fa-users"></i> ${recipe.servings}</span>
                </div>
                <button class="btn add-to-plan">Add to Meal Plan</button>
            </div>
        `;
        
        // Add event listener for planning
        recipeCard.querySelector('.add-to-plan').addEventListener('click', function() {
            addToMealPlan(recipe.id);
        });
        
        recipeContainer.appendChild(recipeCard);
    });
}

function addToMealPlan(recipeId) {
    const selectedDay = document.querySelector('.day-card.selected');
    if (!selectedDay) {
        alert('Please select a day first!');
        return;
    }
    
    const recipe = recipes.find(r => r.id === recipeId);
    const day = selectedDay.dataset.day;
    
    selectedDay.querySelector('.planned-meal').textContent = recipe.title;
    
    // Save to localStorage
    const mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
    mealPlan[day] = recipe.title;
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    
    alert(`${recipe.title} added to ${day.charAt(0).toUpperCase() + day.slice(1)}!`);
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadRecipes(this.dataset.filter);
        });
    });
}