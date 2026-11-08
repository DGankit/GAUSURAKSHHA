// ================= Gaun Suraksha: choose area =================

function $(id) { return document.getElementById(id); }

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// ---------- Helpers for names ----------
function districtOf(unit) { return DISTRICT_BY_ID[unit.districtId]; }
function provinceOf(unit) { return PROVINCE_BY_ID[districtOf(unit).provinceId]; }

function fullName(unit) {
  return unit.en + " (" + districtOf(unit).en + ", " + provinceOf(unit).en + ")";
}

// ---------- State ----------
let selectedId = null;   // id of the chosen local unit
let gps = null;          // best GPS fix: { lat, lng, accuracy }

// ---------- Show the area saved earlier ----------
const saved = readJSON("myArea", null);
if (saved && UNIT_BY_ID[saved.unitId]) {
  const u = UNIT_BY_ID[saved.unitId];
  $("currentCard").style.display = "block";
  $("currentArea").innerHTML =
    "<b>" + esc(u.en) + "</b> / " + esc(u.ne) + ", Ward " + esc(saved.ward) + "<br>" +
    esc(districtOf(u).en) + " District, " + esc(provinceOf(u).en) + " Province" +
    (saved.gps ? "<br><small>GPS saved (about " + Math.round(saved.gps.accuracy) + " m accuracy)</small>" : "");
}

// ---------- Choose a unit ----------
function chooseUnit(id, keepGps) {
  selectedId = id;
  const u = UNIT_BY_ID[id];

  // keep the three lists in step with the choice
  $("province").value = districtOf(u).provinceId;
  fillDistricts();
  $("district").value = u.districtId;
  fillUnits();
  $("unit").value = id;

  $("chosenUnit").innerHTML =
    "<b>" + esc(u.en) + "</b> / " + esc(u.ne) + "<br>" +
    esc(districtOf(u).en) + " District, " + esc(provinceOf(u).en) + " Province";

  if (!keepGps) $("useGps").checked = false;
}

// ---------- Province / district / unit lists ----------
$("province").innerHTML = NEPAL.provinces.map(function (p) {
  return '<option value="' + esc(p[0]) + '">' + esc(p[1]) + " / " + esc(p[2]) + "</option>";
}).join("");

function fillDistricts() {
  const pid = $("province").value;
  $("district").innerHTML = NEPAL.districts
    .filter(function (x) { return x[3] === pid; })
    .map(function (x) {
      return '<option value="' + esc(x[0]) + '">' + esc(x[1]) + " / " + esc(x[2]) + "</option>";
    }).join("");
}

function fillUnits() {
  const did = $("district").value;
  $("unit").innerHTML = NEPAL.units
    .filter(function (u) { return u[5] === did; })
    .map(function (u) {
      return '<option value="' + esc(u[0]) + '">' + esc(u[1]) + " / " + esc(u[2]) + "</option>";
    }).join("");
}

$("province").addEventListener("change", function () {
  fillDistricts();
  fillUnits();
  chooseUnit($("unit").value, false);
});
$("district").addEventListener("change", function () {
  fillUnits();
  chooseUnit($("unit").value, false);
});
$("unit").addEventListener("change", function () {
  chooseUnit($("unit").value, false);
});

fillDistricts();
fillUnits();

// ---------- Search by name (English or Nepali, works offline) ----------
$("searchBox").addEventListener("input", function () {
  const q = $("searchBox").value.trim().toLowerCase();
  if (q.length < 2) {
    $("searchResults").innerHTML = "";
    return;
  }

  const found = NEPAL.units.filter(function (u) {
    return u[1].toLowerCase().indexOf(q) !== -1 || u[2].indexOf(q) !== -1;
  });

  if (found.length === 0) {
    $("searchResults").textContent = "No local unit found. Try another spelling or use the lists below.";
    return;
  }

  let html = "";
  found.slice(0, 15).forEach(function (u) {
    html += '<button class="result-btn" data-id="' + esc(u[0]) + '">' +
      esc(u[1]) + " / " + esc(u[2]) + " - " +
      esc(DISTRICT_BY_ID[u[5]].en) + ", " + esc(PROVINCE_BY_ID[DISTRICT_BY_ID[u[5]].provinceId].en) +
      "</button>";
  });
  if (found.length > 15) {
    html += '<p class="hint">Showing 15 of ' + found.length + ". Type more letters to narrow it down.</p>";
  }
  $("searchResults").innerHTML = html;
});

$("searchResults").addEventListener("click", function (e) {
  const id = e.target.getAttribute("data-id");
  if (id === null) return;
  chooseUnit(id, false);
  $("searchResults").innerHTML = "";
  $("searchBox").value = "";
});

// ---------- Distance between two GPS points in km ----------
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = function (d) { return d * Math.PI / 180; };
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// The three local units whose reference points are closest to the user
function nearestThree(lat, lng) {
  return NEPAL.units
    .map(function (u) { return { id: u[0], km: distanceKm(lat, lng, u[3], u[4]) }; })
    .sort(function (a, b) { return a.km - b.km; })
    .slice(0, 3);
}

// ---------- Detect my location ----------
let watchId = null;
let watchTimer = null;

function stopWatching() {
  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  if (watchTimer !== null) clearTimeout(watchTimer);
  watchId = null;
  watchTimer = null;
  $("detectBtn").disabled = false;
}

function showNearest() {
  const list = nearestThree(gps.lat, gps.lng);
  let html = "<p><b>Closest local units to you. Pick yours:</b></p>";
  list.forEach(function (item) {
    html += '<button class="result-btn" data-near="' + esc(item.id) + '">' +
      esc(fullName(UNIT_BY_ID[item.id])) + " - " + item.km.toFixed(1) + " km from its reference point" +
      "</button>";
  });
  html += '<p class="hint">The data file has reference points, not borders. For a big rural unit the closest point may belong to a neighbour, so check the name before saving.</p>';
  $("nearList").innerHTML = html;
}

$("detectBtn").addEventListener("click", function () {
  if (!navigator.geolocation) {
    $("detectMsg").textContent = "Your browser does not support location.";
    return;
  }
  if (!window.isSecureContext) {
    $("detectMsg").textContent =
      "Location only works on https or localhost. Open this page with Live Server on your computer, or host the project on https (for example GitHub Pages or Netlify) to test on a phone.";
    return;
  }

  stopWatching();
  gps = null;
  $("nearList").innerHTML = "";
  $("detectBtn").disabled = true;
  $("detectMsg").textContent = "Finding your location. Please wait up to 20 seconds...";

  // Keep listening for a while and keep the most accurate reading
  watchId = navigator.geolocation.watchPosition(
    function (position) {
      const fix = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      if (gps === null || fix.accuracy < gps.accuracy) gps = fix;

      $("detectMsg").textContent =
        "Improving accuracy... currently about " + Math.round(gps.accuracy) + " m";

      if (gps.accuracy <= 30) finishDetect();   // good enough, stop early
    },
    function (err) {
      stopWatching();
      if (gps === null) {
        $("detectMsg").textContent =
          err.code === 1
            ? "Location permission was denied. Allow it in your browser settings, or use search or the lists."
            : "Could not get your location. Move near a window or outside, or use search or the lists.";
      }
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
  );

  watchTimer = setTimeout(finishDetect, 20000);
});

function finishDetect() {
  stopWatching();
  if (gps === null) {
    $("detectMsg").textContent = "No location received. Use search or the lists.";
    return;
  }

  const m = Math.round(gps.accuracy);
  let msg = "Your position: " + gps.lat.toFixed(5) + ", " + gps.lng.toFixed(5) + " (accuracy about " + m + " m).";

  if (gps.accuracy > 1000) {
    msg += " This is only an approximate location, usually from Wi-Fi or the internet connection. Laptops often do this. Use a phone with GPS outdoors, or choose your area by name.";
  } else if (gps.accuracy > 100) {
    msg += " Accuracy is moderate. It improves outdoors with a clear sky.";
  } else {
    msg += " Good accuracy.";
  }

  $("detectMsg").textContent = msg;
  $("gpsRow").style.display = "block";
  $("useGps").checked = gps.accuracy <= 1000;
  showNearest();
}

$("nearList").addEventListener("click", function (e) {
  const id = e.target.getAttribute("data-near");
  if (id === null) return;
  chooseUnit(id, true);   // keep the GPS tick
});

// ---------- Save ----------
$("confirmBtn").addEventListener("click", function () {
  if (selectedId === null) {
    $("saveMsg").textContent = "Please choose a local unit first (search, GPS or lists).";
    return;
  }

  const ward = parseInt($("wardNo").value, 10);
  if (isNaN(ward) || ward < 1 || ward > 50) {
    $("saveMsg").textContent = "Enter a ward number between 1 and 50.";
    return;
  }

  const area = {
    unitId: selectedId,
    ward: ward,
    gps: (gps && $("useGps").checked) ? { lat: gps.lat, lng: gps.lng, accuracy: gps.accuracy } : null
  };

  try {
    localStorage.setItem("myArea", JSON.stringify(area));
  } catch (e) {
    $("saveMsg").textContent = "Could not save. Please allow browser storage and try again.";
    return;
  }

  const u = UNIT_BY_ID[selectedId];
  $("saveMsg").innerHTML =
    "Saved: <b>" + esc(u.en) + "</b>, Ward " + ward +
    (area.gps ? " (GPS position will be used)" : " (the unit's reference point will be used)");
  $("goLink").style.display = "inline-block";
});