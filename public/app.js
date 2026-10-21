const form=document.querySelector('#request-form');
const endpoint=document.querySelector('#endpoint');
const baseUrl=`${window.location.origin}`;
document.querySelector('#base-url').textContent=baseUrl;
const directLink=document.querySelector('#direct-link');
function syncUrl(){const value=endpoint.value.trim();const path=value.startsWith('/')?value:`/${value}`;directLink.href=path;directLink.textContent=`${baseUrl}${path}`;}
endpoint.addEventListener('input',syncUrl);
document.querySelectorAll('[data-endpoint]').forEach(button=>button.addEventListener('click',()=>{endpoint.value=button.dataset.endpoint;syncUrl();form.requestSubmit();}));
form.addEventListener('submit',async event=>{event.preventDefault();syncUrl();const url=new URL(directLink.href);const output=document.querySelector('#response-json');const meta=document.querySelector('#response-meta');const title=document.querySelector('#result-title');output.textContent='Consultando…';meta.textContent='En curso';title.textContent=url.pathname;try{const response=await fetch(url);const body=await response.json();output.textContent=JSON.stringify(body,null,2);meta.textContent=`${response.status} ${response.statusText}`;}catch(error){output.textContent=JSON.stringify({error:'No se pudo consultar la API',detail:error.message},null,2);meta.textContent='Error de conexión';}});
syncUrl();
form.requestSubmit();
