
console.log("script working");
document.getElementById("weatherInput").value = "Bhiwandi"; // Remove this line after css work

const APIURL = "https://api.weatherapi.com/v1/current.json?key=7ea64d87650b4ecfbe061544242711&q=";

function searchWeather() {

    const inputVal = document.getElementById("weatherInput").value;
    console.log("input value", inputVal);

    console.log("APIURL is", APIURL);

    const newAPIURL = APIURL + inputVal

    console.log("NEw APIURL is", newAPIURL);

    fetch(newAPIURL).then(response => response.json()).then(data => {
        console.log(data);

        DisplayWeather(data);

    })
}

// searchWeather();
function DisplayWeather(data) {
    console.log("data", data);
    document.getElementById("weatherSection").style.display = "block"

    // const displayWeather = document.getElementById("displayWeather");
    // displayWeather.innerHTML = `
    // <h1> ${data.location.name}</h1>
    // <p> Temprature - ${data.current.temp_c}</p>
    // `


    document.getElementById("location-name").innerHTML = data.location.name;
    document.getElementById("temprature").innerHTML = data.current.temp_c + `<sup>0</sup>` + ' C';
    document.getElementById("wind-speed").innerHTML = data.current.wind_degree + ' km/h';
    document.getElementById("humidity").innerHTML = data.current.humidity + " %";




}

function currentLoc() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                const newAPIURL = APIURL + latitude + "," + longitude;
                console.log("New Api URL in current location", newAPIURL);

                fetch(newAPIURL).then(response => response.json()).then(data => {
                    console.log(data);

                    DisplayWeather(data);

                })
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }

}
