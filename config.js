let config = null;

let tabListing = document.getElementById("tab-listing");
let tabRow = document.getElementById("tab-result");

let siteListing = document.getElementById("site-listing");
let siteRow = document.getElementById("site-result");

let siteForm = document.getElementById("site-form");
let siteFormTemplate = document.getElementById("site-form-template");

let createButton = document.getElementById("site-create");

function eventToId(event) {
  return parseInt(event.target.parentNode.parentNode.dataset.id)
}

function siteDeleteEvent(event) {
  let siteId = eventToId(event);
  for (let site of config.sites) {
    if (siteId === site.id) {
      config.sites.splice(config.sites.indexOf(site), 1);
      browser.contextualIdentities.remove(site.cookieStoreId);
      browser.storage.local.set(config);
      break;
    }
  }
  let node = document.getElementById(`site-${siteId}`);
  node.parentNode.removeChild(node);
  event.preventDefault();
}

function visitTabEvent(event) {
  browser.tabs.update(eventToId(event), {active: true});
  event.preventDefault();
}

function siteOpenEvent(event) {
  let siteId = eventToId(event);
  browser.storage.local.get()
  .then(config => {
    config.sites.forEach(site => {
      if (site.id === siteId) {
        browser.tabs.create({url: site.domain, cookieStoreId: site.cookieStoreId});
      }
    })
  })
  event.preventDefault();
}

function closeTabEvent(event) {
  let tabId = eventToId(event);
  browser.tabs.remove(tabId);
  event.preventDefault();
  let node = document.getElementById(`tab-${tabId}`);
  node.parentNode.removeChild(node);
}

function reloadEvent() {
  browser.storage.local.get().then(config => {
    rebuildTabList(config.sites);
  });
}

async function closeAll(event) {
  let config = await browser.storage.local.get();
  for (let site of config.sites) {
    let tabs = await browser.tabs.query({cookieStoreId: site.cookieStoreId});
    for (let tab of tabs) {
      browser.tabs.remove(tab.id)
    }
  }
  rebuildTabList(config.site);
}

document.getElementById("reload").addEventListener("click", reloadEvent);
document.getElementById("close-all").addEventListener("click", closeAll);
document.getElementById("site-form").addEventListener("submit", processForm);

async function rebuildTabList(sites) {
  tabListing.innerHTML = "";
  for (let site of sites) {
    let tabs = await browser.tabs.query({url: site.domain + '/*', cookieStoreId: site.cookieStoreId})
    for (let tab of tabs) {
      let urlObj = new URL(tab.url);

      let tabName = tabRow.content.querySelectorAll(".tab-name")[0];
      tabName.innerText = site.name;
      tabName.title = tab.url;

      let clone = document.importNode(tabRow.content, true)
      tabListing.appendChild(clone);
      let lastTab = tabListing.querySelectorAll('tr:last-child')[0];
      lastTab.id = `tab-${tab.id}`;
      lastTab.dataset.id = tab.id;
    }
  }

  tabListing.querySelectorAll(".tab-close").forEach(link => {
    link.addEventListener("click", closeTabEvent)
  });

  tabListing.querySelectorAll(".tab-new").forEach(link => {
    link.addEventListener("click", newTabEvent)
  });

  tabListing.querySelectorAll(".tab-visit").forEach(link => {
    link.addEventListener("click", visitTabEvent)
  });
}

async function rebuildSiteList(sites) {
  siteListing.innerHTML = "";
  for (let site of sites) {
    let contextualIdentity = await browser.contextualIdentities.get(site.cookieStoreId);
    let siteName = siteRow.content.querySelectorAll(".site-name")[0];
    siteName.innerText = site.name;

    let siteDomain = siteRow.content.querySelectorAll(".site-domain")[0];
    siteDomain.innerText = site.domain;

    let siteIcon = siteRow.content.querySelectorAll(".site-icon")[0];
    siteIcon.innerText = contextualIdentity.icon;

    let siteColor = siteRow.content.querySelectorAll(".site-color")[0];
    siteColor.innerText = contextualIdentity.color;

    let clone = document.importNode(siteRow.content, true)
    siteListing.appendChild(clone);

    let lastSite =  siteListing.querySelectorAll('tr:last-child')[0];
    lastSite.id = `site-${site.id}`;
    lastSite.dataset.id = site.id;
  }

    siteListing.querySelectorAll("a.site-open").forEach(link => {
      link.addEventListener("click", siteOpenEvent);
    });

    siteListing.querySelectorAll("a.site-delete").forEach(link => {
      link.addEventListener("click", siteDeleteEvent);
    });
}

async function createForm(event) {
  let clone = document.importNode(siteFormTemplate.content, true);
  siteForm.appendChild(clone);
  event.preventDefault();
}

async function setupPage() {
  config = await browser.storage.local.get();
  if (!config.sites) {
    config.sites = [];
  }
  await rebuildTabList(config.sites);
  await rebuildSiteList(config.sites);
  createButton.addEventListener("click", createForm);
}

async function processForm(event) {
  event.preventDefault();

  let data = new FormData(event.target);
  let now = new Date();
  let serial = {id: now.getTime()};
  for (let pair of data.entries()) {
    serial[pair[0]] = pair[1];
  };
  let identity = await browser.contextualIdentities.create({
    name: serial.name,
    color: serial.color,
    icon: serial.icon
  });
  serial.cookieStoreId = identity.cookieStoreId;
  config.sites.push(serial);
  await browser.storage.local.set(config);
  siteForm.innerHTML = '';
  rebuildSiteList(config.sites);
}

setupPage();
