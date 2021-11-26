"use strict";

const APIKEY = 'UsppJXiLnEkRVSJzaCP92eXcCZsZAnYAyM8AomWZ';
const LOAD_IMG_SRC = "<img src=https://64.media.tumblr.com/ec18887811b3dea8c69711c842de6bb9/tumblr_pabv7lGY7r1qza1qzo1_500.gifv  alt='...' >";
var LANDING_DATE_CURIOSITY, MAX_DATE_CURIOSITY, MAX_SOL_CURIOSITY,
    LANDING_DATE_OPPORTUNITY, MAX_DATE_OPPORTUNITY, MAX_SOL_OPPORTUNITY,
    LANDING_DATE_SPIRIT, MAX_DATE_SPIRIT, MAX_SOL_SPIRIT;

document.addEventListener('DOMContentLoaded', function () {
    myModule.querySelect("#searchBtn").addEventListener("click", myModule.getData);
    myModule.querySelect('#clearBtn').addEventListener('click', function () {
        myModule.querySelect("#myForm").reset();
        myModule.resetErrors();
        myModule.clearOutput();
    });
    myModule.querySelect('#slideShow').addEventListener('click', myModule.slideShow);
    myModule.querySelect('#stopSlideShow').addEventListener('click', function () {
        myModule.querySelect('#innerCarousel').innerHTML = '';
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
    myModule.querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
});
//------------------------------------
fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Opportunity?api_key=${APIKEY}`)
    .then(status).then(json).then(function (res) {
    console.log(res);
    LANDING_DATE_OPPORTUNITY = res.photo_manifest.landing_date;
    MAX_DATE_OPPORTUNITY = res.photo_manifest.max_date;
    MAX_SOL_OPPORTUNITY = res.photo_manifest.max_sol;
}).catch(function () {
    myModule.querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
});
//------------------------------------
fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Spirit?api_key=${APIKEY}`)
    .then(status).then(json).then(function (res) {
    console.log(res);
    LANDING_DATE_SPIRIT = res.photo_manifest.landing_date;
    MAX_DATE_SPIRIT = res.photo_manifest.max_date;
    MAX_SOL_SPIRIT = res.photo_manifest.max_sol;
}).catch(function () {
    myModule.querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to server...";
});

/*
    return publicData;
})();
*/

// Validation Modul /////////////////////
const validationModule = (() => {
    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }
    //--------------------------------------------------------
    const validForm = function (dateInp, mission, cam) {

        dateInp.value = dateInp.value.trim();
        let v1 = validateInput(dateInp, isNotEmpty);
        let v2 = validateInput(mission, isNotNullInput);
        let v3 = validateInput(cam, isNotNullInput);
        let v4;
        let v = v1 && v2 && v3;

        if (v1) {
            v4 = validateInput(dateInp, validDate);
            if (!v4) {
                dateInp.value = '';
                v = false;
            } else if (v4 && !validateInput(dateInp, isExistDate)) {
                dateInp.value = '';
                v = false;
            }
        }
        if (v2 && !validateInput(mission, validMissionDate))
            v = false;

        if (v3 && !validateInput(cam, isCameraExistToMission))
            v = false;

        return v;
    }
//---------------------------------
    const validMissionDate = function (mission) {
        let dateInp = myModule.querySelect('#date').value;
        let v = setDateMissionCam(mission);

        if (validationModule.isEarthDate(dateInp) && (dateInp < v.landingDate)) {
            return {
                isValid: false,
                message: `The mission you've selected required a date after ${v.landingDate}`
            }
        } else if (validationModule.isEarthDate(dateInp) && (dateInp > v.maxDate)) {
            return {
                isValid: false,
                message: `The mission you've selected required a date before max date: ${v.maxDate}`
            }
        } else if (validationModule.isSolDate(dateInp) && dateInp > v.maxSol) {
            return {
                isValid: false,
                message: `The mission you've selected required a date before max sol: ${v.maxSol}`
            }
        }

        return {isValid: true, message: ''}
    }
    //-------------------------------
    const setDateMissionCam = function (mission) {
        if (mission === "Curiosity") {
            return {
                landingDate: LANDING_DATE_CURIOSITY,
                maxDate: MAX_DATE_CURIOSITY,
                maxSol: MAX_SOL_CURIOSITY
            }
        } else if (mission === "Opportunity") {
            return {
                landingDate: LANDING_DATE_OPPORTUNITY,
                maxDate: MAX_DATE_OPPORTUNITY,
                maxSol: MAX_SOL_OPPORTUNITY,
            }
        } else if (mission === "Spirit") {
            return {
                landingDate: LANDING_DATE_SPIRIT,
                maxDate: MAX_DATE_SPIRIT,
                maxSol: MAX_SOL_SPIRIT,
            }
        }
    }
    //---------------------------
    const isCameraExistToMission = function (cam) {
        let mission = myModule.querySelect('#mission').value;

        if ((mission === "Curiosity" && (cam === "PANCAM" || cam === "MINITES"))
            || ((mission === "Opportunity" || mission === "Spirit") && (cam === "MAST" || cam === "CHEMCAM" || cam === "MAHLI" || cam === "MARDI")))
            return {
                isValid: false,
                message: `${mission} has no ${cam} camera`
            }
        return {isValid: true, message: ''}
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
        return {
            isValid: (validationModule.isEarthDate(date) || validationModule.isSolDate(date)),
            message: 'Please enter a valid format of date'
        };
    }
    //---------------------------------
    const isExistDate = function (date) {
        let d = new Date(date);
        return {
            isValid: d instanceof Date && !isNaN(d.getTime()),
            message: 'This date does not exist'
        }
    }
    //-------------------------------------
    const isNotEmpty = function (str) {
        return {
            isValid: (str.length !== 0),
            message: 'Input is required here'
        };
    }
    //----------------------------------------
    const isNotNullInput = function (str) {
        return {
            isValid: (str !== "Choose a mission" && str !== "Choose a camera"),
            message: 'Input is required here'
        }
    }

    return {
        validForm: validForm,
        isEarthDate: isEarthDate,
        isSolDate: isSolDate
    }
})();
//----------------------------//////////////////////////
//------------------------------------
const classesModule = (() => {
    const Image = class Image {
        constructor(image_src, date, id, mission, camera, earth_date, sol) {
            this.image_src = image_src;
            this.date = date;
            this.id = id;
            this.mission = mission;
            this.camera = camera;
            this.earth_date = earth_date;
            this.sol = sol;
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

        //----------------------------------
        appendCardToHtml = (where, element) => {
            where.insertAdjacentHTML('beforeend', element.createDiv()); // where.appendChild(element.createDiv());
        }
    }

    const ImagesList = class {
        constructor() {
            this.list = [];
        }

        add(img) {
            this.list.push(img);
        }

        indexOf(i) {
            return this.list.indexOf(i);
        }

        //----------------
        foreach = function (callback) {
            if (callback && typeof callback === 'function') {
                for (let i = 0; i < this.list.length; i++) {
                    callback(this.list[i], i, this.list);
                }
            }
        };

        //------------
        empty() {
            this.list = []
        }

        //----------------------------------
        generateHTML() {
            myModule.querySelect('#loading').style.display = "none";
            let col1 = myModule.querySelect("#imagesOutput1");
            let col2 = myModule.querySelect("#imagesOutput2");
            let col3 = myModule.querySelect("#imagesOutput3");
            myModule.clearOutput();// clear output divs

            this.list.forEach(img => {
                if (this.list.indexOf(img) % 3 === 0)
                    img.appendCardToHtml(col1, img);
                else if (this.list.indexOf(img) % 3 === 1)
                    img.appendCardToHtml(col2, img);
                else if (this.list.indexOf(img) % 3 === 2)
                    img.appendCardToHtml(col3, img);
            });
        }
    }
    return {
        Image: Image,
        ImagesList: ImagesList
    }
})();
//--------------------------------------------------
const myModule = (() => {
    let imgList = new classesModule.ImagesList();

    const getData = function () {
        //  clearForm();
        let dateInp = myModule.querySelect("#date");
        let mission = myModule.querySelect('#mission');
        let cam = myModule.querySelect('#camera');
        let loadingImg = myModule.querySelect('#loading');

        if (!validationModule.validForm(dateInp, mission, cam))
            return;

        let url;
        dateInp = dateInp.value.trim();
        mission = mission.value;
        cam = cam.value;
        if (validationModule.isEarthDate(dateInp)) {
            const d = new Date(dateInp);
            dateInp = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2)
                + '-' + ('0' + d.getDate()).slice(-2);
            url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?earth_date=${dateInp}&camera=${cam}&api_key=${APIKEY}`
        } else if (validationModule.isSolDate(dateInp))
            url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?sol=${dateInp}&camera=${cam}&api_key=${APIKEY}`

        // resetInputs();
        loadingImg.style.display = "block";
        loadingImg.innerHTML = LOAD_IMG_SRC;

        fetch(url)
            .then(status).then(json).then(function (res) {
            console.log(res);

            /*     if (res.photos.length == 0)
                     myModule.querySelect('#imagesOutput1').innerHTML = "No images found"*/

            res.photos.forEach(p => {
                imgList.add(new classesModule.Image(p.img_src, dateInp, p.id, mission, cam, p.earth_date, p.sol));
            });
            imgList.generateHTML()
            addListeners();
        })
            .catch(function (err) {
                console.log("catch: " + err);
                myModule.querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to NASA server...";
            });

        //  resetErrors();
        imgList.empty();
        myModule.querySelect("#myForm").reset(); // reset the form
    }
//----------------------------
    const querySelect = function (container) {// generic func
        return document.querySelector(container);
    }
//------------------------------------
    const setAttr = function (container, qualName, val) {// generic func
        myModule.querySelect(container).setAttribute(qualName, val);
    }
    //--------------------------------------
    const addListeners = function () {
        let bs = document.getElementsByClassName("btn btn-info ml-2 mr-2");
        // bs[bs.length - 1].addEventListener('click', saveImageToList);
        for (let b of bs) {
            b.addEventListener('click', saveImageToList);
        }
    }
    //--------------------------------
    const createNode = function (node) {// generic func
        return document.createElement(node);
    }
    //-----------------
    const appendNode = function (parent, child, nameClass, inner) { // generic func
        child.className = nameClass;
        child.innerHTML = inner;
        parent.appendChild(child);
    }
    //---------------------
    const resetErrors = function () {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }
    //-----------------------------
    const clearOutput = function () {
        myModule.querySelect('#imagesOutput1').innerHTML = '';
        myModule.querySelect('#imagesOutput2').innerHTML = '';
        myModule.querySelect('#imagesOutput3').innerHTML = '';
    }
    //---------------------------------------
    const saveImageToList = function (btn) {
        const id = btn.target.parentElement.getElementsByTagName('p')[1].innerHTML;
        let exist = false;
        const savedListImg = myModule.querySelect('#infos').querySelectorAll('li');
        savedListImg.forEach(li => {
            if (li.id === id) exist = true;
        });
        if (exist) {
            btn.target.setAttribute('data-bs-toggle', 'modal');
            btn.target.setAttribute('data-bs-target', '#saveModal');
            btn.target.click();
            return;
        }

        imgList.foreach(img => {
            if (id === img.id.toString())
                createLi(img, id);
        })
    }
    //-----------------------------------
    const createLi = function (img, id) {
        let li = document.createElement('li');
        li.id = id;
        li.appendChild(createLink(img, id));
        li.innerHTML += "Earth date: " + img.earth_date + ', Sol: ' + img.sol + ', Camera: ' + img.camera;
        myModule.querySelect('#infos').appendChild(li);
    }
    //---------------------------
    const createLink = function (img, id) {
        let a = document.createElement('a');
        a.setAttribute('id', id);
        a.setAttribute('href', img.image_src);
        a.setAttribute('target', "_blank")
        a.innerHTML = "Image of: " + id + "<br>";
        return a;
    }
    //-------------------------------------
    //-------------------------------------
    const slideShow = function () {
        let carousel = myModule.querySelect('#innerCarousel');
        let indicator = myModule.querySelect('#indicator');
        carousel.innerHTML = indicator.innerHTML = '';

        imgList.foreach(img => {
            //  carousel.insertAdjacentHTML('beforeend', createImageCarousel(img.image_src, img.camera, img.date, imgList.indexOf(img)));
            carousel.appendChild(createImageCarousel(img.image_src, img.camera, img.date, imgList.indexOf(img)));
            indicator.appendChild(createBtn(img));
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
        let nameClass;
        (index === 0) ? nameClass = "carousel-item active" : nameClass = "carousel-item";
        // myModule.querySelect('#infos').innerHTML += nameClass +"<br>";
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

    return {
        getData: getData,
        querySelect: querySelect,
        setAttr: setAttr,
        slideShow: slideShow,
        resetErrors: resetErrors,
        clearOutput: clearOutput
    }
})();


/*    myModule.querySelect('#mission').addEventListener('click', function () {
        myModule.setAttr('#date', 'class', 'form-control');
        myModule.setAttr('#incorrectDateInp', "class", "d-none");
    });
    myModule.querySelect('#camera').addEventListener('click', function () {
        myModule.setAttr('#date', 'class', 'form-control');
        myModule.setAttr('#incorrectDateInp', "class", "d-none");
    });*/


/* if (!v)
     return false;*/

/*        if (dateInp === '')
             error('Input is required here', '#incorrectDateInp', '#date', 'form-control is-invalid', v);
        if (mission === "Choose a mission")
            error('Input is required here', '#incorrectMissionInp', '#mission', 'form-select is-invalid');
        if (cam === "Choose a camera")
             error('Input is required here\n', '#incorrectCamInp', '#camera', 'form-select is-invalid');

        if (!validDate(dateInp))
            error('Please enter a valid format of date\n', "#incorrectDateInp", '#date', 'form-control is-invalid');
        if (!isExistDate(dateInp))
             error("This date does not exist", "#incorrectDateInp", '#date', 'form-control is-invalid');


        let landingDate, maxDate, maxSol;




        return validMissionCamDate(landingDate, maxDate, maxSol, dateInp);*/
//return  v;

// return error(`The mission you've selected required a date after ${v.landingDate}`, '#incorrectDateInp', '#date', 'form-control is-invalid');
//else if (validationModule.isEarthDate(dateInp) && (dateInp > v.maxDate))
//      return error(`The mission you've selected required a date before max date: ${v.maxDate}`, '#incorrectDateInp', '#date', 'form-control is-invalid');
//  else if (validationModule.isSolDate(dateInp) && dateInp > v.maxSol)
//     return error(`The mission you've selected required a date before max sol: ${v.maxSol}`, '#incorrectDateInp', '#date', 'form-control is-invalid');


//------------------------------------------------
/*    const clear = function (container) {
        myModule.querySelect(container).value = '';
    }*/
//------------------------------
/*  const clearForm = function () {
      // clear but not reset toe form
      clear('#incorrectDateInp');
      clear('#incorrectMissionInp');
      clear('#incorrectCamInp');
      resetInputs();
      resetErrors()
  }*/
/*    //------------------------------------
    const resetInputs = function () {
        myModule.setAttr('#date', 'class', 'form-control');
        myModule.setAttr('#mission', 'class', 'form-select');
        myModule.setAttr('#camera', 'class', 'form-select');
    }*/

//--------------------------------------
/*    const error = function (str, incorrectInp, formInp, what, v) {
        myModule.querySelect(incorrectInp).innerHTML += str;
        myModule.setAttr(incorrectInp, "class", "alert alert-danger");
        myModule.setAttr(formInp, 'class', what);
        myModule.querySelect(formInp).value = '';
        v = false
        // return false;
    }
    //----------------------
    const errorCamera = function (mission, cam) {
        myModule.setAttr('#camera', 'class', 'form-select is-invalid');
        myModule.querySelect("#camera").selectedIndex = 0;
        error(`${mission} has no ${cam} camera`, '#incorrectCamInp');
    }*/