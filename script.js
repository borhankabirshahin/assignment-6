//  Selectors
const categoryContainer = document.getElementById("category-container");
const plantsContainer = document.getElementById("plant-container");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

//  Utility Functions
const showLoading = (container) => {
  container.innerHTML = `
    <div class="flex justify-center py-10 w-full col-span-3">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  `;
};

const setActiveButton = (activeBtn) => {
  const allBtns = categoryContainer.querySelectorAll("button");
  allBtns.forEach((btn) => btn.classList.remove("bg-green-600", "text-white"));
  activeBtn.classList.add("bg-green-600", "text-white");
};

//  Load Categories
const loadCategories = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/categories"
    );
    const data = await res.json();

    displayCategories(data.categories);
  } catch (error) {
    console.log("Error loading categories:", error);
  }
};

const displayCategories = (categories) => {
  categoryContainer.innerHTML = "";

  // All Plants button
  const allBtn = document.createElement("button");
  allBtn.className =
    "w-full bg-green-100 text-black font-semibold py-2 px-4 rounded-lg hover:bg-green-200";
  allBtn.innerText = "All Plants";
  allBtn.addEventListener("click", () => {
    setActiveButton(allBtn);
    loadPlants();
  });
  categoryContainer.appendChild(allBtn);

  // Individual categories
  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.className =
      "w-full bg-green-100 text-black font-semibold py-2 px-4 rounded-lg hover:bg-green-200";
    button.innerText = cat.category_name;

    button.addEventListener("click", () => {
      setActiveButton(button);
      loadCategoryPlants(cat.id);
    });

    categoryContainer.appendChild(button);
  });
};

// Load All Plants
const loadPlants = async () => {
  showLoading(plantsContainer);
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();

    displayPlants(data.plants);
  } catch (error) {
    console.log("Error loading all plants:", error);
  }
};

//  Load Plants by Category
const loadCategoryPlants = async (id) => {
  showLoading(plantsContainer);
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/category/${id}`
    );
    const data = await res.json();

    displayPlants(data.plants);
  } catch (error) {
    console.log("Error loading category plants:", error);
  }
};

//  Display Plants
const displayPlants = (plants) => {
  plantsContainer.innerHTML = "";

  if (!plants || plants.length === 0) {
    plantsContainer.innerHTML =
      "<p class='col-span-3 text-center text-red-500 font-bold'>No plants found.</p>";
    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className = "rounded-lg p-4 shadow bg-white";

    card.innerHTML = `
      <img src="${plant.image}" alt="${
      plant.name
    }" class="h-40 w-full object-cover rounded-lg mb-3">
      <h2 class="text-xl font-semibold text-black cursor-pointer hover:text-green-500"
          onclick="loadPlantDetails(${plant.id})">${plant.name}</h2>
      <p class="text-sm opacity-70">${
        plant.description ? plant.description.slice(0, 55) : "No description"
      }...</p>
     <div class="flex justify-between items-center">
      <p class="mt-2 font-medium text-[14px] px-3 py-1 text-[#15803D] bg-[#DCFCE7] rounded-xl"> ${
        plant.category || "Unknown"
      }</p>
      <p class="mt-1 font-semibold"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${
        plant.price || 0
      }</p>
     </div>
      <button class="mt-3 w-full bg-[#15803D] cursor-pointer text-white rounded-full py-2 font-semibold"
              onclick="addToCart('${plant.name}', ${
      plant.price
    })">Add to Cart</button>
    `;

    plantsContainer.appendChild(card);
  });
};

// Modal (Plant Details)
const loadPlantDetails = async (id) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/plant/${id}`
    );
    const data = await res.json();

    alert(
      `Name: ${data.plant.name}\nCategory: ${data.plant.category}\nPrice: $${data.plant.price}\nDescription: ${data.plant.description}`
    );
  } catch (error) {
    console.log("Error loading plant details:", error);
  }
};

//  Cart Functions
let cart = [];
const addToCart = (name, price) => {
  cart.push({ name, price });
  updateCart();
};

const removeFromCart = (index) => {
  cart.splice(index, 1);
  updateCart();
};

const updateCart = () => {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "flex justify-between border-b py-1 px-1";
    li.innerHTML = `${item.name} <span>$${item.price}</span> <button onclick="removeFromCart(${index})" class="text-red-500 font-bold">❌</button>`;
    cartList.appendChild(li);
  });

  cartTotal.innerText = `$${total}`;
};

loadCategories();
loadPlants();
