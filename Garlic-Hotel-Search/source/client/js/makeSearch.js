
//This function is called when the search data is sucessfull returned from the API
//The data will be in the form of a Listing object array found in /source/server/API.js

function searchSuccessCallback(data) {
  console.log(data);
  if(data.error)
    searchFailureCallback(data.error);
  else
    if(data.length == 0)
      alert("Hmmm, it looks like there were no hotels matching that query, try again.");
    else
      displayData(data, data.length);
}

//This function is called when the search fails for any reason
function searchFailureCallback(reason) {
  console.error("Search Failure:" + reason);
}

//This function is called when the "Search" button is pressed
function runSearch() {
  //Get Values from the frontend
  let encodedSearchText = encodeURIComponent(
    document.getElementById("searchInput").value
  );
  let encodedDates = encodeURIComponent(
    document.getElementById("dates").value
  ); //TODO: pass required date range
  let encodedBeds = encodeURIComponent(
    document.getElementById("beds").value
  ); //TODO: pass required beds

  //Pass Values to the backend's search endpoint
  fetch(
    "/GarlicSearchEndpoint?search=" + encodedSearchText +
    "&dates=" + encodedDates +
    "&beds=" + encodedBeds
  )
  .then((response) => response.json()) //convert return data to json
  .then((data) => searchSuccessCallback(data)) //do something with our API return data
  .catch((reason) => searchFailureCallback(reason)); //handle errors
}