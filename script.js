// Makes search button that calls API for Openweather API.
$(document).ready(function () {
  $("#search-button").on("click", function () {
    var searchTerm = $("#search-value").val();
    $("#search-value").val("");
    weatherFunction(searchTerm);
    weatherForecast(searchTerm);
  });

  var input = document.getElementById("search-value");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search-button").click();
    }
  });
  //Creates list of previous searched cities.
  var history = JSON.parse(localStorage.getItem("history")) || [];

  if (history.length > 0) {
    weatherFunction(history[history.length - 1]);
  }
  for (var i = 0; i < history.length; i++) {
    createRow(history[i]);
  }

  function createRow(text) {
    var listItem = $("<li>").addClass("list-group-item").text(text);
    $(".history").append(listItem);
  }
  //on click event in search history that calls both weatherFunction and weatherForecast functions.
  $(".history").on("click", "li", function () {
    weatherFunction($(this).text());
    weatherForecast($(this).text());
  });

  function weatherFunction(searchTerm) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchTerm +
        "&appid=d6905edd12215884b63b20e43ae66ec1&units=imperial",
    }).then(function (info) {
      if (history.indexOf(searchTerm) === -1) {
        history.push(searchTerm);
        localStorage.setItem("history", JSON.stringify(history));
        createRow(searchTerm);
      }
      $("#today").empty();

      var title = $("<h3>")
        .addClass("card-title")
        .text(info.name + " (" + new Date().toLocaleDateString() + ")");
      var img = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + info.weather[0].icon + ".png"
      );

      //Creates card that lists the temp/humidity/windspeed/uvindex of the current date through adding p tags to a div.
      var card = $("<div>").addClass("card");
      var cardBody = $("<div>").addClass("card-body");
      var wind = $("<p>")
        .addClass("card-text")
        .text("Wind Speed: " + info.wind.speed + " MPH");
      var humid = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + info.main.humidity + "%");
      var temp = $("<p>")
        .addClass("card-text")
        .text("Temperature: " + info.main.temp + " °F");

      var lon = info.coord.lon;
      var lat = info.coord.lat;

      $.ajax({
        type: "GET",
        url:
          "https://api.openweathermap.org/data/2.5/uvi?appid=d6905edd12215884b63b20e43ae66ec1&lat=" +
          lat +
          "&lon=" +
          lon,
      }).then(function (response) {
        console.log(response);

        var uvColor;
        var uvResponse = response.value;
        var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);

        if (uvResponse < 3) {
          btn.addClass("btn-success");
        } else if (uvResponse < 7) {
          btn.addClass("btn-warning");
        } else {
          btn.addClass("btn-danger");
        }

        cardBody.append(uvIndex);
        $("#today .card-body").append(uvIndex.append(btn));
      });

      title.append(img);
      cardBody.append(title, temp, humid, wind);
      card.append(cardBody);
      $("#today").append(card);
      console.log(info);
    });
  }
  //function that creates cards and lists info for the 5-day forecast.
  function weatherForecast(searchTerm) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchTerm +
        "&appid=d6905edd12215884b63b20e43ae66ec1&units=imperial",
    }).then(function (info) {
      console.log(info);
      $("#forecast")
        .html('<h4 class="mt-3">5-Day Forecast:</h4>')
        .append('<div class="row">');

      for (var i = 0; i < infoa.list.length; i++) {
        if (infoa.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          var titleFive = $("<h4>")
            .addClass("card-title")
            .text(new Date(info.list[i].dt_txt).toLocaleDateString());
          var imgFive = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" +
              info.list[i].weather[0].icon +
              ".png"
          );

          var colFive = $("<div>").addClass("col-md-2");
          var cardFive = $("<div>").addClass("card bg-primary text-white");
          var cardBodyFive = $("<div>").addClass("card-body p-2");
          var humidFive = $("<p>")
            .addClass("card-text")
            .text("Humidity: " + info.list[i].main.humidity + "%");
          var tempFive = $("<p>")
            .addClass("card-text")
            .text("Temperature: " + info.list[i].main.temp + " °F");

          colFive.append(
            cardFive.append(
              cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)
            )
          );
          $("#forecast .row").append(colFive);
        }
      }
    });
  }
});
