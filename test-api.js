import fetch from "node-fetch";

async function testSuggestMeal() {
  const response = await fetch("http://localhost:3000/api/suggest-meal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      budget: 100000,
      ingredients: "thịt gà, rau cải, cà chua",
      preference: "món xào",
    }),
  });

  const data = await response.json();
  console.log("Kết quả từ API:", data);
}

testSuggestMeal();
