let root = document.getElementById("root");

function newTab(event) {
  let target = event.target;
  console.log(target.id);
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
          let a = document.createElement("a");
          a.href = `${site.domain}${tabURL.pathname}`;
          a.className = "label label-default";
          a.innerText = `Open using ${site.name}`;
          a.dataset.id = site.cookieStoreId;
          console.log(site.cookieStoreId);
          a.addEventListener('click', newTab);
          root.appendChild(a);
        }
      })
      let p = document.createElement("p");
      p.className = "muted";
      p.innerText = `Currently on ${tabURL.hostname}`;
      root.appendChild(p);
    });
  });
}

setupPage();
