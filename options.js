// Saves options to storage.
function save() {
  const storage = new Object();

  const entries = document.getElementById("entries").getElementsByTagName("input");
  for (var i = 0; i < entries.length; i += 2) {
    const key = entries[i].value;
    const val = entries[i + 1].value;

    if (key != '' && val != '')
      storage[key] = val;
  }
  chrome.storage.sync.set({ 'urlredirector': storage });
}

function addRow(alias, redirect) {

  const table = document.getElementById("entries");
  const row = document.createElement("tr");

  const aliasElement = document.createElement("td");
  const input1 = document.createElement("input");
  input1.value = alias;
  aliasElement.append(input1);

  const redirectElement = document.createElement("td");
  const input2 = document.createElement("input");
  input2.value = redirect;
  redirectElement.append(input2);

  const del = document.createElement("button");
  del.innerText = "Delete";
  del.onclick = function () { row.remove(); };
  del.className = "delete";

  row.appendChild(aliasElement);
  row.appendChild(redirectElement);
  row.appendChild(del);

  table.getElementsByTagName("tbody")[0].appendChild(row);
}

function onLoad() {
  chrome.storage.sync.get('urlredirector', function (storage) {
    for (var key in storage.urlredirector)
      addRow(key, storage.urlredirector[key]);
  });

  document.getElementById("newEntry").addEventListener("click", () => addRow("", ""));
  document.getElementById("save").onclick = save;
}

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") onLoad();
});