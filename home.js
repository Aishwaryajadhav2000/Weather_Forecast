
// document.getElementById("weatherInput").value = "Bhiwandi"; // Remove this line after css work

const APIURL = "https://api.weatherapi.com/v1/current.json?key=7ea64d87650b4ecfbe061544242711&q=";
const APIURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=tokyo&appid=331da149f0b279c6bcc79c78fdab8b45";
const API3 = "https://api.openweathermap.org/data/2.5/weather?q={cityname}&appid=331da149f0b279c6bcc79c78fdab8b45"

const today = new Date();
// console.log(today.getDate()); // Day of the month (1-31)
// console.log(today.getMonth() + 1); // Month (0-11, so add 1)
// console.log(today.getFullYear()); // Full year (e.g., 2024)
// console.log(todaysdate);
const getdate = today.getDate();
const getmonth = today.getMonth() + 1;
const getyear = today.getFullYear();
const getTodaysDate = `${getyear}-${getmonth}-${getdate}`
console.log("Todays date", getTodaysDate);
const getTime = '00:00:00';

const alertmsg = document.getElementById("alert");

const takesection = document.getElementById("weatherSection2");

const pastsearch = document.getElementById("pastsearch");

//get data from localstorage
const searchHistory = JSON.parse(localStorage.getItem("pastSearch")) || [];

console.log("search History", searchHistory.length);
if(searchHistory.length <=0){
    pastsearch.style.display = "none";
}else{
    displayPastSearch(searchHistory);
}


function searchWeather() {

    const inputVal = document.getElementById("weatherInput").value;

    const pastSearch = { inputVal };


    // const pastSearch = `${inputVal}`;
    // const pastSearch = {inputVal};


    if (!document.getElementById("weatherInput").value) {
        alert("Please insert location...");
        alertmsg.style.display = "block"
        alertmsg.textContent = "Please insert location..."
        console.log("if");
    } else {
        console.log("pastsearch", pastSearch);
        const newAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=331da149f0b279c6bcc79c78fdab8b45`;
        console.log("newAPI", newAPIURL);

        fetch(newAPIURL).then(response => {

            if (response.status === 404) {
                console.log("city not found");
                alertmsg.style.display = "block"
                alertmsg.textContent = "city not found..."
            }

            return response.json()
        }).then(data => {
            console.log("data fetch", data);

            DisplayWeather(data);
            getWeatherForTomorrow(inputVal);

            paseSearchInLocal(pastSearch);

            document.getElementById("weatherInput").value = "";

            displayPastSearch(searchHistory);



        }).catch(error => {
            console.log("errors", error);
            alert("Please check your network connection...")
        })

    }

    // Get all articles in the section
    const articles = takesection.querySelectorAll("article");
    // Measure the number of articles
    const articleCount = articles.length;
    console.log(`Number of articles in the section here: ${articleCount}`);

    if (articleCount <= 0) {
        console.log("article count 0")
    } else {
        console.log("article count more than 0");
        takesection.innerHTML = "";
    }
}



//Function to store data in localstorage
function paseSearchInLocal(pastSearch) {

    pastsearch.style.display = "block";


    console.log("pastsearch 2", pastSearch);

    // //get data from localstorage
    // const searchHistory = JSON.parse(localStorage.getItem("pastSearch")) || [];

    const valueExists = searchHistory.some((entry) => entry.inputVal === pastSearch.inputVal);

    if (valueExists) {
        console.log("Value existed");
    } else {

        //push data in searchHistory
        searchHistory.push(pastSearch);
        //Set data from searchHistory to localStorage
        localStorage.setItem("pastSearch", JSON.stringify(searchHistory));
        console.log("searchHistory ", searchHistory);

    }

}

function displayPastSearch(searchHistory) {
    const dropdown = document.getElementById("recentSearchCities");
    console.log("display data function call")

    // const existingvalues = searchHistory.map((cities) => {
    //     console.log("cities", cities);
    // })

    const existingvalues = searchHistory.map((cities) => {
        console.log("cities", cities.inputVal);

        const option = document.createElement("option");
        option.value = cities.inputVal;
        option.textContent = cities.inputVal;


        dropdown.appendChild(option);

        // dropdown.innerHTML = `<option value="${cities.inputVal}">${cities.inputVal}</option>`

       
    })


    console.log("existingvlues", existingvalues);
    // dropdown.innerHTML = `<option>${entry.inputVal}</option>`

    // dropdown.innerHTML = searchHistory.map(cities => `<option value="${cities}">${cities}</option>`).join('');
}

document.getElementById("recentSearchCities").addEventListener('change', async (event) =>{
    const getCity = event.target.value;
    console.log("get city", getCity);

    const newAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=${getCity}&appid=331da149f0b279c6bcc79c78fdab8b45`;
        console.log("newAPI", newAPIURL);

        fetch(newAPIURL).then(response => {

          
            return response.json()
        }).then(data => {
            console.log("data fetch", data);

            DisplayWeather(data);
            getWeatherForTomorrow(getCity);


            displayPastSearch(searchHistory);



        }).catch(error => {
            console.log("errors", error);
            alert("Please check your network connection...")
        })

})

// searchWeather();
function DisplayWeather(data) {
    // console.log("data", data);
    document.getElementById("weatherSection").style.display = "block"

    // const displayWeather = document.getElementById("displayWeather");
    // displayWeather.innerHTML = `
    // <h1> ${data.location.name}</h1>
    // <p> Temprature - ${data.current.temp_c}</p>
    // `


    // document.getElementById("location-name").innerHTML = data.location.name;
    // document.getElementById("temprature").innerHTML = data.current.temp_c + `<sup>0</sup>` + ' C';
    // document.getElementById("wind-speed").innerHTML = data.current.wind_degree + ' km/h';
    // document.getElementById("humidity").innerHTML = data.current.humidity + " %";

    document.getElementById("location-name").innerHTML = "Today's Weather in " + data.name;
    document.getElementById("temprature").innerHTML = data.main.temp + `<sup>0</sup>` + ' C';
    document.getElementById("wind-speed").innerHTML = data.wind.speed + ' km/h';
    document.getElementById("humidity").innerHTML = data.main.humidity + " %";


}

function currentLoc() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                const newAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=331da149f0b279c6bcc79c78fdab8b45`
                console.log("New Api URL in current location", newAPIURL);

                fetch(newAPIURL).then(response => response.json()).then(data => {
                    console.log(data);

                    DisplayWeather(data);
                    console.log("data.name", data.name);
                    const inputVal = data.name;
                    console.log("currentlocationname" , inputVal);

                    const saveinlocal = {inputVal}


                    paseSearchInLocal(saveinlocal)

                    displayPastSearch(searchHistory);

                    getWeatherForTomorrow(data.name);

                })
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }

    // Get all articles in the section
    const articles = takesection.querySelectorAll("article");
    // Measure the number of articles
    const articleCount = articles.length;
    console.log(`Number of articles in the section here: ${articleCount}`);

    if (articleCount <= 0) {
        console.log("article count 0")
    } else {
        console.log("article count more than 0");
        takesection.innerHTML = "";
    }

}

function getWeatherForTomorrow(inputVal) {

    const newAPIURL = `https://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&appid=331da149f0b279c6bcc79c78fdab8b45`;

    // console.log("newAPi for all days", newAPIURL)

    fetch(newAPIURL).then(response => response.json()).then(data => {
        // console.log("data fetch", data);

        DisplayWeatherForTomorrow(data);
    })

}
function DisplayWeatherForTomorrow(data) {
    // console.log("display tomorrow weather", data);
    // console.log("data.name2", data.city.name);


    data.list.forEach(weatherinfo => {
        // console.log("weatherinfo", weatherinfo);
        if (!weatherinfo.dt_txt.includes(getTodaysDate) &&
            weatherinfo.dt_txt.includes(getTime)) {

            // console.log("weatherinfo", weatherinfo)






            createDisplayWeatherSection(weatherinfo, data.city.name);

            // document.getElementById("location-name").innerHTML = data.name;
            // document.getElementById("tmrdate").innerHTML = weatherinfo.dt_txt;
            // document.getElementById("tmrtemprature").innerHTML = weatherinfo.main.temp + `<sup>0</sup>` + ' C';
            // document.getElementById("tmrwind-speed").innerHTML = weatherinfo.wind.speed + ' km/h';
            // document.getElementById("tmrhumidity").innerHTML = weatherinfo.main.humidity + " %";
        }
    })

    document.getElementById("weatherSection2").style.display = "block"


}
function createDisplayWeatherSection(weatherinfo, locname) {
    // console.log("weatherinfo in createDisplayWeatherSection", weatherinfo);
    // console.log("locationname", locname);



    // const firstdiv = document.getElementById("firstdiv");
    // const createheader = document.createElement("h1");
    // createheader.innerHTML = `
    // <h1 class="text-center " id="tmrdate">${weatherinfo.dt_txt}</h1>`
    // firstdiv.appendChild(createheader);

    const dateOnly = weatherinfo.dt_txt.split(" ")[0];
    // console.log("dateonly", dateOnly);



    const createArticle = document.createElement("article");
    createArticle.className = "newarticle"
    createArticle.innerHTML = `
        <h1 class="text-center">${dateOnly}${locname}</h1>

        <div class="flex" style="justify-content: space-between; margin-top:10px;" id="tmrWeatherData">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="orange"
                        class="bi bi-sun-fill" viewBox="0 0 16 16">
                        <path
                            d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
                    </svg>
                    <h4>Temperature</h4>
                    <h3 id="temprature">${weatherinfo.main.temp + `<sup>0</sup>` + ' C'}</h3>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="blue"
                        class="bi bi-clouds " viewBox="0 0 16 16">
                        <path
                            d="M16 7.5a2.5 2.5 0 0 1-1.456 2.272 3.5 3.5 0 0 0-.65-.824 1.5 1.5 0 0 0-.789-2.896.5.5 0 0 1-.627-.421 3 3 0 0 0-5.22-1.625 5.6 5.6 0 0 0-1.276.088 4.002 4.002 0 0 1 7.392.91A2.5 2.5 0 0 1 16 7.5" />
                        <path
                            d="M7 5a4.5 4.5 0 0 1 4.473 4h.027a2.5 2.5 0 0 1 0 5H3a3 3 0 0 1-.247-5.99A4.5 4.5 0 0 1 7 5m3.5 4.5a3.5 3.5 0 0 0-6.89-.873.5.5 0 0 1-.51.375A2 2 0 1 0 3 13h8.5a1.5 1.5 0 1 0-.376-2.953.5.5 0 0 1-.624-.492z" />
                    </svg>
                    <h4>Wind Speed</h4>
                    <h3 id="wind-speed">${weatherinfo.wind.speed}km/h</h3>
                </div>

                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="blue"
                        class="bi bi-moisture" viewBox="0 0 16 16">
                        <path
                            d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267" />
                    </svg>
                    <h4>Humidity</h4>
                    <h3 id="humidity">${weatherinfo.main.humidity}%</h3>
                </div>
            </div>
    `
    // <h1 class="text-center" onClick="displayAllWeatherData(weatherinfo)">${weatherinfo.dt_txt}</h1>

    takesection.appendChild(createArticle);

    // const articles = takesection.querySelectorAll("article"); // Get all articles in the section
    // // Measure the number of articles
    // const articleCount = articles.length;
    // console.log(`Number of articles in the section: ${articleCount}`);
}

function displayAllWeatherData(weatherinfo) {
    console.log("displaydata", weatherinfo);
}

