const navLink = document.querySelector(".nav-links");
const menuBtn = document.querySelector(".menu-btn");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const leftNav = document.querySelector(".left-navigation");
const posts = document.querySelectorAll(".post");
const fileInput = document.querySelector("#file");
const image = document.querySelector("#image");
const imageContainer = document.querySelector("image-placeholder");
const defaultImage = document.querySelector(".default");
const forms = document.querySelectorAll("form");
// console.log(document.querySelector(".message"));

// forms.forEach(form=>form.addEventListener('submit',()))

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("close");
  navLink.classList.toggle("active");
});

hamburgerMenu.addEventListener("click", () => {
  hamburgerMenu.classList.toggle("close");
  leftNav.classList.toggle("active");
});

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  console.log(file);
  if (file) {
    const fileReader = new FileReader();
    defaultImage.style.display = "none";
    image.style.display = "block";
    fileReader.addEventListener("load", function () {
      image.setAttribute("src", this.result);
    });
    fileReader.readAsDataURL(file);
  } else {
    defaultImage.style.display = null;
    image.style.display = null;
    image.setAttribute("src", "");
  }
});

const revealPosts = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("hidden");
  entry.target.querySelector("img").classList.remove("blur");
  observe.unobserve(entry.target);
};

const postsObserver = new IntersectionObserver(revealPosts, {
  root: null,
  threshold: 0.15,
});
console.log(posts);
posts.forEach((post) => {
  postsObserver.observe(post);
  post.classList.add("hidden");
  post.querySelector("img").classList.toggle("blur");
});
