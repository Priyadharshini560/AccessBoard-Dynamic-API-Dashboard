
const themeButton = document.querySelector("#theme-toggle");

// Load saved theme
const savedTheme = localStorage.getItem("accessboard-theme") || "light";

document.documentElement.setAttribute("data-theme", savedTheme);

// Toggle and save theme
if (themeButton) {
    themeButton.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const newTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);

        localStorage.setItem("accessboard-theme", newTheme);
    });
}
