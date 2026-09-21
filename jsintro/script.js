//VARIABLES


let slideNumber = 1;
const slideTotal = 2567998;


const slideStartNumberElement = document.getElementById('slide');

const slideEndNumberElement = document.getElementById('slideTotal');

const slideButtonElement = document.getElementById('slideButton');

const previousSlideButtonElement = document.getElementById('slidePrevious');

const projectorElement = document.getElementById('projector');

let isEndOfSlide = false;

document.addEventListener('DOMContentLoaded', function(){
    slideStartNumberElement.textContent = slideNumber;
    slideEndNumberElement.textContent = slideTotal;
});


function checkEndofSlide(slideNumber){

    if(slideNumber == slideTotal){
        return true
    } else{
        return false
    }
}


function goToNextSlide(){

    if (slideNumber < slideTotal){
        slideNumber ++;
        slideStartNumberElement.textContent = slideNumber;

        isEndofSlide = checkEndofSlide(slideNumber);

        if(isEndofSlide){
            projectorElement.textContent = "You are at the end of this slide, thank you";
        }


    console.log('Current slide number is', slideNumber);

    } else{

        console.log('You cant increase');
    }

    

}

function gotToPrevoisSlide(){

    if (slideNumber > 1){
        slideNumber --;
        slideStartNumberElement.textContent = slideNumber;

        isEndofSlide = checkEndofSlide(slideNumber);

        if(isEndofSlide){
            projectorElement.textContent = "You are at the end of this slide, thank you";
        }


    console.log('Current slide number is', slideNumber);

    } else{

        console.log('You cant increase');
    }

    

}

slideButtonElement.addEventListener("click", goToNextSlide);

previousSlideButtonElement.addEventListener('click', gotToPrevoisSlide);
