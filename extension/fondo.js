chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') chrome.tabs.create({ url: chrome.runtime.getURL('ayuda.html') });
});

chrome.permissions.onRemoved.addListener(async ({ origins = [] }) => {
  const registrados = await chrome.scripting.getRegisteredContentScripts();
  const ids = registrados.filter((s) => s.matches.some((m) => origins.includes(m))).map((s) => s.id);
  if (ids.length) await chrome.scripting.unregisterContentScripts({ ids });
});
