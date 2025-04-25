const apiKey = "cf0361ea7388aa30f8cf5d97963e2015";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weather-icon");

searchBtn.addEventListener("click", fetchWeatherByInput);

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWeatherByInput();
    }
});

function fetchWeatherByInput() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError("Por favor, digite uma cidade!");
    }
}

async function fetchWeather(city) {
    try {
        cityName.textContent = "Carregando...";
        weatherIcon.className = "fas fa-spinner fa-spin";
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`
        );
        
        if (!response.ok) {
            throw new Error(response.status === 404 ? "Cidade não encontrada" : "Erro na requisição");
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        showError(error.message);
        resetDisplay();
    }
}

function displayWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed.toFixed(1)}`;
    
    updateWeatherIcon(data.weather[0].main);
}

function updateWeatherIcon(weatherCondition) {
    const iconMap = {
        "Clear": "fa-sun",
        "Clouds": "fa-cloud",
        "Rain": "fa-cloud-rain",
        "Drizzle": "fa-cloud-rain",
        "Thunderstorm": "fa-bolt",
        "Snow": "fa-snowflake",
        "Mist": "fa-smog",
        "Smoke": "fa-smog",
        "Haze": "fa-smog",
        "Fog": "fa-smog"
    };
    
    weatherIcon.className = `fas ${iconMap[weatherCondition] || "fa-cloud"} weather-icon`;
}

function showError(message) {
    alert(message);
}

function resetDisplay() {
    cityName.textContent = "--";
    temperature.textContent = "--°C";
    description.textContent = "--";
    humidity.textContent = "--%";
    wind.textContent = "--";
    weatherIcon.className = "fas fa-question";
    cityInput.value = "";
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather("São Paulo");

    async function fetchWeather(city) {
        try {
            cityName.textContent = "Carregando...";
            weatherIcon.className = "fas fa-spinner fa-spin";
            
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}&lang=pt_br`
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro na API");
            }
    
            const data = await response.json();
            displayWeather(data);
            
        } catch (error) {
            console.error("Erro detalhado:", error);
            showError(error.message);
            resetDisplay();
        }
    }
});