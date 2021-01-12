document.addEventListener('keydown', event => {
  const audio = document.querySelector("#music");
  audio.volume = 0.1;
  audio.play();
});
