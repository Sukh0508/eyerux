// navbar.js - Complete navbar solution

// Insert navbar HTML
document.addEventListener('DOMContentLoaded', function () {
    const navbarHTML = `
    <nav class="navbar">
        <div class="logo"></div>
        <div class="nav-links" id="navLinks">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="product.html">Products</a>
            <a href="servicespage.html">Services</a>
            <a href="Subsidiaries.html">Subsidiaries</a>
            <a href="indus.html">Industries</a>
            <a href="carrer.html">Careers</a>
            <a href="contact.html">Contact</a>
            <a href="https://healthcare.eyerexus.com/"><button>Health Care</button></a>
        </div>
        <div class="menu-toggle" id="menuToggle"><i class="fas fa-bars"></i></div>
    </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // Active link highlight
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

});