const APIKEY = 'UsppJXiLnEkRVSJzaCP92eXcCZsZAnYAyM8AomWZ';

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

}, false);

//-------------------------------------------------

let imgList = []

class Image {
    constructor(image, date, id, mission, camera) {
        this.image = image;
        this.date = date;
        this.id = id;
        this.mission = mission; // when pressed Enter key will insert new line to the string of the description text
        this.camera = camera;
    }

    createDiv() {
        let myDiv = createNode('div');

        let card = createNode('div');
        card.setAttribute('style', "width: 18rem;");
        appendNode(myDiv, card, 'card  border border-5 rounded-3  mb-2', '')

        let image = createNode('img');
        image.setAttribute('src', this.image)
        appendNode(card, image, 'card-img-top', '')

        let cardBody = createNode('div');
        appendNode(card, cardBody, "card-body", '');

        let date = createNode('p');
        appendNode(cardBody, date, 'card-text', this.date);

        let id = createNode('p');
        appendNode(cardBody, id, 'card-text', this.id);

        let cam = createNode('p');
        appendNode(cardBody, cam, 'card-text', this.camera);

        let mis = createNode('p');
        appendNode(cardBody, mis, 'card-text', this.mission);

        let btnDelete = createNode('button');
        appendNode(cardBody, btnDelete, 'btn btn-info ml-2 mr-2', "Save");

        let btnDelete2 = createNode('button');
        appendNode(cardBody, btnDelete2, 'btn btn-primary ml-2 mr-2', "Full size");

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
    let mission = getById('mission').value;
    let cam = getById('camera').value;

    if (!correctInput(dateInp, mission, cam))
        return;

    querySelect("#imagesOutput").innerHTML = "<img src=https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif width=\"60\" height=\"60\" alt='...' >";
    setAttr('#date', 'class', 'form-control');
    setAttr('#mission', 'class', 'form-select');
    setAttr('#camera', 'class', 'form-select');

    let apiMars = `https://api.nasa.gov/mars-photos/api/v1/rovers/`;
    let url = apiMars + `${mission}/photos?earth_date=${dateInp}&sol=${dateInp}&camera=${cam}&api_key=${APIKEY}`;

    fetch(url)
        .then(status)
        .then(json)
        .then(function (res) {
            console.log(res);

            res.photos.forEach(p => {
                imgList.push(new Image(p.img_src, dateInp, p.id, mission, cam));
            });
            displayList();
        })
        .catch(function (err) {
            console.log("catch: " + err);
            querySelect("#imagesOutput").innerHTML = "Sorry, no photos at this date...";
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
const displayList = function () { // display list of tasks to the DOM
    querySelect("#imagesOutput").innerHTML = '';// clear div
    imgList.forEach(img => {
        querySelect("#imagesOutput").appendChild(img.createDiv()); // inset tasks to div dom
    });
}
//------------------------------------------------
//--------------------------
const correctInput = function (date, mission, cam) {
    // check inputs and return true if all is correct inputs, else will show user what problem he have and return false
    if (!validDate(date)) {
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

    let landingDate;
    if (date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
        if (mission === "Curiosity")
            landingDate = new Date('August 07, 2012').toJSON().slice(0, 10); // 2012-08-06
        else if (mission === "Opportunity")
            landingDate = new Date('July 09, 2003').toJSON().slice(0, 10); // July 8, 2003
        else if (mission === "Spirit")
            landingDate = new Date('June 11, 2003').toJSON().slice(0, 10); // June 10, 2003

        if (date < landingDate || date > getCurrDate()) {
            error(`The mission you've selected required a date after ${landingDate} and before today's date: ${getCurrDate()}`, '#incorrectDateInp');
            setAttr('#date', 'class', 'form-select is-invalid');
            querySelect("#date").value = '';
            return false;
        }
    }

    return true;
}
//---------------------------------
const validDate = function (date) {
    return date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)  || date.match(/^\d{1,4}$/);
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
const clearForm = function (container) {
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
//-------------------------------------
const getCurrDate = function () {
    let date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    date = [yyyy, mm, dd].join('-');
    console.log("date: " + date);
    return date;
}

//-------------------------------------
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