function scrollToFinder(){ 
    document.getElementById("finder").scrollIntoView({behavior:"smooth"}); 
}

const upload = document.getElementById("photoUpload");
const preview = document.getElementById("preview");
const makeupOverlay = document.getElementById("makeupOverlay");

upload.addEventListener("change", function(){
    const file = this.files[0];
    if(file){
        preview.src = URL.createObjectURL(file);
        preview.classList.add("show");
    }
});

function analyzeBeauty(){
    const skin = document.getElementById("skinTone").value;
    const analysis = document.getElementById("analysis");
    const after = document.getElementById("afterImage");
    const products = document.getElementById("productResults");

    if(skin === "light"){
        analysis.innerHTML = `Foundation: Ivory<br>Lipstick: Soft Pink<br>Highlight: Champagne Glow<br>Recommended Kit: Natural Glow Kit`;
        after.src = "https://images.unsplash.com/photo-1487412912498-0447578fcca8";
        products.innerHTML = `<img src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc"><img src="https://images.unsplash.com/photo-1583241800698-9cbbf91b5dcb"><img src="https://images.unsplash.com/photo-1599733589046-10c0057397d3">`;
        makeupOverlay.style.background = "rgba(255,192,203,0.25)";
    } else if(skin === "medium"){
        analysis.innerHTML = `Foundation: Warm Beige<br>Lipstick: Coral Glow<br>Highlight: Golden Radiance<br>Recommended Kit: Evening Glam Kit`;
        after.src = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9";
        products.innerHTML = `<img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad"><img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348"><img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb">`;
        makeupOverlay.style.background = "rgba(255,160,122,0.25)";
    } else if(skin === "dark"){
        analysis.innerHTML = `Foundation: Espresso<br>Lipstick: Berry Red<br>Highlight: Gold Radiance<br>Recommended Kit: Glam Kit`;
        after.src = "https://images.unsplash.com/photo-1517841905240-472988babdf9";
        products.innerHTML = `<img src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc"><img src="https://images.unsplash.com/photo-1599733589046-10c0057397d3"><img src="https://images.unsplash.com/photo-1583241800698-9cbbf91b5dcb">`;
        makeupOverlay.style.background = "rgba(128,0,128,0.25)";
    } else {
        analysis.innerHTML="Please select skin tone.";
        makeupOverlay.style.background = "transparent";
    }

    after.classList.add("show");
    makeupOverlay.classList.add("show");
}

// Fade-in animations
window.addEventListener('DOMContentLoaded', () => {
    const fadeSections = document.querySelectorAll('.fade-in');
    fadeSections.forEach((section,index)=>{
        setTimeout(()=>{ section.classList.add('show'); }, index*300);
    });

    const productCards = document.querySelectorAll('.card');
    productCards.forEach((card, index) => { setTimeout(() => { card.classList.add('show'); }, index*200); });
});

// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
});