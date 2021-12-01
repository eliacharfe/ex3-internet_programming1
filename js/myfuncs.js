"use strict";

const APIKEY = 'UsppJXiLnEkRVSJzaCP92eXcCZsZAnYAyM8AomWZ';
const LOAD_IMG_SRC = "<img src=https://64.media.tumblr.com/ec18887811b3dea8c69711c842de6bb9/tumblr_pabv7lGY7r1qza1qzo1_500.gifv  alt='...' >";
var LANDING_DATE_CURIOSITY, MAX_DATE_CURIOSITY, MAX_SOL_CURIOSITY,
    LANDING_DATE_OPPORTUNITY, MAX_DATE_OPPORTUNITY, MAX_SOL_OPPORTUNITY,
    LANDING_DATE_SPIRIT, MAX_DATE_SPIRIT, MAX_SOL_SPIRIT;

document.addEventListener('DOMContentLoaded', function () {
    myModule.querySelect("#searchBtn").addEventListener("click", myModule.searchMarsPhotos);
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
(function () {
    fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity?api_key=${APIKEY}`)
        .then(status).then(json).then(function (res) {
        console.log(res);
        LANDING_DATE_CURIOSITY = res.photo_manifest.landing_date;
        MAX_DATE_CURIOSITY = res.photo_manifest.max_date;
        MAX_SOL_CURIOSITY = res.photo_manifest.max_sol;
    }).catch(function () {
        LANDING_DATE_CURIOSITY = "2012-08-06";
        MAX_DATE_CURIOSITY = "2021-11-25";
        MAX_SOL_CURIOSITY = 3302
    });
//------------------------------------
    fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Opportunity?api_key=${APIKEY}`)
        .then(status).then(json).then(function (res) {
        console.log(res);
        LANDING_DATE_OPPORTUNITY = res.photo_manifest.landing_date;
        MAX_DATE_OPPORTUNITY = res.photo_manifest.max_date;
        MAX_SOL_OPPORTUNITY = res.photo_manifest.max_sol;
    }).catch(function () {
        LANDING_DATE_OPPORTUNITY = "2004-01-25";
        MAX_DATE_OPPORTUNITY = "2018-06-11";
        MAX_SOL_OPPORTUNITY = 5111;
    });
//------------------------------------
    fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/Spirit?api_key=${APIKEY}`)
        .then(status).then(json).then(function (res) {
        console.log(res);
        LANDING_DATE_SPIRIT = res.photo_manifest.landing_date;
        MAX_DATE_SPIRIT = res.photo_manifest.max_date;
        MAX_SOL_SPIRIT = res.photo_manifest.max_sol;
    }).catch(function () {
        LANDING_DATE_SPIRIT = "2004-01-04";
        MAX_DATE_SPIRIT = "2010-03-21";
        MAX_SOL_SPIRIT = 2208;
    });
})();
//---------------------------------------
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
        mission.value = mission.value.trim();
        cam.value = cam.value.trim();

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

        return { isValid: true, message: ''}
    }
    //-------------------------------
    const setDateMissionCam = function (mission) {
        if (isCuriosity(mission)) {
            return {
                landingDate: LANDING_DATE_CURIOSITY,
                maxDate: MAX_DATE_CURIOSITY,
                maxSol: MAX_SOL_CURIOSITY
            }
        } else if (isOpportunity(mission)) {
            return {
                landingDate: LANDING_DATE_OPPORTUNITY,
                maxDate: MAX_DATE_OPPORTUNITY,
                maxSol: MAX_SOL_OPPORTUNITY,
            }
        } else if (isSpirit(mission)) {
            return {
                landingDate: LANDING_DATE_SPIRIT,
                maxDate: MAX_DATE_SPIRIT,
                maxSol: MAX_SOL_SPIRIT,
            }
        }
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
    //-------------------------
    const isCuriosity = function (mission){
        return mission === "Curiosity";
    }
    const isOpportunity = function (mission){
        return mission === "Opportunity";
    }
    const isSpirit = function (mission){
        return mission === "Spirit";
    }


    return {
        validForm: validForm,
        isEarthDate: isEarthDate,
        isSolDate: isSolDate
    }
})();
//----------------------------//////////////////////////
//  Classes Modul
const classesModule = (() => {
    const Image = class Image { // single image class
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
                    <p class="card-text">${this.id}</p>
                    <p class="card-text">Earth date: ${this.date}</p>
                    <p class="card-text">Sol: ${this.sol}</p>
                    <p class="card-text">Camera: ${this.camera}</p>
                    <p class="card-text">Mission: ${this.mission}</p>
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
    //-------------------
    //---------------------
    const ImagesList = class { // list of images class
        constructor() {
            this.list = [];
        }

        //----------
        add(img) {
            this.list.push(img);
        }

        //------------
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
            if (!this.list.length) // if there are no images ==> notify the user
                myModule.querySelect('#warning').className = "row-fluid d-block";
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

    const getURL = function (dateInp, mission, cam) {
        const roverURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?`;
        const params = new URLSearchParams();
        params.append('camera', `${cam}`);
        params.append('api_key', `${APIKEY}`);

        if (validationModule.isEarthDate(dateInp)) {
            const d = new Date(dateInp); // making for example: 2018-4-6 ==> 2018-04-06
            dateInp = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
            params.append('earth_date', `${dateInp}`);
            return roverURL + params.toString();
        } else if (validationModule.isSolDate(dateInp)) {
            params.append('sol', `${dateInp}`);
            return roverURL + params.toString();
        }
    }
    //---------------------------------
    const searchMarsPhotos = async function () {
        let dateInp = querySelect("#date");
        let mission = querySelect('#mission');
        let cam = querySelect('#camera');
        let loadingImg = querySelect('#loading');

        if (!validationModule.validForm(dateInp, mission, cam))
            return;
        // if got here the inputs are correct
        loadingImg.style.display = "block";
        loadingImg.innerHTML = LOAD_IMG_SRC;

        dateInp = dateInp.value.trim();
        mission = mission.value.trim();
        cam = cam.value.trim();

        fetch(getURL(dateInp, mission, cam))
            .then(status).then(json).then(function (res) {
            console.log(res);

            res.photos.forEach(p => {
                imgList.add(new classesModule.Image(p.img_src, dateInp, p.id, mission, cam, p.earth_date, p.sol));
            });
            imgList.generateHTML();
            addListeners();
        })
            .catch(function (err) {
                console.log("catch: " + err);
                querySelect("#imagesOutput1").innerHTML = "Sorry, cannot connect to NASA server...";
            });

        imgList.empty();
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
    const addListeners = function () {
        let buttons = document.getElementsByClassName("btn btn-info ml-2 mr-2");
        for (let btn of buttons)
            btn.addEventListener('click', saveImageToList);
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
        querySelect('#imagesOutput1').innerHTML = '';
        querySelect('#imagesOutput2').innerHTML = '';
        querySelect('#imagesOutput3').innerHTML = '';
        querySelect('#warning').className = "row-fluid d-none";
    }
    //---------------------------------------
    const saveImageToList = function (btn) {
        const id = btn.target.parentElement.getElementsByTagName('p')[0].innerHTML;
        let exist = false;
        const savedListImg = querySelect('#infos').querySelectorAll('li');
        savedListImg.forEach(li => { // check if the image user want to save is already exist
            if (li.id === id) exist = true;
        });
        if (exist) {
            btn.target.setAttribute('data-bs-toggle', 'modal');
            btn.target.setAttribute('data-bs-target', '#saveModal');
            btn.target.click();
            return;
        }
        // if the image is not saved yet
        imgList.foreach(img => {
            if (id === img.id.toString())
                createLi(img, id); // create next li with the image details and a link to full screen image mode
        })
    }
    //-----------------------------------
    const createLi = function (img, id) {
        let li = document.createElement('li');
        li.id = id;
        li.appendChild(createLink(img, id));
        li.innerHTML += "Earth date: " + img.earth_date + ', Sol: ' + img.sol + ', Camera: ' + img.camera;
        querySelect('#infos').appendChild(li);
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
        let carousel = querySelect('#innerCarousel');
        let indicator = querySelect('#indicator');
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

        let div = createNode('div');
        div.setAttribute('class', `${nameClass}`);

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

    return {
        searchMarsPhotos: searchMarsPhotos,
        querySelect: querySelect,
        setAttr: setAttr,
        slideShow: slideShow,
        resetErrors: resetErrors,
        clearOutput: clearOutput
    }
})();


// bs[bs.length - 1].addEventListener('click', saveImageToList);

// return `https://api.nasa.gov/mars-photos/api/v1/rovers/${mission}/photos?earth_date=${dateInp}&camera=${cam}&api_key=${APIKEY}`

//---------------------------
/*    const isCameraExistToMission = function (cam) {
        let mission = myModule.querySelect('#mission').value;

        if ((isCuriosity(mission) && (cam === "PANCAM" || cam === "MINITES"))
            || ((isOpportunity(mission) || isSpirit(mission)) && (cam === "MAST" || cam === "CHEMCAM" || cam === "MAHLI" || cam === "MARDI")))
            return {
                isValid: false,
                message: `${mission} has no ${cam} camera`
            }
        return {isValid: true, message: ''}
    }*/

/*if (v3 && !validateInput(cam, isCameraExistToMission))
    v = false;*/