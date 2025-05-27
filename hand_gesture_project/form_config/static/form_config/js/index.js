document.addEventListener('DOMContentLoaded', async function() {
  addEventListener("submit", (event) => {
    event.preventDefault();
    const form = document.forms.FormCreateConfig;
    const formData = new FormData(form);

    ['hands', 'fingers', 'mode', 'exercises'].forEach(field => {
      localStorage.setItem(field, formData.get(field));
    });
  });
});

//addEventListener("submit", (event) => {
//    event.preventDefault();
//
//    var form = document.forms.FormCreateConfig;
//    const formData = new FormData(form);
//
//    localStorage.setItem('hands', formData.get('hands'));
//    localStorage.setItem('fingers', formData.get('fingers'));
//    localStorage.setItem('mode', formData.get('mode'));
//    localStorage.setItem('exercises', formData.get('exercises'));
//});
