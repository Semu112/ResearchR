function addSavedSite(url, title)
{
	chrome.storage.local.get("activeSession", (response1) => {
		chrome.storage.local.get("sessions", (response2) => {
			let sessions = response2.sessions;

			sessions[response1.activeSession].push({ "url": url, "title": title });

			chrome.storage.local.set({ "sessions": sessions });	
		});
	});
}


chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
	if (changeInfo.status != "loading") // prevents from firing twice, unsure what changeInfo.status is if not "loading", also just assumed that would work from looking at debugger and it seemed to
	{
		chrome.storage.local.get("activeSession", (response) => {
			if (response.activeSession && tab.url) // Otherwise you get other subframes, including any iframes in the website
			{
				addSavedSite(tab.url, tab.title);
			}
		})
	}
});
