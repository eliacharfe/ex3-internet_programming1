
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector("#getdata").addEventListener("click", getData);
}, false);

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

// returns a promise!
function json(response) {
    return response.json()
}

function getData() {

    document.querySelector("#data").innerHTML = "<img src=https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif width=\"60\" height=\"60\"> ";;

    let inp = document.getElementById('ID').value;
    //let x =  ;

    fetch('https://api.github.com/users/' + inp)

        .then(status)

        .then(res => res.json())

        /*.then(json => console.log(JSON.stringify ( json) ) )*/

        .then(json => {


            document.querySelector("#data").innerHTML = json.login + "<br>"; // remove the loading message
            document.querySelector("#data").innerHTML += json.followers;

        })
        .catch(function(err) {
            document.querySelector("#data").innerHTML = "something went wrong...try again later";
        });
}