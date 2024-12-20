addEventListener("submit", (event) => {
    event.preventDefault();

    var form = document.forms.FormCreateConfig;
    const formData = new FormData(form);

    localStorage.setItem('hands', formData.get('hands'));
    localStorage.setItem('fingers', formData.get('fingers'));
    localStorage.setItem('mode', formData.get('mode'));
    localStorage.setItem('exercises', formData.get('exercises'));



//    const entries = Object.fromEntries(formData.entries());
//    localStorage.setItem('hands', entries['hands']);
//    localStorage.setItem('fingers', entries['fingers']);
//    localStorage.setItem('mode', entries['mode']);
//    localStorage.setItem('exercises', entries['exercises']);
});
