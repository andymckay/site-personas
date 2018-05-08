browser.browserAction.onClicked.addListener(() => {
	browser.tabs.create({"url": "/config.html"});
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	browser.storage.local.get()
		.then((config) => {
			config.sites.forEach(function(site) {
				if (tab.url.match(site.domain)  && tab.cookieStoreId === site.cookieStoreId) {
					browser.pageAction.show(tab.id);
				}
			});
		});
});

browser.contextualIdentities.onRemoved.addListener((info) => {
  browser.storage.local.get()
    .then((config) => {
      config.sites.forEach(function(site) {
        if (info.contextualIdentity.cookieStoreId == site.cookieStoreId) {
          config.sites.splice(config.sites.indexOf(site), 1);
          browser.storage.local.set(config);
        }
      });
    });
})
