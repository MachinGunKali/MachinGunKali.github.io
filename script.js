async function fetchWeather(city) {
  const apiKey = "a2ede6fd8728eb85ef0a8d0ecbb6cca7";
  const url = `https://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
  const resultElement = document.getElementById("weatherResult");
  const clothingCard = document.getElementById("clothingCard");

  if (resultElement) {
    resultElement.innerHTML = `<p class="loading">Chargement...</p>`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log(data); // Debugging: voir la réponse de l'API
    if (data.error) {
      resultElement.innerHTML = `<p class="error">${data.error.info}</p>`;
      return;
    }

    const { location, current } = data;
    const temperature = current.temperature;
    const condition = current.weather_descriptions[0];
    const icon = current.weather_icons[0];

    const season = determineSeason(location.localtime);
    const seasonElement = document.getElementById("season");
    if (seasonElement) {
      seasonElement.textContent = season;
    }
    suggestClothing(season, temperature, condition);

    resultElement.innerHTML = `
      <div class="weather-card">
        <h2>Météo à ${location.name}, ${location.country}</h2>
        <img src="${icon}" alt="Icône météo">
        <p><strong>Température :</strong> ${temperature}°C</p>
        <p><strong>Conditions :</strong> ${condition}</p>
        <p><strong>Vent :</strong> ${current.wind_speed} km/h</p>
        <p><strong>Humidité :</strong> ${current.humidity}%</p>
      </div>
    `;

    if (clothingCard) {
      clothingCard.style.display = "block";
    }
  } catch (error) {
    if (resultElement) {
      resultElement.innerHTML = `<p class="error">Erreur : ${error.message}</p>`;
    }
  }
}

document.getElementById("getWeather")?.addEventListener("click", () => {
  const city = document.getElementById("city")?.value.trim();
  if (city) fetchWeather(city);
});

function determineSeason(dateString) {
  const month = new Date(dateString).getMonth() + 1;
  if (month >= 3 && month <= 5) return "Printemps";
  if (month >= 6 && month <= 8) return "Été";
  if (month >= 9 && month <= 11) return "Automne";
  return "Hiver";
}

function suggestClothing(season, temperature, condition) {
  const clothingList = document.getElementById("clothingList");
  if (!clothingList) return;
  clothingList.innerHTML = "";
  let suggestions = [];

  if (temperature < 5) {
    suggestions = ["Manteau chaud", "Écharpe", "Gants", "Bonnet"];
  } else if (temperature < 15) {
    suggestions = ["Veste légère", "Pull", "Jean"];
  } else if (temperature < 25) {
    suggestions = ["T-shirt", "Pantalon léger", "Baskets"];
  } else {
    suggestions = ["Short", "Débardeur", "Lunettes de soleil"];
  }

  if (condition.toLowerCase().includes("rain")) {
    suggestions.push("Imperméable", "Bottes de pluie");
  } else if (condition.toLowerCase().includes("snow")) {
    suggestions.push("Bottes fourrées", "Parka");
  }

  suggestions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    clothingList.appendChild(li);
  });
}
