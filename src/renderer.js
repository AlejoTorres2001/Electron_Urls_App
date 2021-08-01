var request = require("request");
//DOM
const linksection = document.querySelector(".links");
const error_message = document.querySelector(".error-message");
const link_form = document.querySelector(".new-link-form");
const link_button = document.querySelector(".new-link-button");
const clear_storage_button = document.querySelector(".clear-storage");
const link_url = document.querySelector(".new-link-url");

//DOM API
const parser = new DOMParser();
const {shell}=require('electron')
const parserResponse = (text) => {
  return parser.parseFromString(text, "text/html");
};
const FindTitle = (html_nodes) => {
  return html_nodes.querySelector("title").innerText;
};

const StoreLink = (title, url) => {
  localStorage.setItem(url, JSON.stringify({ title, url }));
};
const GetLinks = () => {
  const keys = Object.keys(localStorage);
  return keys.map((key) => JSON.parse(localStorage.getItem(key)));
};
const CreateLinkElement = (link) => {
  return `
    <div class="container">
    <h3 class="title">
        ${link.url}
    </h3>
    <p>
        <a class="link-primary" href="${link.title}">${link.title}</a>
    </p>
</div>
    `;
};
const RenderLinks = () => {
  const links_elements = GetLinks().map(CreateLinkElement).join();
  linksection.innerHTML = links_elements;
};
const errorHandler = (error, link) => {
  console.error(
    `no se pudo acceder a la pagina ${link} debido al error ${error}`
  );
  error_message.innerHTML = `<div class="container">
      <h5 class="alert-danger bg-dark">Error la pagina ${link} no fue encontrada!</h5>
  </div>`;
};

RenderLinks();
link_url.addEventListener("keyup", () => {
  link_button.disabled = !link_url.validity.valid;
});
link_form.addEventListener("submit", async (e) => {
  var html;
  e.preventDefault();
  request({ uri: link_url.value }, function (error, response, body) {
    if (error) {
      errorHandler(error, link_url.value);
    } else {
      error_message.innerHTML = "";
      html = parserResponse(body);
      const title = FindTitle(html);
      StoreLink(link_url.value, title);
      RenderLinks();
    }
  });
});
clear_storage_button.addEventListener("click", () => {
  error_message.innerHTML = "";
  localStorage.clear();
  RenderLinks();
  link_url.value = "";
});
linksection.addEventListener('click',(e)=>{

    if(e.target.href){
        e.preventDefault()
        shell.openExternal(e.target.href)
    }
})
