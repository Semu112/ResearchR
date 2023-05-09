// chrome.history.search({
// 	"text": '',
// }, function(historyItems){
// 	for (let historyItem of historyItems)
// 	{
// 		console.log(historyItem);
// 	}
// });

function error(msg)
{
	document.getElementById("error").innerText = msg;
	throw new Error(msg);
}

// Insert session into local storage
function addSession(sessionName)
{
	chrome.storage.local.get("sessions", (response) => {
		response.sessions[sessionName] = [];

		chrome.storage.local.set( { "sessions": response.sessions });
	});
}

// Render all sessions found in local storage
function renderSessions()
{
	let sessionSelect = document.getElementById("sessionSelect");

	chrome.storage.local.get("sessions", (response) => {
		// Render all of the sessions
		for (let session in response.sessions)
		{
			let sessionOption = document.createElement("OPTION");
			sessionOption.innerText = session;

			sessionSelect.appendChild(sessionOption);
		}
	});
}

// Render all sites in session in popup
function renderSavedSiteData()
{
	chrome.storage.local.get("activeSession", (response1) => {
		chrome.storage.local.get("sessions", (response2) => {

			// Clear popup saved site div
			let savedSiteDiv = document.getElementById("savedSites");
			savedSiteDiv.innerHTML = '';

			let blankOption = document.createElement("OPTION");
			blankOption.innerText = "";

			savedSiteDiv.appendChild(blankOption);

			let savedSites = response2.sessions[response1.activeSession];

			if (savedSites)
			{
				for( let site of savedSites )
				{
					let URLAnchor = document.createElement("A");
					URLAnchor.innerText = site.title;
					URLAnchor.href = site.url;

					savedSiteDiv.appendChild(URLAnchor);
					savedSiteDiv.appendChild(document.createElement("BR"));
				}
			}
		});
	});
}

async function init()
{
	await chrome.storage.local.get("sessions", (response) => {
		if(!response.sessions)
		{
			chrome.storage.local.set( { "sessions": {} } );
		}
	})

	await chrome.storage.local.get("activeSession", (response) => {
		document.getElementById("sessionSelect").value = response.activeSession;
		renderSavedSiteData();
	})

	// Add a new session
	document.getElementById("sessionNameForm").onsubmit = () => {
		addSession(document.getElementById("sessionNameInput").value);
		renderSessions();
	};

	// Select new session
	document.getElementById("sessionSelect").onchange = () => {
		chrome.storage.local.set( { "activeSession": document.getElementById("sessionSelect").value });
		renderSavedSiteData();
	}
}
init();

// Render the sessions in the extension
renderSessions();