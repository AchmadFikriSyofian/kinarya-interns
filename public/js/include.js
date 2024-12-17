function includeHMTL () {
    const elements = document.querySelectorAll("[data-include]");
    elements.forEach((el) => {
        const file = el.getAttribute("data-include");
        if (file) {
            fetch(file)
            .then((response) => {
                if(!response.ok) throw new Error(`Cannot fetch ${file}`);
                return response.text();
            })
            .then((html) => {
                el.innerHTML = html;
                el.removeAttribute("data-include");
                includeHMTL();
            })
            .catch((error) => console.error(error));
        }
    });
}

document.addEventListener("DOMContentLoaded", includeHMTL);