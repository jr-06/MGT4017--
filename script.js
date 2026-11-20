const $ = (selector, parent=document) => parent.querySelector(selector);
const $$ = (selector, parent=document) => [...parent.querySelectorAll(selector)];
let bag = JSON.parse(localStorage.getItem("cloverBag") || "[]");

function saveBag(){ localStorage.setItem("cloverBag", JSON.stringify(bag)); renderBag(); }
function renderBag(){
  $("#bag-count").textContent = bag.reduce((sum,item)=>sum+item.qty,0);
  const list=$("#bag-items");
  if(!bag.length){list.innerHTML="<p>Your bag is empty.</p>";}
  else{
    list.innerHTML=bag.map((item,index)=>`<div class="bag-row"><div><strong>${escapeHtml(item.name)}</strong><br><small>£${item.price.toFixed(2)} × ${item.qty}</small></div><button data-remove="${index}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button></div>`).join("");
  }
  $("#bag-total").textContent="£"+bag.reduce((sum,item)=>sum+item.price*item.qty,0).toFixed(2);
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));}
function addItem(name,price,extra=""){
  const fullName=extra?`${name} (${extra})`:name;
  const found=bag.find(item=>item.name===fullName);
  if(found) found.qty++; else bag.push({name:fullName,price:Number(price),qty:1});
  saveBag(); openBag();
}
function openBag(){ $("#bag-drawer").classList.add("open");$("#bag-drawer").setAttribute("aria-hidden","false");$("#drawer-backdrop").classList.add("show"); }
function closeBag(){ $("#bag-drawer").classList.remove("open");$("#bag-drawer").setAttribute("aria-hidden","true");$("#drawer-backdrop").classList.remove("show"); }

$$(".add-to-bag").forEach(button=>button.addEventListener("click",()=>{
  const name=button.dataset.name, price=button.dataset.price;
  let extra="";
  if(name.includes("flower bouquet")){const id=name.startsWith("Mini")?"mini-colour":"deluxe-colour";extra=$("#"+id).value;}
  if(name==="Personalised name mug")extra=$("#mug-name").value.trim()||"Name not entered";
  if(name==="Personalised photo mug")extra=$("#photo-name").value.trim()||"Name not entered";
  if(name==="Birthday card")extra=$("#birthday-message").value.trim();
  if(name==="Congratulations card")extra=$("#congrats-message").value.trim();
  addItem(name,price,extra);
}));
$("#add-box").addEventListener("click",()=>addItem("Sweet moments gift box",$("#box-size").value,$("#box-message").value.trim()));
$("#add-custom-box").addEventListener("click",()=>{
  const products=$$('input[type="checkbox"]:checked').map(el=>el.value).join(", ")||"No products selected";
  addItem("Personalised gift box",$("#custom-size").value,products+"; "+($("#custom-message").value.trim()||"No message"));
});
$("#bag-open").addEventListener("click",openBag);$("#bag-close").addEventListener("click",closeBag);$("#drawer-backdrop").addEventListener("click",closeBag);
$("#bag-items").addEventListener("click",event=>{const button=event.target.closest("[data-remove]");if(button){bag.splice(Number(button.dataset.remove),1);saveBag();}});
$("#checkout-button").addEventListener("click",()=>alert("This is a website prototype. Online checkout and payment are not connected yet."));
$("#box-message").addEventListener("input",event=>$("#box-preview").textContent=event.target.value||"Your words will appear here");
$("#custom-message").addEventListener("input",event=>$("#custom-preview").textContent=event.target.value||"Your words will appear here");
$("#contact-form").addEventListener("submit",event=>{event.preventDefault();$("#contact-feedback").textContent="Thank you! Your message has been recorded in this demo.";event.target.reset();});
$("#menu-toggle").addEventListener("click",()=>{const header=$(".site-header");const opened=header.classList.toggle("nav-open");$("#menu-toggle").setAttribute("aria-expanded",String(opened));});
$$(".nav-left a,.nav-right a").forEach(link=>link.addEventListener("click",()=>{$(".site-header").classList.remove("nav-open");$("#menu-toggle").setAttribute("aria-expanded","false");}));
renderBag();
