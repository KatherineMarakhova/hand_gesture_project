const form = document.getElementById('form-create-config');

function retrieveFormValue(event){
    event.preventDefault();

    const formData = new FormData(form);
    const entries = Object.fromEntries(formData.entries());
    const values = Object.values(formData.values())

    console.log(">>", entries);
    for (const value of formData.values()) {
        console.log(value);
    }
//    localStorage.setItem('finger-numbers');
}

form.addEventListener('submit', retrieveFormValue);