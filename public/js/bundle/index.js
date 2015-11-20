const $ = document.querySelector.bind(document);
const acpt = $('[name="acpt"]').getAttribute('content');

console.log(`Token is: ${acpt}`);
