const APIKEY = 'UsppJXiLnEkRVSJzaCP92eXcCZsZAnYAyM8AomWZ';
var LANDING_DATE_CURIOSITY, MAX_DATE_CURIOSITY, MAX_SOL_CURIOSITY;
var LANDING_DATE_OPPORTUNITY, MAX_DATE_OPPORTUNITY, MAX_SOL_OPPORTUNITY;
var LANDING_DATE_SPIRIT, MAX_DATE_SPIRIT, MAX_SOL_SPIRIT;

document.addEventListener('DOMContentLoaded', function () {
    querySelect("#searchBtn").addEventListener("click", getData);
    querySelect('#clearBtn').addEventListener('click', function () {
        querySelect("#myForm").reset();
    });
    querySelect('#mission').addEventListener('click', function () {
        setAttr('#date', 'class', 'form-control');
        setAttr('#incorrectDateInp', "class", "d-none");
    });
    querySelect('#camera').addEventListener('click', function () {
        setAttr('#date', 'class', 'form-control');
        setAttr('#incorrectDateInp', "class", "d-none");
    });
    querySelect('#slideShow').addEventListener('click', slideShow);
    querySelect('#stopSlideShow').addEventListener('click', function () {
        querySelect('#innerCarousel').innerHTML = '';
    });

}, false);
//-------------------------------------------------

fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity?api_key=${APIKEY}`)
    .then(status).then(json).then(function (res) {
        console.log(res);
        LANDING_DATE_CURIOSITY = res.photo_manifest.landing_date;
        MAX_DATE_CURIOSITY = res.photo_manifest.max_date;
        MAX_SOL_CURIOSITY = res.photo_manifest.max_sol;
      /*  querySelect('#infos').innerHTML += LANDING_DATE_CURIOSITY + "<br>";
        querySelect('#infos').innerHTML += MAX_DATE_CURIOSITY + "<br>";
        querySelect('#infos').innerHTML += MAX_SOL_CURIOSITY + "<br>";*/
    }).catch(function (err) {
        querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
    });
//------------------------------------
fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Opportunity?api_key=${APIKEY}`)
    .then(status).then(json).then(function (res) {
    console.log(res);
    LANDING_DATE_OPPORTUNITY = res.photo_manifest.landing_date;
    MAX_DATE_OPPORTUNITY = res.photo_manifest.max_date;
    MAX_SOL_OPPORTUNITY = res.photo_manifest.max_sol;
/*    querySelect('#infos').innerHTML += LANDING_DATE_OPPORTUNITY + "<br>";
   querySelect('#infos').innerHTML += MAX_DATE_OPPORTUNITY + "<br>";
    querySelect('#infos').innerHTML += MAX_SOL_OPPORTUNITY + "<br>";*/

    }).catch(function (err) {
        querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
    });
//------------------------------------
fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Spirit?api_key=${APIKEY}`)
    .then(status).then(json).then(function (res) {
    console.log(res);
    LANDING_DATE_SPIRIT = res.photo_manifest.landing_date;
    MAX_DATE_SPIRIT = res.photo_manifest.max_date;
    MAX_SOL_SPIRIT = res.photo_manifest.max_sol;
/*    querySelect('#infos').innerHTML += LANDING_DATE_SPIRIT + "<br>";
    querySelect('#infos').innerHTML += MAX_DATE_SPIRIT + "<br>";
    querySelect('#infos').innerHTML += MAX_SOL_SPIRIT + "<br>";*/

    }).catch(function (err) {
        querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
    });
//------------------------------------

let imgList = []
let resList = []

class Image {
    constructor(image_src, date, id, mission, camera) {
        this.image_src = image_src;
        this.date = date;
        this.id = id;
        this.mission = mission;
        this.camera = camera;
    }

    createDiv() {
        let myDiv = createNode('div');
        let card = createNode('div');
        card.setAttribute('style', "width: 18rem;");
        appendNode(myDiv, card, 'card  border border-5 rounded-3  mb-2', '')

        let image = createNode('img');
        image.setAttribute('src', this.image_src)
        appendNode(card, image, 'card-img-top', '')

        let cardBody = createNode('div');
        appendNode(card, cardBody, "card-body", '');

        let date = createNode('p');
        appendNode(cardBody, date, 'card-text', "Date: " + this.date);

        let id = createNode('p');
        appendNode(cardBody, id, 'card-text',  this.id);

        let cam = createNode('p');
        appendNode(cardBody, cam, 'card-text', "Camera: " + this.camera);

        let mis = createNode('p');
        appendNode(cardBody, mis, 'card-text', this.mission);

        let btnSave = createNode('button');
        appendNode(cardBody, btnSave, 'btn btn-info ml-2 mr-2', 'Save');

        let a = createNode('a');
        a.setAttribute('href', this.image_src);
        a.setAttribute('target', "_blank");
        appendNode(cardBody, a, '', '');
        let btnFullSize = createNode('button');
        appendNode(a, btnFullSize, 'btn btn-primary ml-2 mr-2', "Full size");

        return myDiv;
    }
}

//-----------------------------
const createNode = function (node) {// generic func
    return document.createElement(node);
}
//---------------------------------------
const appendNode = function (parent, child, nameClass, inner) { // generic func
    child.className = nameClass;
    child.innerHTML = inner;
    parent.appendChild(child);
}
//------------------------------------------
async function getData() {
    clearForm();
    let dateInp = getById("date").value.trim();
    const mission = getById('mission').value;
    const cam = getById('camera').value;

  //  let date;
    let url;
    if (isEarthDate(dateInp)) {
        const d = new Date(dateInp);
        dateInp = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?earth_date=${dateInp}&camera=${cam}&api_key=${APIKEY}`
    }
    else if (isSolDate(dateInp))
         url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?sol=${dateInp}&camera=${cam}&api_key=${APIKEY}`

    if (!correctInput(dateInp, mission, cam))
        return;

    querySelect('#loading').style.display = "block";
    querySelect("#loading").innerHTML = "<img src=https://64.media.tumblr.com/ec18887811b3dea8c69711c842de6bb9/tumblr_pabv7lGY7r1qza1qzo1_500.gifv  alt='...' >";// <!--width="60" height="60"-->
    setAttr('#date', 'class', 'form-control');
    setAttr('#mission', 'class', 'form-select');
    setAttr('#camera', 'class', 'form-select');
    
    fetch(url)
        .then(status).then(json).then(function (res) {
            console.log(res);

            res.photos.forEach(p => {
                imgList.push(new Image(p.img_src, dateInp, p.id, mission, cam));
            });
            resList.push(res);
            displayImages();
            buttonsSaveHandle(); // buttons handle
        })
        .catch(function (err) {
            console.log("catch: " + err);
            querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to NASA server...";
        });

    setAttr('#incorrectDateInp', "class", "d-none");
    setAttr('#incorrectMissionInp', "class", "d-none");
    setAttr('#incorrectCamInp', "class", "d-none");
    querySelect("#myForm").reset(); // reset the form
}

//----------------------------
const getById = function (container) {// generic func
    return document.getElementById(container);
}
//----------------------------
const querySelect = function (container) {// generic func
    return document.querySelector(container);
}
//------------------------------------
const setAttr = function (container, qualName, val) {// generic func
    querySelect(container).setAttribute(qualName, val);
}
//--------------------------------------
const displayImages = function () { // display list of tasks to the DOM
    querySelect('#loading').style.display = "none";
    let col1 = querySelect("#imagesOutput1");
    let col2 = querySelect("#imagesOutput2");
    let col3 = querySelect("#imagesOutput3");
    col1.innerHTML = col2.innerHTML = col3.innerHTML = ''; // clear div

    imgList.forEach(img => {
        if (imgList.indexOf(img) % 3 === 0)
            col1.appendChild(img.createDiv()); // inset tasks to div dom col 1
        else if (imgList.indexOf(img) % 3 === 1)
            col2.appendChild(img.createDiv()); // inset tasks to div dom col 2
        else if (imgList.indexOf(img) % 3 === 2)
            col3.appendChild(img.createDiv()); // inset tasks to div dom col 3
    });
}
//------------------------------------------------
const correctInput = function (dateInp, mission, cam) {
    // check inputs and return true if all is correct inputs, else will show user what problem he have and return false
    if (!validDate(dateInp)) {
        error('Please enter a valid format of date\n', "#incorrectDateInp");
        querySelect("#date").value = '';
        setAttr('#date', 'class', 'form-control is-invalid');
        return false;
    }
    if (mission === "Choose a mission") {
        error('No such mission, please select a mission\n', '#incorrectMissionInp');
        setAttr('#mission', 'class', 'form-select is-invalid');
        return false;
    }
    if (cam === "Choose a camera") {
        error('No such camera, please select a camera from the options\n', '#incorrectCamInp');
        setAttr('#camera', 'class', 'form-select is-invalid');
        return false;
    }

    let landingDate, maxDate, maxSol;
    if (mission === "Curiosity"){
        landingDate = LANDING_DATE_CURIOSITY;
        maxDate = MAX_DATE_CURIOSITY;
        maxSol = MAX_SOL_CURIOSITY;
    }
    else if (mission === "Opportunity"){
        landingDate = LANDING_DATE_OPPORTUNITY;
        maxDate = MAX_DATE_OPPORTUNITY;
        maxSol = MAX_SOL_OPPORTUNITY;
    }
    else if (mission === "Spirit"){
        landingDate = LANDING_DATE_SPIRIT;
        maxDate = MAX_DATE_SPIRIT;
        maxSol = MAX_SOL_SPIRIT;
    }

    if (!valid(landingDate, maxDate, maxSol, dateInp))
        return false;

    return true;
}
//---------------------------------
const valid = function (landingDate, maxDate, maxSol, dateInp) {
    if ((isEarthDate(dateInp) && (dateInp < landingDate))
        || (isEarthDate(dateInp) && (dateInp > maxDate))
        || (isSolDate(dateInp) && (dateInp > maxSol))) {
        if (isEarthDate(dateInp) && (dateInp < landingDate))
            error(`The mission you've selected required a date after ${landingDate}`, '#incorrectDateInp');
        else if (isEarthDate(dateInp) && (dateInp > maxDate))
            error(`The mission you've selected required a date before max date: ${maxDate}`, '#incorrectDateInp');
        else if (isSolDate(dateInp) && dateInp > maxSol)
            error(`The mission you've selected required a date before max sol: ${maxSol}`, '#incorrectDateInp');

        setAttr('#date', 'class', 'form-select is-invalid');
        querySelect("#date").value = '';
        return false;
    }
    return true;
}
//----------------------------------
const isEarthDate = (date) => {
    return date.match(/^\d{4}-\d{1,2}-\d{1,2}$/);
}
//--------------------------------
const isSolDate = (date) => {
    return date.match(/^\d{1,4}$/);
}
//---------------------------------
const validDate = function (date) {
    return isEarthDate(date) || isSolDate(date);
}
//--------------------------------------
const error = function (str, incorrectInp) {
    querySelect(incorrectInp).innerHTML = str;
    setAttr(incorrectInp, "class", "alert alert-danger");
}
//----------------------------------------------
const clear = function (container) {
    querySelect(container).value = '';
}
//------------------------------
const clearForm = function () {
    // clear but not reset toe form
    clear('#incorrectDateInp');
    clear('#incorrectMissionInp');
    clear('#incorrectCamInp');
    setAttr('#incorrectDateInp', "class", "d-none");
    setAttr('#incorrectMissionInp', "class", "d-none");
    setAttr('#incorrectCamInp', "class", "d-none");
    setAttr('#date', 'class', 'form-control');
    setAttr('#mission', 'class', 'form-select');
    setAttr('#camera', 'class', 'form-select');
}
//---------------------------------------
const buttonsSaveHandle = function () {
    for (let i = 1; i <= 3; i++) {
        const saveBtns = querySelect('#imagesOutput' + i.toString()).getElementsByClassName('btn btn-info ml-2 mr-2');
        for (let btn of saveBtns) {
            btn.addEventListener('click', function () {
                const id = btn.parentElement.getElementsByTagName('p')[1].innerHTML;
                let exist = false;
                const arr = querySelect('#infos').querySelectorAll('li');
                arr.forEach(li => {
                    if (li.id === id)
                        exist = true;
                });
                if (exist){
                    btn.setAttribute('data-bs-toggle', 'modal');
                    btn.setAttribute('data-bs-target', '#saveModal');
                    btn.click();
                    return;
                }

                resList.forEach(obj => {
                    obj.photos.forEach(p => {
                        if (id === p.id.toString()) {
                            let li = createNode('li');
                            li.id = id;
                            li.appendChild(createJink(p, id));
                            li.innerHTML += "Earth date: " + p.earth_date + ', Sol: ' + p.sol + ', Camera: ' + p.camera.name;
                            querySelect('#infos').appendChild(li);
                        }
                    })
                });
            });
        }
    }
}
//---------------------------
const createJink = function (p, id) {
    let a = createNode('a');
    a.setAttribute('id',  id);
    a.setAttribute('href', p.img_src);
    a.setAttribute('target', "_blank")
    a.innerHTML = "Image of: " + id + "<br>";
    return a;
}
//-------------------------------------
const slideShow = function () {
    let carousel = querySelect('#innerCarousel');
    let ind = querySelect('#indicator');
    carousel.innerHTML = ind.innerHTML = '';
    imgList.forEach(img => {
        carousel.appendChild(createImageCarousel(img.image, img.camera, img.date, imgList.indexOf(img)));
        ind.appendChild(createBtn(img));
    });
}

//------------------------------------
function createBtn(img) {
    let btn = createNode('button');
    btn.setAttribute('data-bs-target', '#carousel');
    if (imgList.indexOf(img) === 0) {
        btn.setAttribute('class', 'active');
        btn.setAttribute('aria-current', 'true');
    }
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-bs-slide-to', imgList.indexOf(img).toString());
    btn.setAttribute('aria-label', 'Slide' + imgList.indexOf(img).toString());
    return btn;
}

//---------------------------------------
const createImageCarousel = function (img_src, cameraName, dateMission, index) {
    let div = createNode('div');
    index === 0 ? div.setAttribute('class', 'carousel-item active')
        : div.setAttribute('class', 'carousel-item');

    let img = createNode('img');
    img.setAttribute('src', img_src);
    img.setAttribute('class', 'd-block w-100');
    div.appendChild(img);

    let divCap = createNode('div');
    divCap.setAttribute('class', "carousel-caption d-none d-md-block")
    div.appendChild(divCap);

    let camName = createNode('h5');
    camName.innerHTML = cameraName;
    divCap.appendChild(camName);

    let date = createNode('p');
    date.innerHTML = dateMission;
    divCap.appendChild(date);

    let a = createNode('a');
    a.setAttribute('href', img_src);
    a.setAttribute('target', "_blank")
    appendNode(divCap, a, '', '');

    let btn = createNode('button');
    appendNode(a, btn, 'btn btn-primary ml-2 mr-2', 'Full size');

    return div;
}

//----------------------------------
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}
//-------------------------------------------
function json(response) {
    return response.json()
}


/* } else {
      // show validation div
    /!*  getById("username").classList.add("is-invalid");
      getById("username").nextElementSibling.classList.remove("d-none");*!/
  }*/

/*    //document.querySelector("#imagesOutput").innerHTML += "<img src='img/loading-buffering.gif'>";
*
* sol:
* https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY
*
* */

/*            let earthDate = res.photos[0].earth_date;
            let sol = res.photos[0].sol;
            let id = res.photos[0].id;
            let cameraName = res.photos[0].camera.name;
            let cameraFullName = res.photos[0].camera.full_name;*/


/*querySelect("#imagesOutput").innerHTML =  res.explanation + "<br>";
querySelect("#imagesOutput").innerHTML += `<img src=${res.url}>`;*/
// let image = `<img src=${res.img_src}>`;

/*  querySelect("#imagesOutput").innerHTML = earthDate + "<br>";
  querySelect("#imagesOutput").innerHTML += sol + "<br>";
  querySelect("#imagesOutput").innerHTML += id + "<br>";
  querySelect("#imagesOutput").innerHTML += cameraName + "<br>";
  querySelect("#imagesOutput").innerHTML += cameraFullName + "<br>";*/

/* document.getElementById("image").src = img;
 document.getElementById("image").style.display = "block";*/

//fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/' + mission + '/photos?earth_date='
//      + dateInp + '&api_key=' + APIKEY)
//fetch('https://api.nasa.gov/planetary/apod?api_key=' + APIKEY)
// mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key='+APKEY

/*    document.getElementById("username").nextElementSibling.classList.add("d-none");
    document.getElementById("username").classList.remove("is-invalid");*/


//  let camName = res.photos[0].camera.name;
// querySelect("#imagesOutput").innerHTML = landingDate;

// let img = res.photos[0].img_src;
//  imgList.push(new Image(img, dateInp, mission, cam));

//  let landingDate = res.photos[0].rover.landing_date;
// querySelect("#imagesOutput").innerHTML = landingDate;

// querySelect("#imagesOutput").innerHTML += p.camera.name + "<br>";


/*//-------------------------------------
const getCurrDate = function () {
    let date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    date = [yyyy, mm, dd].join('-');
    return date;
}*/