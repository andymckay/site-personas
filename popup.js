let siteListing = document.getElementById("site-listing");
let siteTemplate = document.getElementById("site-template");

function newTab(event) {
  let target = event.target;
  browser.tabs.create({url: target.href, cookieStoreId: target.dataset.id});
}


async function setupPage() {
  browser.tabs.query({currentWindow: true, active: true})
  .then((tab) => {
    let tabURL = new URL(tab[0].url);
    browser.storage.local.get()
    .then((config) => {
      config.sites.forEach(function(site) {
        if (site.cookieStoreId != tab[0].cookieStoreId) {
          let span = siteTemplate.content.querySelector("span");
          span.innerText = site.name;

          let aNew = siteTemplate.content.querySelector(".new-tab");
          aNew.dataset.id = site.cookieStoreId;
          aNew.href = `${site.domain}${tabURL.pathname}`;

          let clone = document.importNode(siteTemplate.content, true)
          siteListing.appendChild(clone);
        }
      })

      siteListing.querySelectorAll(".new-tab").forEach(link => {
        link.addEventListener("click", newTab)
      });

      document.querySelector(".tab-name").innerText = tabURL.hostname;
    });
  });
}

setupPage();
