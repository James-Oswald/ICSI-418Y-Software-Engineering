
var DATA;

function displayData(data, n) {
    let row = document.getElementById("searchResults");
    //let numResults = document.getElementById("numResults");
    DATA = data;
    try {
        animate();
        row.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            row.innerHTML += `
            <div class='four col'>
                <div class='list-group' id=list-${i}style="position: relative;">
                    <div onclick="lbAnimate(${i})">
                        <div class="hotel-img" style="background: url('${data[i].image}'); background-position: center; background-size: cover;"></div>
                        <!--<p class="paragraph-md">${data[i].address}
                        <br>${data[i].contactNum}
                        <br>${data[i].rating}
                        <br>${data[i].features}</p>-->
                        <h1 class="subheader" style="text-align: center; margin-top: 5px; font-size: 1.3em">${data[i].name}</h1>
                    </div>
                </div>
            </div>
            `;
        }
        //numResults.innerHTML = "Filter " + n + " Results";
        displayResults()
    } catch (e) {
        console.error(e);
    }
}

function animate() {
    let searchContainer = document.getElementById("searchContainer");
    searchContainer.classList.toggle("searchContainer-active");
}

function revAnimate() {
    animate();
    displayResults();
}

function displayResults() {
    let results = document.getElementById("resultGroup");
    results.classList.toggle("results-active");
}

//★★★★☆
function lbAnimate(i) {
    document.getElementById("lb-fav").classList.remove("lb-fav-active");
    var lb = document.getElementById("listing-lightbox")
    var lbExit = document.getElementById("listing-lightbox-exit")
    var lbName = document.getElementById("lb-name")
    var lbImg = document.getElementById("listing-lightbox-img")
    var lbPhone = document.getElementById("lb-phone")
    var lbAddr = document.getElementById("lb-addr")
    var lbPrice = document.getElementById("lb-price")
    var lbStars = document.getElementById("lb-stars")
    var lbDesc = document.getElementById("lb-desc")
    var lbRate = document.getElementById("lb-rating")
    var lbGoTo = document.getElementById("lb-goto")
    var data = DATA[i];
    lb.classList.toggle("listing-lightbox-active");
    lbExit.classList.toggle("listing-lightbox-exit-active");
    lbImg.src = data.image
    console.log(data); 
    lbName.innerHTML = data.name;
    lbAddr.innerHTML = data.address;
    lbPrice.innerHTML = data.preTaxNight;
    lbPrice.unitPrice = parseInt(data.preTaxNight.substring(1));
    let rating = Math.floor(data.rating);
    lbStars.innerHTML = data.rating + " " + "★".repeat(rating) + "☆".repeat(5 - rating);
    lbDesc.innerHTML = data.features.join(", ");
    lbGoTo.href = data.link;
}

function favorites(i) {
    // add favorite to user row
    const btn = document.getElementById("fav")
    btn.classList.toggle("fav-active")
}

function lbFavorite() {
    const btn = document.getElementById("lb-fav")
    btn.classList.toggle("lb-fav-active")
    addFavorite();
}