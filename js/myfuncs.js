src = "jquery-1.8.2.js"

const APIKEY = 'UsppJXiLnEkRVSJzaCP92eXcCZsZAnYAyM8AomWZ';

document.addEventListener('DOMContentLoaded', function () {
    querySelect("#searchBtn").addEventListener("click", getData);
    querySelect('#clearBtn').addEventListener('click', function () {
        querySelect("#myForm").reset();
    });
    querySelect('#mission').addEventListener('click', function (){
        querySelect('#date').setAttribute('class', 'form-control');
        querySelect('#incorrectDateInp').setAttribute("class", "d-none");
    });
    querySelect('#camera').addEventListener('click', function (){
        querySelect('#date').setAttribute('class', 'form-control');
        querySelect('#incorrectDateInp').setAttribute("class", "d-none");
    });

}, false);

//-------------------------------------------------

let imgList = []

class Image {
    constructor(image, date, mission, camera) {
        this.image = image;
        this.date = date;
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
    let incorrectInput = querySelect('#incorrectDateInp') ;
    incorrectInput.innerHTML = '';

    let dateInp = getById("date").value.trim();
    let mission = getById('mission').value;
    let cam = getById('camera').value;

    if (!correctInput(dateInp))
        return;

    querySelect("#imagesOutput").innerHTML = "<img src=https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif width=\"60\" height=\"60\" alt='...' >";

    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?earth_date=${dateInp}&sol=${dateInp}&camera=${cam}&api_key=${APIKEY}`;

    fetch(url)
        .then(status)
        .then(json)
        .then(function (res) {
            console.log(res)
            let img = res.photos[0].img_src;
            imgList.push(new Image(img, dateInp, mission, cam));
            displayList();
        })
        .catch(function (err) {
            console.log(err);
            querySelect("#imagesOutput").innerHTML = "Sorry, no photos at this date...";

        })

    incorrectInput.setAttribute("class", "d-none");
    querySelect("#date").value = '';
    querySelect("#myForm").reset();
}
//----------------------------
const getById = function (container) {// generic func
    return document.getElementById(container);
}
//----------------------------
const querySelect = function (container) {// generic func
    return document.querySelector(container);
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
const correctInput = function (date) {
    // check inputs and return true if all is correct inputs, else will show user what problem he have and return false
    if (!validDate(date)) {
        error('Please enter a valid format of date\n');
        querySelect("#date").setAttribute('class', 'form-control is-invalid');
        querySelect("#date").value = '';
        return false;
    }
    return true;
}
//---------------------------------
const validDate = function (date) {
    return date.match(/^\d{4}-\d{1,2}-\d{1,2}$/) || date.match(/^\d{4}$/);
}
//--------------------------------------
const error = function (str) {
    querySelect('#incorrectDateInp').innerHTML = str;
    querySelect('#incorrectDateInp').setAttribute("class", "alert alert-danger");
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