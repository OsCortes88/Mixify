const container = document.querySelector('.containerScroll');
const scrollButtons = document.querySelectorAll('.scrollButton');

const scrollDistance = 500; // Adjust this value to change the scroll distance

scrollButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const direction = button.classList.contains('left') ? -1 : 1;
    container.scrollBy({
      left: direction * scrollDistance,
      behavior: 'smooth'
    });
  });
});

const container2 = document.querySelector('.containerScroll2');
const scrollButtons2 = document.querySelectorAll('.scrollButton2');

scrollButtons2.forEach(function(button) {
  button.addEventListener('click', function() {
    const direction = button.classList.contains('left') ? -1 : 1;
    container2.scrollBy({
      left: direction * scrollDistance,
      behavior: 'smooth'
    });
  });
});


const container3 = document.querySelector('.containerScroll3');
const scrollButtons3 = document.querySelectorAll('.scrollButton3');

scrollButtons3.forEach(function(button) {
  button.addEventListener('click', function() {
    const direction = button.classList.contains('left') ? -1 : 1;
    container3.scrollBy({
      left: direction * scrollDistance,
      behavior: 'smooth'
    });
  });
});

const container4 = document.querySelector('.containerScroll4');
const scrollButtons4 = document.querySelectorAll('.scrollButton4');

scrollButtons4.forEach(function(button) {
  button.addEventListener('click', function() {
    const direction = button.classList.contains('left') ? -1 : 1;
    container4.scrollBy({
      left: direction * scrollDistance,
      behavior: 'smooth'
    });
  });
});