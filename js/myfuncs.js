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
    /** a function that get an input element and a validation function and if the func return false ==> show message
     * @param inputElement - the input element from the form
     * @param validateFunc - a function that validate a specific validation according to the input element sent
     * @returns {boolean|*} - return true if validation is OK (with the particular function and the input sent), else false */
    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }
    //--------------------------------------------------------
    /** a function that validate the input elements - if all validation are correct ==> return true, else false
     * @param dateInp - get the input that includes the date
     * @param mission - get the input that includes the rover
     * @param cam - get the input that includes the camera
     * @returns {boolean*} - return true or false */
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
    /** a validation function that get the rover and validate its date (according to the date input)
     * @param mission - the input element that includes the rover
     * @returns {{isValid: boolean, message: string}} - return a boolean and a message in case validation failed */
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
    /** returns accurate data dates of the mission selected (according to the 3 start fetches)
     * @param mission - the input element that includes the rover
     * @returns {{maxSol, maxDate, landingDate}} - return data dates of the specific rover input */
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
    /** check if the date input has the format yyyy-mm-dd
     * @param date - the input element that includes the date
     * @returns {*} - return true or false */
    const isEarthDate = (date) => {
        return date.match(/^\d{4}-\d{1,2}-\d{1,2}$/);
    }
    //--------------------------------
    /** check if the date input has the format of a Sol mars day
     * @param date - the input element that includes the date
     * @returns {*} - return true or false */
    const isSolDate = (date) => {
        return date.match(/^\d{1,4}$/);
    }
    //---------------------------------
    /** check if the date is a valid format date
     * @param date  - the input element that includes the date
     * @returns {{isValid: *, message: string}} - return a boolean and a message in case validation failed */
    const validDate = function (date) {
        return {
            isValid: (validationModule.isEarthDate(date) || validationModule.isSolDate(date)),
            message: 'Please enter a valid format of date'
        };
    }
    //---------------------------------
    /** check if the date exist at all (for example 2015-13-22 is not a valid date because there is no 13th month)
     * assuming it has already the correct format
     * @param date - the input element that includes the date
     * @returns {{isValid: boolean, message: string}} - return a boolean and a message in case validation failed */
    const isExistDate = function (date) {
        let d = new Date(date);
        return {
            isValid: d instanceof Date && !isNaN(d.getTime()),
            message: 'This date does not exist'
        }
    }
    //-------------------------------------
    /** check if the input is not empty
     * @param str - the string to validate
     * @returns {{isValid: boolean, message: string}} - return a boolean and a message in case validation failed */
    const isNotEmpty = function (str) {
        return {
            isValid: (str.length !== 0),
            message: 'Input is required here'
        };
    }
    //----------------------------------------
    /** check if the user didnt selected from the form selection
     * @param str - the string to validate
     * @returns {{isValid: boolean, message: string}} - return a boolean and a message in case validation failed */
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
        /** create new object according to mars photo got at the fetch
         * @param image_src - the image source
         * @param date - the date of the image
         * @param id - the image's ID
         * @param mission - the rover
         * @param camera - the camera
         * @param earth_date - the image's earth date
         * @param sol - the image's sol */
        constructor(image_src, date, id, mission, camera, earth_date, sol) {
            this.image_src = image_src;
            this.date = date;
            this.id = id;
            this.mission = mission;
            this.camera = camera;
            this.earth_date = earth_date;
            this.sol = sol;
        }

        /** @returns {string} - return a div that includes a card with an image and its details */
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
        /** append a card to the dom
         * @param where - which div output to append the card
         * @param element - the element at the list */
        appendCardToHtml = (where, element) => {
            where.insertAdjacentHTML('beforeend', element.createDiv());
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
        /** implementation of the known js loop "forEach" (doing that because the data structure is protected
         * to the "outside world" and generic)
         * @param callback - return the element of the data structure */
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
        /** displays the photos at the DOM */
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

    /** create a URL to fetch according to the inputs data
     * @param dateInp  - the input element that includes the date
     * @param mission  - the input element that includes the rover
     * @param cam  - the input element that includes the camera
     * @returns {string} - the correct URL to fetch */
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
    /** This function is the main function that do the fetch to get the mars's photos according to the inputs,
     * but will not do the fetch before the validation is correct (if validation is not correct then returns
     * immediately and not executing the fetch).
     * @returns {Promise<void>} */
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

        imgList.empty(); // will empty the list
    }
//----------------------------
    /** for more readable syntax
     * @param container - get an #id
     * @returns {*} - returns selector with the particular id sent */
    const querySelect = function (container) {
        return document.querySelector(container);
    }
//
    /** set attribute to a DOM object
     * @param container - get an #id
     * @param qualName - get a qualified name (class, href, etc)
     * @param val - get the value we want to insert */
    const setAttr = function (container, qualName, val) {
        querySelect(container).setAttribute(qualName, val);
    }
    //--------------------------------------
    /** add listeners to the save buttons of the DOM inserted photos (every card has a such button) */
    const addListeners = function () {
        let buttons = document.getElementsByClassName("btn btn-info ml-2 mr-2");
        for (let btn of buttons)
            btn.addEventListener('click', saveImageToList);
    }
    //--------------------------------
    /** creates a DOM element
     * @param node - a tag
     * @returns {*} - returns a created element with the particular tag sent */
    const createNode = function (node) {
        return document.createElement(node);
    }
    //-----------------
    /** set the child and append him to the parent sent
     * @param parent - get the parent node
     * @param child - get the child node
     * @param nameClass - the class name we want to insert to the child
     * @param inner - the innerHTML we want to insert to the child */
    const appendNode = function (parent, child, nameClass, inner) {
        child.className = nameClass;
        child.innerHTML = inner;
        parent.appendChild(child);
    }
    //---------------------
    /** reset errors to none errors */
    const resetErrors = function () {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }
    //-----------------------------
    /** clear the outputs of the DOM */
    const clearOutput = function () {
        querySelect('#imagesOutput1').innerHTML = '';
        querySelect('#imagesOutput2').innerHTML = '';
        querySelect('#imagesOutput3').innerHTML = '';
        querySelect('#warning').className = "row-fluid d-none";
    }
    //---------------------------------------
    /** save an image and its details at the list of saved images (only if that image is not saved yet)
     * @param btn - the button pressed (a Save button of a card element at the DOM) */
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
    /**create a new "li" with the image's detail
     * @param img - an element that includes details of an image
     * @param id - the "button id" (note that the button id is the same of the image id because we take the first child of the card that includes the photo id) */
    const createLi = function (img, id) {
        let li = document.createElement('li');
        li.id = id;
        li.appendChild(createLink(img, id));
        li.innerHTML += "Earth date: " + img.earth_date + ', Sol: ' + img.sol + ', Camera: ' + img.camera;
        querySelect('#infos').appendChild(li);
    }
    //---------------------------
    /** creates a link to a full screen mode image in a new tab at the browser */
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
    /** implementing the carousel of the photos */
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
    /** creates a button to the carousel
     * @param img - the image element
     * @returns {*} - return the button to insert to the indicator DOM element */
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
    /** creates the image for append in the carousel
     * @param img_src - the image's source
     * @param cameraName - the camera name
     * @param date - the date
     * @param index - the index of the element
     * @returns {*} - return the div to append to the DOM */
    const createImageCarousel = function (img_src, cameraName, date, index) {
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

        let d = createNode('p');
        d.innerHTML = date;
        divCap.appendChild(d);

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