const APIKEY = 'UsppJXiLnEkRVSJzaCP92eXcCZsZAnYAyM8AomWZ';
var LANDING_DATE_CURIOSITY, MAX_DATE_CURIOSITY, MAX_SOL_CURIOSITY,
    LANDING_DATE_OPPORTUNITY, MAX_DATE_OPPORTUNITY, MAX_SOL_OPPORTUNITY,
    LANDING_DATE_SPIRIT, MAX_DATE_SPIRIT, MAX_SOL_SPIRIT;

document.addEventListener('DOMContentLoaded', function () {
    myModul.querySelect("#searchBtn").addEventListener("click", myModul.getData);
    myModul.querySelect('#clearBtn').addEventListener('click', function () {
        myModul.querySelect("#myForm").reset();
    });
    myModul.querySelect('#mission').addEventListener('click', function () {
        myModul.setAttr('#date', 'class', 'form-control');
        myModul.setAttr('#incorrectDateInp', "class", "d-none");
    });
    myModul.querySelect('#camera').addEventListener('click', function () {
        myModul.setAttr('#date', 'class', 'form-control');
        myModul.setAttr('#incorrectDateInp', "class", "d-none");
    });
    myModul.querySelect('#slideShow').addEventListener('click', myModul.slideShow);
    myModul.querySelect('#stopSlideShow').addEventListener('click', function () {
        myModul.querySelect('#innerCarousel').innerHTML = '';
    });

}, false);

//-------------------------------------------------
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

//---------------------------------
/*const inisializeModul = (() => {
    let publicData = {}*/
fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity?api_key=${APIKEY}`)
    .then(status).then(json).then(function (res) {
    console.log(res);
    LANDING_DATE_CURIOSITY = res.photo_manifest.landing_date;
    MAX_DATE_CURIOSITY = res.photo_manifest.max_date;
    MAX_SOL_CURIOSITY = res.photo_manifest.max_sol;
}).catch(function () {
    myModul.querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
});
//------------------------------------
fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Opportunity?api_key=${APIKEY}`)
    .then(status).then(json).then(function (res) {
    console.log(res);
    LANDING_DATE_OPPORTUNITY = res.photo_manifest.landing_date;
    MAX_DATE_OPPORTUNITY = res.photo_manifest.max_date;
    MAX_SOL_OPPORTUNITY = res.photo_manifest.max_sol;
}).catch(function () {
    myModul.querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
});
//------------------------------------
fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Spirit?api_key=${APIKEY}`)
    .then(status).then(json).then(function (res) {
    console.log(res);
    LANDING_DATE_SPIRIT = res.photo_manifest.landing_date;
    MAX_DATE_SPIRIT = res.photo_manifest.max_date;
    MAX_SOL_SPIRIT = res.photo_manifest.max_sol;
}).catch(function () {
    myModul.querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
});

/*
    return publicData;
})();
*/

// Validation Modul /////////////////////
const validationModul = (() => {
    const publicDataValidation = {}

    publicDataValidation.correctInput = function (dateInp, mission, cam) {
        // check inputs and return true if all is correct inputs, else will show user what problem he have and return false
        if (!validDate(dateInp)) {
            myModul.querySelect("#date").value = '';
            myModul.setAttr('#date', 'class', 'form-control is-invalid');
            return error('Please enter a valid format of date\n', "#incorrectDateInp");
        }
        if (mission === "Choose a mission") {
            myModul.setAttr('#mission', 'class', 'form-select is-invalid');
            return error('No such mission, please select a mission\n', '#incorrectMissionInp');
        }
        if (cam === "Choose a camera") {
            myModul.setAttr('#camera', 'class', 'form-select is-invalid');
            return error('No such camera, please select a camera from the options\n', '#incorrectCamInp');
        }

        let landingDate, maxDate, maxSol;
        if (mission === "Curiosity") {
            if (cam === "PANCAM" || cam === "MINITES")
                return errorCamera(mission, cam);
            landingDate = LANDING_DATE_CURIOSITY;
            maxDate = MAX_DATE_CURIOSITY;
            maxSol = MAX_SOL_CURIOSITY;
        } else if (mission === "Opportunity") {
            if (cam === "MAST" || cam === "CHEMCAM" || cam === "MAHLI" || cam === "MARDI")
                return errorCamera(mission, cam);
            landingDate = LANDING_DATE_OPPORTUNITY;
            maxDate = MAX_DATE_OPPORTUNITY;
            maxSol = MAX_SOL_OPPORTUNITY;
        } else if (mission === "Spirit") {
            if (cam === "MAST" || cam === "CHEMCAM" || cam === "MAHLI" || cam === "MARDI")
                return errorCamera(mission, cam);
            landingDate = LANDING_DATE_SPIRIT;
            maxDate = MAX_DATE_SPIRIT;
            maxSol = MAX_SOL_SPIRIT;
        }

        return valid(landingDate, maxDate, maxSol, dateInp);
    }
//---------------------------------
    const valid = function (landingDate, maxDate, maxSol, dateInp) {
        if ((validationModul.isEarthDate(dateInp) && (dateInp < landingDate))
            || (validationModul.isEarthDate(dateInp) && (dateInp > maxDate))
            || (validationModul.isSolDate(dateInp) && (dateInp > maxSol))) {
            if (validationModul.isEarthDate(dateInp) && (dateInp < landingDate))
                error(`The mission you've selected required a date after ${landingDate}`, '#incorrectDateInp');
            else if (validationModul.isEarthDate(dateInp) && (dateInp > maxDate))
                error(`The mission you've selected required a date before max date: ${maxDate}`, '#incorrectDateInp');
            else if (validationModul.isSolDate(dateInp) && dateInp > maxSol)
                error(`The mission you've selected required a date before max sol: ${maxSol}`, '#incorrectDateInp');

            myModul.setAttr('#date', 'class', 'form-select is-invalid');
            myModul.querySelect("#date").value = '';
            return false;
        }
        return true;
    }
//----------------------------------
    publicDataValidation.isEarthDate = (date) => {
        return date.match(/^\d{4}-\d{1,2}-\d{1,2}$/);
    }
//--------------------------------
    publicDataValidation.isSolDate = (date) => {
        return date.match(/^\d{1,4}$/);
    }
//---------------------------------
    const validDate = function (date) {
        return validationModul.isEarthDate(date) || validationModul.isSolDate(date);
    }
//--------------------------------------
    const error = function (str, incorrectInp) {
        myModul.querySelect(incorrectInp).innerHTML = str;
        myModul.setAttr(incorrectInp, "class", "alert alert-danger");
        return false;
    }
    //----------------------
    const errorCamera = function (mission, cam) {
        error(`${mission} has no ${cam} camera`, '#incorrectCamInp');
        myModul.setAttr('#camera', 'class', 'form-select is-invalid');
        myModul.querySelect("#camera").selectedIndex = 0;
        return false;
    }

    return publicDataValidation;
})();
//----------------------------//////////////////////////

//------------------------------------
const classesModul = (() => {

    const publicData = {}

    publicData.Image = class Image {
        constructor(image_src, date, id, mission, camera) {
            this.image_src = image_src;
            this.date = date;
            this.id = id;
            this.mission = mission;
            this.camera = camera;
        }

        createDiv() {
            return `
            <div>
               <div class="card  border border-5 rounded-3  mb-2" style="width: 18rem;">
                <img src=${this.image_src} class="card-img-top" alt="...">
                 <div class="card-body">
                    <p class="card-text">Date: ${this.date}</p>
                    <p class="card-text">${this.id}</p>
                    <p class="card-text">Camera: ${this.camera}</p>
                    <p class="card-text">${this.mission}</p>
                    <button class="btn btn-info ml-2 mr-2">Save</button>
                    <a href=${this.image_src} target="_blank">
                       <button class="btn btn-primary ml-2 mr-2">Full size</button>
                    </a>
                  </div>
                </div>
            </div>`;
        }
    }

    /*publicData.myImages = class {
        constructor() {
            this.list = [];
        }

        add(todo) {
            this.list.push(todo);
        }

        getLast() {
            return this.list[this.list.length-1];
        }

    }*/
    return publicData;
})();

const myModul = (() => {

    let publicData = {}
    let imgList = []
    let resList = []

    publicData.getData = async function () {
        clearForm();
        let dateInp = myModul.querySelect("#date").value.trim();
        const mission = myModul.querySelect('#mission').value;
        const cam = myModul.querySelect('#camera').value;

        let url;
        if (validationModul.isEarthDate(dateInp)) {
            const d = new Date(dateInp);
            dateInp = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
            url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?earth_date=${dateInp}&camera=${cam}&api_key=${APIKEY}`
        } else if (validationModul.isSolDate(dateInp))
            url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?sol=${dateInp}&camera=${cam}&api_key=${APIKEY}`

        if (!validationModul.correctInput(dateInp, mission, cam))
            return;

        myModul.querySelect('#loading').style.display = "block";
        myModul.querySelect("#loading").innerHTML = "<img src=https://64.media.tumblr.com/ec18887811b3dea8c69711c842de6bb9/tumblr_pabv7lGY7r1qza1qzo1_500.gifv  alt='...' >";
        myModul.setAttr('#date', 'class', 'form-control');
        myModul.setAttr('#mission', 'class', 'form-select');
        myModul.setAttr('#camera', 'class', 'form-select');

        fetch(url)
            .then(status).then(json).then(function (res) {
            console.log(res);

            res.photos.forEach(p => {
                imgList.push(new classesModul.Image(p.img_src, dateInp, p.id, mission, cam));
            });
            resList.push(res);
            displayImages();
        })
            .catch(function (err) {
                console.log("catch: " + err);
                myModul.querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to NASA server...";
            });

        myModul.setAttr('#incorrectDateInp', "class", "d-none");
        myModul.setAttr('#incorrectMissionInp', "class", "d-none");
        myModul.setAttr('#incorrectCamInp', "class", "d-none");
        myModul.querySelect("#myForm").reset(); // reset the form
    }
//----------------------------
    publicData.querySelect = function (container) {// generic func
        return document.querySelector(container);
    }
//------------------------------------
    publicData.setAttr = function (container, qualName, val) {// generic func
        myModul.querySelect(container).setAttribute(qualName, val);
    }
//--------------------------------------
    const displayImages = function () { // display list of tasks to the DOM
        myModul.querySelect('#loading').style.display = "none";
        let col1 = myModul.querySelect("#imagesOutput1");
        let col2 = myModul.querySelect("#imagesOutput2");
        let col3 = myModul.querySelect("#imagesOutput3");
        col1.innerHTML = col2.innerHTML = col3.innerHTML = ''; // clear divs

        imgList.forEach(img => {
            if (imgList.indexOf(img) % 3 === 0)
                appendCardToHtml(col1, img);
            else if (imgList.indexOf(img) % 3 === 1)
                appendCardToHtml(col2, img);
            else if (imgList.indexOf(img) % 3 === 2)
                appendCardToHtml(col3, img);
        });
    }
    //----------------------------------
    const appendCardToHtml = (where, element) => {
        where.insertAdjacentHTML('beforeend', element.createDiv()); // where.appendChild(element.createDiv());
        let bs = document.getElementsByClassName("btn btn-info ml-2 mr-2");
        bs[bs.length - 1].addEventListener('click', saveImageToList);
        //   attachListeners()
    }

    //-------------------------------------------
    /*   function attachListeners() {
           for (const b of document.getElementsByClassName("btn btn-info ml-2 mr-2"))
               b.addEventListener('click', buttonsSaveHandle);
       }*/
    //--------------------------------
    //--------------------------------
    const  createNode = function (node) {// generic func
        return document.createElement(node);
    }

    const  appendNode = function (parent, child, nameClass, inner) { // generic func
        child.className = nameClass;
        child.innerHTML = inner;
        parent.appendChild(child);
    }
//------------------------------------------------
    const clear = function (container) {
        myModul.querySelect(container).value = '';
    }
//------------------------------
    const clearForm = function () {
        // clear but not reset toe form
        clear('#incorrectDateInp');
        clear('#incorrectMissionInp');
        clear('#incorrectCamInp');
        myModul.setAttr('#incorrectDateInp', "class", "d-none");
        myModul.setAttr('#incorrectMissionInp', "class", "d-none");
        myModul.setAttr('#incorrectCamInp', "class", "d-none");
        myModul.setAttr('#date', 'class', 'form-control');
        myModul.setAttr('#mission', 'class', 'form-select');
        myModul.setAttr('#camera', 'class', 'form-select');
    }
//---------------------------------------
    const saveImageToList = function (btn) {
        const id = btn.target.parentElement.getElementsByTagName('p')[1].innerHTML;
        let exist = false;
        const savedListImg = myModul.querySelect('#infos').querySelectorAll('li');
        savedListImg.forEach(li => {
            if (li.id === id)
                exist = true;
        });
        if (exist) {
            btn.target.setAttribute('data-bs-toggle', 'modal');
            btn.target.setAttribute('data-bs-target', '#saveModal');
            btn.target.click();
            return;
        }

        resList.forEach(el => {
            el.photos.forEach(p => {
                if (id === p.id.toString())
                    createLi(p, id);
            })
        });
    }
    //-----------------------------------
    const createLi = function (p, id) {
        let li = document.createElement('li');
        li.id = id;
        li.appendChild(createLink(p, id));
        li.innerHTML += "Earth date: " + p.earth_date + ', Sol: ' + p.sol + ', Camera: ' + p.camera.name;
        myModul.querySelect('#infos').appendChild(li);
    }
//---------------------------
    const createLink = function (p, id) {
        let a = document.createElement('a');
        a.setAttribute('id', id);
        a.setAttribute('href', p.img_src);
        a.setAttribute('target', "_blank")
        a.innerHTML = "Image of: " + id + "<br>";
        return a;
    }
    //-------------------------------------

    publicData.slideShow = function () {
        let carousel = myModul.querySelect('#innerCarousel');
        let indicator = myModul.querySelect('#indicator');
        carousel.innerHTML = indicator.innerHTML = '';
        imgList.forEach(img => {
          //  carousel.insertAdjacentHTML('beforeend', createImageCarousel(img.image_src, img.camera, img.date, imgList.indexOf(img)));
            carousel.appendChild(createImageCarousel(img.image_src, img.camera, img.date, imgList.indexOf(img)));
            indicator.appendChild(createBtn(img));
        });
    }
//------------------------------------
    function createBtn (img){
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
       let nameClass;
       (index === 0) ? nameClass = "carousel-item active" : nameClass = "carousel-item";
      // myModul.querySelect('#infos').innerHTML += nameClass +"<br>";
       let div = document.createElement('div');
       div.setAttribute('class', `${nameClass}`);

       let img = document.createElement('img');
       img.setAttribute('src', img_src);
       img.setAttribute('class', 'd-block w-100');
       div.appendChild(img);

       let divCap = document.createElement('div');
       divCap.setAttribute('class', "carousel-caption d-none d-md-block")
       div.appendChild(divCap);

       let camName = document.createElement('h5');
       camName.innerHTML = cameraName;
       divCap.appendChild(camName);

       let date = document.createElement('p');
       date.innerHTML = dateMission;
       divCap.appendChild(date);

       let a = document.createElement('a');
       a.setAttribute('href', img_src);
       a.setAttribute('target', "_blank")
       appendNode(divCap, a, '', '');

       let btn = createNode('button');
       appendNode(a, btn, 'btn btn-primary ml-2 mr-2', 'Full size');

       return div;

   }


    /*  return `
         <div class=${nameClass}>
            <img src=${img_src} class="d-block w-100" alt="...">
               <div class="carousel-caption d-none d-md-block">
                         <h5>${cameraName}</h5>
                         <p>${dateMission}</p>
                         <a href=${img_src} target="_blank">
                             <button class="btn btn-primary ml-2 mr-2">Full size</button>
                          </a>
               </div>
         </div>`*/

     /*   let div = document.createElement('div');
        index === 0 ? div.setAttribute('class', 'carousel-item active')
            : div.setAttribute('class', 'carousel-item');

        let img = document.createElement('img');
        img.setAttribute('src', img_src);
        img.setAttribute('class', 'd-block w-100');
        div.appendChild(img);

        let divCap = document.createElement('div');
        divCap.setAttribute('class', "carousel-caption d-none d-md-block")
        div.appendChild(divCap);

        let camName = document.createElement('h5');
        camName.innerHTML = cameraName;
        divCap.appendChild(camName);

        let date = document.createElement('p');
        date.innerHTML = dateMission;
        divCap.appendChild(date);

        let a = document.createElement('a');
        a.setAttribute('href', img_src);
        a.setAttribute('target', "_blank")
        appendNode(divCap, a, '', '');

        let btn = createNode('button');
        appendNode(a, btn, 'btn btn-primary ml-2 mr-2', 'Full size');

        return div;
    }*/


    return publicData;
})();








////////////////////////////////////
/////////////////////////////
/*
const carouselModul = (() => {
    const publicDataCarousel = {}

//-------------------------------------
 /!*   publicDataCarousel.slideShow = function () {
        let carousel = myModul.querySelect('#innerCarousel');
        let ind = myModul.querySelect('#indicator');
        carousel.innerHTML = ind.innerHTML = '';
        myModul.getList().forEach(img => {
            carousel.appendChild(createImageCarousel(img.image, img.camera, img.date, myModul.getList().indexOf(img)));
            ind.appendChild(createBtn(img));
        });
    }

//------------------------------------
    function createBtn(img) {
        let btn = myModul.createNode('button');
        btn.setAttribute('data-bs-target', '#carousel');
        if (myModul.getList().indexOf(img) === 0) {
            btn.setAttribute('class', 'active');
            btn.setAttribute('aria-current', 'true');
        }
        btn.setAttribute('type', 'button');
        btn.setAttribute('data-bs-slide-to', myModul.getList().indexOf(img).toString());
        btn.setAttribute('aria-label', 'Slide' + myModul.getList().indexOf(img).toString());
        return btn;
    }

//---------------------------------------
    const createImageCarousel = function (img_src, cameraName, dateMission, index) {
        let div = myModul.createNode('div');
        index === 0 ? div.setAttribute('class', 'carousel-item active')
            : div.setAttribute('class', 'carousel-item');

        let img = myModul.createNode('img');
        img.setAttribute('src', img_src);
        img.setAttribute('class', 'd-block w-100');
        div.appendChild(img);

        let divCap = myModul.createNode('div');
        divCap.setAttribute('class', "carousel-caption d-none d-md-block")
        div.appendChild(divCap);

        let camName = myModul.createNode('h5');
        camName.innerHTML = cameraName;
        divCap.appendChild(camName);

        let date = myModul.createNode('p');
        date.innerHTML = dateMission;
        divCap.appendChild(date);

        let a = myModul.createNode('a');
        a.setAttribute('href', img_src);
        a.setAttribute('target', "_blank")
        myModul.appendNode(divCap, a, '', '');

        let btn = myModul.createNode('button');
        myModul.appendNode(a, btn, 'btn btn-primary ml-2 mr-2', 'Full size');

        return div;
    }*!/
    return publicDataCarousel;
})();
*/


















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

// appendTodo(col1, img);
//col1.insertAdjacentHTML('beforeend', img.createDiv());
// col1.appendChild(img.createDiv()); // inset tasks to div dom col 1


/*  let myDiv = createNode('div');
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
   appendNode(cardBody, id, 'card-text', this.id);

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

   return myDiv;*/



/*
if (index === 0){
    return `
        <div class="carousel-item active">
           <img src=${img_src} class="d-block w-100" alt="...">
              <div class="carousel-caption d-none d-md-block">
                        <h5>${cameraName}</h5>
                        <p>${dateMission}</p>
                        <a href=${img_src} target="_blank">
                            <button class="btn btn-primary ml-2 mr-2">Full size</button>
                         </a>
              </div>
        </div>
        `}
else{
    return `
        <div class="carousel-item">
           <img src=${img_src} class="d-block w-100" alt="...">
              <div className="carousel-caption d-none d-md-block">
                        <h5>${cameraName}</h5>
                        <p>${dateMission}</p>
                        <a href=${img_src} target="_blank">
                            <button class="btn btn-primary ml-2 mr-2">Full size</button>
                         </a>
              </div>
        </div>`
}*/
