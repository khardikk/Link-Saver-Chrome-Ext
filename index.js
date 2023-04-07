let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
const tabBtn = document.getElementById("tab-btn");

function addDeleteEvents() {
  const deleteLinks = document.getElementsByClassName("delete-link");
  for (var i = 0; i < deleteLinks.length; i++) {
    deleteLinks[i].addEventListener("click", deleteLink);
  }
}
function addCopyLinkEvent() {
  const copyLinks = document.getElementsByClassName("copy-link");
  for (var i = 0; i < copyLinks.length; i++) {
    copyLinks[i].addEventListener("click", copyLink);
  }
}

function copyLink(event) {
  const copyLinkPosition = event.target.getAttribute("data-position");
  let data = JSON.parse(localStorage.getItem("myLeads"));
  let link = data[parseInt(copyLinkPosition)];
  navigator.clipboard.writeText(link);
  //change button text to copied do some animation

  const button = event.target;
  button.textContent = "Copied!";
  button.classList.add("copied");
}

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
});

function deleteLink(event) {
  let response = window.confirm("Are you sure, You want to delete ?");
  if (response) {
    const deleteElementPosition = event.target.getAttribute("data-position");
    let data = JSON.parse(localStorage.getItem("myLeads"));
    data.splice(parseInt(deleteElementPosition), 1);
    localStorage.setItem("myLeads", JSON.stringify(data));
    render(data);
    myLeads = data;
  }
}

function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                  
                </a>
                <button class='delete-link'  data-position='${i}'> X </button>
                <button class='copy-link'  data-position='${i}'> Copy </button>

            </li>
        `;
  }
  ulEl.innerHTML = listItems;
  addDeleteEvents();
  addCopyLinkEvent();
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
  console.log("yes");
});

inputBtn.addEventListener("click", function () {
  myLeads.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
});
