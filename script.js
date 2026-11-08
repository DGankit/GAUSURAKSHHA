// ================= Gaun Suraksha main script =================

// ---------- Safe reading and writing of browser storage ----------
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Could not save", key, e);
  }
}

// ---------- Start only if a valid area has been chosen ----------
const myArea = readJSON("myArea", null);
const myUnit = myArea ? UNIT_BY_ID[myArea.unitId] : null;

if (!myUnit || !(Number(myArea.ward) >= 1)) {
  window.location.href = "location.html";
} else {
  startApp();
}

function startApp() {

  // ---------- Words in both languages ----------
  const text = {
    en: {
      title: "Gaun Suraksha",
      subtitle: "Protecting farmers before, during and after disasters",
      change: "Change area",
      ward: "Ward ",
      gpsTag: "GPS",
      youAreHere: "Your GPS position",
      navAlerts: "Alerts", navDashboard: "Dashboard", navMap: "Map",
      navReports: "Reports", navRelief: "Relief", navSafety: "Safety",

      alertsHeading: "Weather Alerts",
      disasterType: "Disaster type:",
      flood: "Flood", hailstorm: "Hailstorm", drought: "Drought",
      sendAlert: "Send Simulated Alert",
      checkForecast: "Check Real Rain Forecast",
      forecastLoading: "Getting forecast...",
      forecastTitle: "Rain forecast for the next 3 days: ",
      riskLabel: "Flood risk: ",
      low: "Low", medium: "Medium", high: "High",
      forecastError: "Could not get the forecast. Check your internet.",
      forecastNote: "Risk levels are example thresholds (over 3 days: 50 mm = medium, 100 mm = high).",
      noAlerts: "No alerts for this area.",
      imSafe: "I'm safe",
      markedSafe: "Marked safe: ",
      sourceSim: "Simulation",
      sourceForecast: "Real forecast",
      demoTag: "Demo",
      alertSent: "Alert created.",
      alertSentMany: "Alert created for wards: {w}.",
      otherWards: "Alerts in other wards of your area:",
      affectedWards: "Affected wards (choose one or more):",
      wardsAll: "Select all", wardsNone: "Clear",
      wardsTyped: "Ward numbers, e.g. 1, 3, 5-7",
      wardNone: "Choose at least one ward.",
      alertTitle: {
        flood: "FLOOD WARNING",
        hailstorm: "HAILSTORM WARNING",
        drought: "DROUGHT WARNING"
      },
      alertText: {
        flood: "Heavy rain expected. Harvest paddy within 3 days and move livestock to higher ground.",
        hailstorm: "Hailstorm likely tonight. Cover vegetable beds and keep animals inside shelters.",
        drought: "No rain expected for two weeks. Irrigate in the early morning and use mulch to save water."
      },
      noAlert: "No active alert",

      dashHeading: "Area Dashboard",
      statAlerts: "Alerts",
      statSafe: "Safe check-ins",
      statReports: "Damage reports",
      statArea: "Damaged area (ropani)",
      statPending: "Relief pending",
      statDone: "Relief delivered",
      statPrep: "Preparedness",
      chartTitle: "Damaged area by crop (ropani)",
      noChartData: "Add damage reports to see the chart.",

      mapHeading: "Nepal Alert Map",
      mapHint: "Every dot is one of the 775 local units. Green = no alert. Red = flood, blue = hailstorm, orange = drought. Big dot with thick border = your area. Tap a dot for its name. A coloured ward shape means only that ward has an alert; other wards stay clear.",

      reportHeading: "Report Crop Damage",
      cropPlaceholder: "Crop (paddy, maize...)",
      areaPlaceholder: "Damaged area (ropani)",
      detailsPlaceholder: "What happened?",
      submitReport: "Submit Report",
      listHeading: "Submitted Reports",
      noReports: "No reports yet.",
      ropani: "ropani",
      deleteBtn: "Delete",
      confirmDelete: "Delete this report?",
      fillFields: "Please fill in the crop and the area.",
      badArea: "Damaged area must be more than 0.",
      reportSaved: "Report saved.",
      reportDeleted: "Report deleted.",

      reliefHeading: "Relief Requests",
      reliefItem: "Item needed:",
      food: "Food", tent: "Tent / shelter", medicine: "Medicine", seeds: "Seeds",
      qtyPlaceholder: "Quantity (families / units)",
      notePlaceholder: "Note (optional)",
      submitRelief: "Send Request",
      reliefList: "Request list",
      noRelief: "No requests yet.",
      pending: "Pending",
      delivered: "Delivered",
      markDelivered: "Mark delivered",
      fillRelief: "Please enter a quantity above 0.",
      reliefSaved: "Relief request sent.",

      checklistHeading: "Household Preparedness Checklist",
      checklistIntro: "Tick each box to check how ready your household is.",
      check0: "Emergency bag ready (documents, torch, medicines, dry food)",
      check1: "Family knows the safe meeting place",
      check2: "Drinking water stored for 3 days",
      check3: "Livestock shelter or higher ground identified",
      check4: "Harvested grain and seeds stored above floor level",
      check5: "Emergency numbers saved on the phone",
      prepScore: "Preparedness score: ",

      contactsHeading: "Emergency Contacts",
      police: "Nepal Police",
      fire: "Fire brigade",
      ambulance: "Ambulance",
      call: "Call",
      contactNote: "Add your ward office and local health post numbers in the code (contacts list).",

      toolsHeading: "Project Tools",
      toolsNote: "Demo data is sample data for presentations only. Data is stored on this device.",
      loadDemo: "Load demo data",
      exportCsv: "Download reports (CSV)",
      clearAll: "Clear all data",
      confirmClear: "Delete all saved alerts, reports and requests on this device?",
      demoLoaded: "Demo data added.",
      cleared: "All data cleared.",
      nothingExport: "No reports to download.",

      footerText: "Gaun Suraksha is a prototype. Simulated alerts are for demonstration only. Data is stored on this device only. Administrative data: OCHA COD-AB via HDX (CC BY-IGO). Ward boundaries and base map: © OpenStreetMap contributors (ODbL).",
      layerProvinces: "Provinces", layerDistricts: "Districts",
      layerLocal: "Local units", layerWards: "Wards (your municipality)",
      wardLoading: "Loading ward boundaries from OpenStreetMap... the first time can take up to 20 seconds. Next visits are instant.",
      wardMissing: "OpenStreetMap has no ward boundaries for your municipality yet.",
      wardFileError: "Could not load ward boundaries from OpenStreetMap. Check your internet connection and try again (use Live Server, not a double-click).",
      wardGpsOk: "Your GPS position is inside your saved ward.",
      wardGpsDiff: "Your GPS position is inside ward {n}, but your saved ward is {w}. Use Change area to correct it.",
      wardGpsOut: "Your GPS position is outside your municipality's ward boundaries.",
      langButton: "नेपाली"
    },
    ne: {
      title: "गाउँ सुरक्षा",
      subtitle: "विपद्अघि, विपद्का बेला र विपद्पछि किसानको सुरक्षा",
      change: "क्षेत्र बदल्नुहोस्",
      ward: "वडा ",
      gpsTag: "GPS",
      youAreHere: "तपाईंको GPS स्थान",
      navAlerts: "चेतावनी", navDashboard: "ड्यासबोर्ड", navMap: "नक्सा",
      navReports: "रिपोर्ट", navRelief: "राहत", navSafety: "सुरक्षा",

      alertsHeading: "मौसम चेतावनी",
      disasterType: "विपद्को प्रकार:",
      flood: "बाढी", hailstorm: "असिना", drought: "खडेरी",
      sendAlert: "परीक्षण चेतावनी पठाउनुहोस्",
      checkForecast: "वास्तविक वर्षा पूर्वानुमान हेर्नुहोस्",
      forecastLoading: "पूर्वानुमान ल्याउँदै...",
      forecastTitle: "आगामी ३ दिनको वर्षा: ",
      riskLabel: "बाढी जोखिम: ",
      low: "कम", medium: "मध्यम", high: "उच्च",
      forecastError: "पूर्वानुमान ल्याउन सकिएन। इन्टरनेट जाँच गर्नुहोस्।",
      forecastNote: "जोखिम स्तर उदाहरणका लागि राखिएको हो (३ दिनमा ५० मिमि = मध्यम, १०० मिमि = उच्च)।",
      noAlerts: "यस क्षेत्रका लागि कुनै चेतावनी छैन।",
      imSafe: "म सुरक्षित छु",
      markedSafe: "सुरक्षित भनेका: ",
      sourceSim: "परीक्षण",
      sourceForecast: "वास्तविक पूर्वानुमान",
      demoTag: "नमुना",
      alertSent: "चेतावनी बनाइयो।",
      alertSentMany: "वडा {w} का लागि चेतावनी बनाइयो।",
      otherWards: "तपाईंको क्षेत्रका अन्य वडाका चेतावनी:",
      affectedWards: "प्रभावित वडाहरू (एक वा धेरै छान्नुहोस्):",
      wardsAll: "सबै छान्नुहोस्", wardsNone: "हटाउनुहोस्",
      wardsTyped: "वडा नम्बर, जस्तै 1, 3, 5-7",
      wardNone: "कम्तीमा एउटा वडा छान्नुहोस्।",
      alertTitle: {
        flood: "बाढीको चेतावनी",
        hailstorm: "असिनाको चेतावनी",
        drought: "खडेरीको चेतावनी"
      },
      alertText: {
        flood: "भारी वर्षा हुने सम्भावना छ। ३ दिनभित्र धान काट्नुहोस् र पशुचौपाया अग्लो ठाउँमा सार्नुहोस्।",
        hailstorm: "आज राति असिना पर्ने सम्भावना छ। तरकारी बेर्ना छोप्नुहोस् र पशुलाई गोठभित्र राख्नुहोस्।",
        drought: "दुई हप्तासम्म वर्षा नहुने सम्भावना छ। बिहानै सिँचाइ गर्नुहोस् र पानी जोगाउन मल्चिङ प्रयोग गर्नुहोस्।"
      },
      noAlert: "कुनै सक्रिय चेतावनी छैन",

      dashHeading: "क्षेत्र ड्यासबोर्ड",
      statAlerts: "चेतावनी",
      statSafe: "सुरक्षित जानकारी",
      statReports: "क्षति रिपोर्ट",
      statArea: "क्षति क्षेत्रफल (रोपनी)",
      statPending: "राहत बाँकी",
      statDone: "राहत वितरण भयो",
      statPrep: "तयारी",
      chartTitle: "बाली अनुसार क्षति क्षेत्रफल (रोपनी)",
      noChartData: "चार्ट हेर्न क्षति रिपोर्ट थप्नुहोस्।",

      mapHeading: "नेपाल चेतावनी नक्सा",
      mapHint: "प्रत्येक थोपा ७७५ स्थानीय तहमध्ये एक हो। हरियो = चेतावनी छैन। रातो = बाढी, निलो = असिना, सुन्तला = खडेरी। मोटो घेरासहितको ठूलो थोपा = तपाईंको क्षेत्र। नाम हेर्न थोपा थिच्नुहोस्। रङ लगाइएको वडामा मात्र चेतावनी हुन्छ; अन्य वडा सफा रहन्छन्।",

      reportHeading: "बालीनाली क्षति रिपोर्ट",
      cropPlaceholder: "बाली (धान, मकै...)",
      areaPlaceholder: "क्षति भएको क्षेत्रफल (रोपनी)",
      detailsPlaceholder: "के भयो?",
      submitReport: "रिपोर्ट पठाउनुहोस्",
      listHeading: "पेश गरिएका रिपोर्टहरू",
      noReports: "अहिलेसम्म कुनै रिपोर्ट छैन।",
      ropani: "रोपनी",
      deleteBtn: "हटाउनुहोस्",
      confirmDelete: "यो रिपोर्ट हटाउने?",
      fillFields: "कृपया बाली र क्षेत्रफल भर्नुहोस्।",
      badArea: "क्षति क्षेत्रफल ० भन्दा बढी हुनुपर्छ।",
      reportSaved: "रिपोर्ट सुरक्षित गरियो।",
      reportDeleted: "रिपोर्ट हटाइयो।",

      reliefHeading: "राहत अनुरोध",
      reliefItem: "आवश्यक सामग्री:",
      food: "खाद्यान्न", tent: "टेन्ट / आश्रय", medicine: "औषधि", seeds: "बीउबिजन",
      qtyPlaceholder: "परिमाण (परिवार / एकाइ)",
      notePlaceholder: "टिप्पणी (ऐच्छिक)",
      submitRelief: "अनुरोध पठाउनुहोस्",
      reliefList: "अनुरोध सूची",
      noRelief: "अहिलेसम्म कुनै अनुरोध छैन।",
      pending: "बाँकी",
      delivered: "वितरण भयो",
      markDelivered: "वितरण भयो भनी चिन्ह लगाउनुहोस्",
      fillRelief: "कृपया ० भन्दा बढी परिमाण भर्नुहोस्।",
      reliefSaved: "राहत अनुरोध पठाइयो।",

      checklistHeading: "घरपरिवार तयारी सूची",
      checklistIntro: "आफ्नो घरपरिवारको तयारी जाँच्न बाकस चिन्ह लगाउनुहोस्।",
      check0: "आपत्कालीन झोला तयार (कागजात, टर्च, औषधि, सुख्खा खाना)",
      check1: "परिवारलाई सुरक्षित भेट्ने ठाउँबारे थाहा छ",
      check2: "३ दिनका लागि खानेपानी भण्डारण गरिएको छ",
      check3: "पशुचौपायाका लागि गोठ वा अग्लो ठाउँ पहिचान गरिएको छ",
      check4: "भित्र्याएको अन्न र बीउ भुइँभन्दा माथि राखिएको छ",
      check5: "आपत्कालीन नम्बरहरू फोनमा सेभ गरिएको छ",
      prepScore: "तयारी स्कोर: ",

      contactsHeading: "आपत्कालीन सम्पर्क",
      police: "नेपाल प्रहरी",
      fire: "दमकल",
      ambulance: "एम्बुलेन्स",
      call: "फोन गर्नुहोस्",
      contactNote: "आफ्नो वडा कार्यालय र स्थानीय स्वास्थ्य चौकीको नम्बर कोडमा (contacts सूची) थप्नुहोस्।",

      toolsHeading: "परियोजना उपकरण",
      toolsNote: "नमुना डेटा प्रस्तुतिका लागि मात्र हो। डेटा यही उपकरणमा सुरक्षित हुन्छ।",
      loadDemo: "नमुना डेटा लोड गर्नुहोस्",
      exportCsv: "रिपोर्ट डाउनलोड (CSV)",
      clearAll: "सबै डेटा हटाउनुहोस्",
      confirmClear: "यस उपकरणमा सुरक्षित सबै चेतावनी, रिपोर्ट र अनुरोध हटाउने?",
      demoLoaded: "नमुना डेटा थपियो।",
      cleared: "सबै डेटा हटाइयो।",
      nothingExport: "डाउनलोड गर्न कुनै रिपोर्ट छैन।",

      footerText: "गाउँ सुरक्षा एक प्रोटोटाइप हो। परीक्षण चेतावनी प्रदर्शनका लागि मात्र हुन्। डेटा यही उपकरणमा मात्र सुरक्षित हुन्छ। प्रशासनिक डेटा: OCHA COD-AB (HDX), CC BY-IGO। वडा सीमाना र आधार नक्सा: © OpenStreetMap contributors (ODbL)।",
      layerProvinces: "प्रदेश", layerDistricts: "जिल्ला",
      layerLocal: "स्थानीय तह", layerWards: "वडाहरू (तपाईंको स्थानीय तह)",
      wardLoading: "OpenStreetMap बाट वडा सीमाना ल्याउँदै... पहिलो पटक २० सेकेन्डसम्म लाग्न सक्छ। अर्को पटकदेखि तुरुन्त खुल्छ।",
      wardMissing: "तपाईंको स्थानीय तहको वडा सीमाना OpenStreetMap मा अहिलेसम्म छैन।",
      wardFileError: "OpenStreetMap बाट वडा सीमाना ल्याउन सकिएन। इन्टरनेट जाँच गरी फेरि प्रयास गर्नुहोस् (Live Server प्रयोग गर्नुहोस्)।",
      wardGpsOk: "तपाईंको GPS स्थान सुरक्षित गरिएको वडाभित्र छ।",
      wardGpsDiff: "तपाईंको GPS स्थान वडा {n} भित्र छ, तर सुरक्षित वडा {w} हो। क्षेत्र बदल्नुहोस् थिचेर सच्याउनुहोस्।",
      wardGpsOut: "तपाईंको GPS स्थान स्थानीय तहको वडा सीमानाभन्दा बाहिर छ।",
      langButton: "English"
    }
  };

  // ---------- Settings you can edit ----------
  const RAIN_MEDIUM = 50;    // mm of rain in 3 days that counts as medium risk
  const RAIN_HIGH = 100;     // mm of rain in 3 days that counts as high risk
  const CHECK_COUNT = 6;     // number of checklist items (check0 ... check5)
  const contacts = [
    { key: "police", number: "100" },
    { key: "fire", number: "101" },
    { key: "ambulance", number: "102" }
  ];

  // ---------- Small helper functions ----------
  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function inArea(item) { return item.unitId === myArea.unitId; }

  // Alerts belong to ONE ward of ONE local unit
  function inWard(item) {
    return item.unitId === myArea.unitId && String(item.ward) === String(myArea.ward);
  }

  function loadList(key) {
    const list = readJSON(key, []);
    if (!Array.isArray(list)) return [];
    // Ignore entries saved by older versions (they have no unitId)
    return list.filter(function (x) {
      return x && typeof x.id === "number" && typeof x.unitId === "string";
    });
  }

  function toast(message) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    $("toasts").appendChild(el);
    setTimeout(function () { el.classList.add("hide"); }, 2600);
    setTimeout(function () { el.remove(); }, 3100);
  }

  // Names in the chosen language
  function unitName(u) { return lang === "ne" ? u.ne : u.en; }
  function districtName(u) {
    const d = DISTRICT_BY_ID[u.districtId];
    return lang === "ne" ? d.ne : d.en;
  }
  function provinceName(u) {
    const p = PROVINCE_BY_ID[DISTRICT_BY_ID[u.districtId].provinceId];
    return lang === "ne" ? p.ne : p.en;
  }

  // ---------- Saved data ----------
  let lang = readJSON("lang", "en");
  if (lang !== "en" && lang !== "ne") lang = "en";

  let alerts = loadList("alerts");
  let reports = loadList("reports");
  let relief = loadList("relief");
  let lastForecast = null;

  const checklistKey = "checklist_" + myArea.unitId + "_" + myArea.ward;
  let checked = readJSON(checklistKey, []);
  if (!Array.isArray(checked)) checked = [];

  // ---------- Where the user is ----------
  // Use the GPS position when one was saved, otherwise the unit's reference point.
  const hasGps = !!(myArea.gps && typeof myArea.gps.lat === "number" && typeof myArea.gps.lng === "number");
  const pos = hasGps ? { lat: myArea.gps.lat, lng: myArea.gps.lng } : { lat: myUnit.lat, lng: myUnit.lng };

  // ---------- Map (all 775 local units) ----------
  const colors = { safe: "#2e7d32", flood: "#c62828", hailstorm: "#1565c0", drought: "#ef6c00" };

  // The map variable is NOT called "map", because that name clashes with <div id="map">
  const leafletMap = L.map("map", { preferCanvas: true }).setView([pos.lat, pos.lng], 9);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(leafletMap);

  const markers = {};
  let latestByUnit = {};   // newest alert of any ward, per unit
  let wardAlerts = {};     // unitId -> { wardNumber: newest alert }

  function popupHtml(u) {
    return "<b>" + esc(unitName(u)) + "</b><br>" +
      esc(districtName(u)) + ", " + esc(provinceName(u)) + "<br>" +
      wardPopupLines(u.id);
  }

  function wardPopupLines(unitId) {
    const t = text[lang];
    const w = wardAlerts[unitId];
    if (!w) return t.noAlert;
    return Object.keys(w)
      .sort(function (a, b) { return Number(a) - Number(b); })
      .map(function (n) { return t.ward + esc(n) + ": " + t.alertTitle[w[n].type]; })
      .join("<br>");
  }

  NEPAL.units.forEach(function (row) {
    const u = UNIT_BY_ID[row[0]];
    const marker = L.circleMarker([u.lat, u.lng], { radius: 4, weight: 1, fillOpacity: 0.55, color: colors.safe });
    marker.on("click", function () {
      marker.bindPopup(popupHtml(u)).openPopup();
    });
    marker.addTo(leafletMap);
    markers[u.id] = marker;
  });

  // GPS position and its accuracy circle
  let gpsMarker = null;
  let gpsCircle = null;
  if (hasGps) {
    const acc = Number(myArea.gps.accuracy) || 0;
    if (acc > 0 && acc < 5000) {
      gpsCircle = L.circle([pos.lat, pos.lng], {
        radius: acc, color: "#1565c0", weight: 1, fillOpacity: 0.12
      }).addTo(leafletMap);
    }
    gpsMarker = L.circleMarker([pos.lat, pos.lng], {
      radius: 7, color: "#0d47a1", fillColor: "#2196f3", fillOpacity: 1, weight: 2
    }).addTo(leafletMap);
  }

  function updateMap() {
    // newest alert for each unit and for each ward
    latestByUnit = {};
    wardAlerts = {};
    alerts.slice().sort(function (a, b) { return a.id - b.id; }).forEach(function (a) {
      latestByUnit[a.unitId] = a;
      if (a.ward !== undefined) {
        if (!wardAlerts[a.unitId]) wardAlerts[a.unitId] = {};
        wardAlerts[a.unitId][String(a.ward)] = a;
      }
    });

    NEPAL.units.forEach(function (row) {
      const id = row[0];
      const latest = latestByUnit[id];
      const mine = id === myArea.unitId;
      markers[id].setStyle({
        color: latest ? colors[latest.type] : colors.safe,
        radius: mine ? 11 : (latest ? 8 : 4),
        weight: mine ? 5 : 1,
        fillOpacity: latest || mine ? 0.7 : 0.55
      });
      if (mine) markers[id].bringToFront();
    });

    if (gpsMarker) {
      gpsMarker.bindPopup(
        text[lang].youAreHere + "<br>" + pos.lat.toFixed(5) + ", " + pos.lng.toFixed(5) +
        (myArea.gps.accuracy ? "<br>± " + Math.round(myArea.gps.accuracy) + " m" : "")
      );
      gpsMarker.bringToFront();
    }

    refreshWards();
  }

  setTimeout(function () { leafletMap.invalidateSize(); }, 300);

  // ---------- Real boundaries: province, district, local unit, ward ----------
  // Put the GeoJSON files in a folder called "geo" next to index.html.
  // If your files use other property names, change wardProps below.
  const GEO = {
    province: "geo/province.geojson",
    district: "geo/district.geojson",
    local: "geo/municipality.geojson",
    ward: "geo/ward.geojson",
    wardProps: {
      municipality: "municipality_name",
      district: "district_name",      // set to "" if your file has no district name
      number: "ward_number"
    }
  };

  const layerControl = L.control.layers(null, null, { collapsed: true }).addTo(leafletMap);

  function addBoundaryLayer(file, label, style) {
    fetch(file)
      .then(function (res) { if (!res.ok) throw new Error("missing"); return res.json(); })
      .then(function (data) {
        const layer = L.geoJSON(data, { style: style, interactive: false }).addTo(leafletMap);
        layerControl.addOverlay(layer, label);
      })
      .catch(function () { console.warn("Boundary file not loaded:", file); });
  }

  let outlinesStarted = false;
  function startOutlines() {
    if (outlinesStarted) return;
    outlinesStarted = true;
    addBoundaryLayer(GEO.province, text[lang].layerProvinces, { color: "#000000", weight: 3, fill: false });
    addBoundaryLayer(GEO.district, text[lang].layerDistricts, { color: "#37474f", weight: 2, fill: false });
    addBoundaryLayer(GEO.local, text[lang].layerLocal, { color: "#78909c", weight: 1, fill: false });
  }
  setTimeout(startOutlines, 12000);   // safety: start anyway if the wards are very slow

  // Make "Bardaghat Municipality" and "Bardaghat" compare as equal
  function normName(s) {
    return String(s || "").toLowerCase()
      .replace(/sub[- ]?metropolitan city|metropolitan city|rural municipality|municipality/g, "")
      .replace(/upa-?mahanagarpalika|mahanagarpalika|nagarpalika|gaunpalika/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  // Is the point (x = longitude, y = latitude) inside a Polygon / MultiPolygon?
  function inRing(x, y, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  function inPolygon(x, y, poly) {
    if (!inRing(x, y, poly[0])) return false;
    for (let k = 1; k < poly.length; k++) if (inRing(x, y, poly[k])) return false;
    return true;
  }
  function inGeometry(x, y, g) {
    if (g.type === "Polygon") return inPolygon(x, y, g.coordinates);
    if (g.type === "MultiPolygon") return g.coordinates.some(function (p) { return inPolygon(x, y, p); });
    return false;
  }

  let wardData = null;       // all wards, loaded once
  let wardState = "loading"; // loading | ready | error
  let wardLayer = null;
  let unitWardNumbers = [];   // ward numbers of my unit, known once the shapes are loaded
  let wardFitted = false;

  // ---- Ward shapes straight from OpenStreetMap (same data as openstreetmap.org) ----
  // OSM stores each ward as a boundary relation, admin_level=9, named like "Bharatpur-01".
  const OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];
  let osmError = "";   // the real reason, shown under the map when loading fails
  const OSM_RADIUS_M = 25000;   // search radius around the unit's reference point

  // any character that is not a letter, digit or space becomes "." (matches one character)
  function escapeRegex(s) { return s.replace(/[^A-Za-z0-9 ]/g, "."); }

  // "Bharatpur Metropolitan City" -> "Bharatpur"
  function plainUnitName(en) {
    return en.replace(/\s*(sub[- ]?metropolitan city|metropolitan city|rural municipality|municipality)\s*$/i, "").trim();
  }

  function wardNumberOf(tags) {
    if (tags.ward && /^\d+$/.test(tags.ward)) return parseInt(tags.ward, 10);
    const name = tags["name:en"] || tags.name || "";
    const m = name.match(/(\d+)\s*$/);
    return m ? parseInt(m[1], 10) : null;
  }

  function fetchOverpass(q, i) {
    i = i || 0;
    return fetch(OVERPASS_URLS[i], {
      method: "POST",
      body: "data=" + encodeURIComponent(q),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error(OVERPASS_URLS[i].split("/")[2] + " answered HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.warn("Overpass failed:", err);
        if (i + 1 < OVERPASS_URLS.length) return fetchOverpass(q, i + 1);
        throw err;
      });
  }

  function loadWardsFromOSM() {
    const cacheKey = "osmWards:" + myUnit.id;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached && cached.features && cached.features.length) return Promise.resolve(cached);
    } catch (e) { /* no cache */ }

    if (typeof osmtogeojson !== "function") return Promise.reject(new Error("osmtogeojson missing"));

    const nm = escapeRegex(plainUnitName(myUnit.en));
    const around = "(around:" + OSM_RADIUS_M + "," + myUnit.lat + "," + myUnit.lng + ")";
    const q = '[out:json][timeout:25];' +
      'relation["boundary"="administrative"]["admin_level"="9"]' + around + '->.w;' +
      '(relation.w["name"~"^' + nm + '[- ]",i];relation.w["name:en"~"^' + nm + '[- ]",i];);' +
      'out geom;';

    // 1) the Netlify relay (no CORS problem)  2) the public servers directly (works on Live Server)
    const relayUrl = "/.netlify/functions/wards?name=" + encodeURIComponent(plainUnitName(myUnit.en)) +
      "&lat=" + myUnit.lat + "&lng=" + myUnit.lng;

    return fetch(relayUrl)
      .then(function (res) { if (!res.ok) throw new Error("relay answered HTTP " + res.status); return res.json(); })
      .catch(function (err) {
        console.warn("Relay not available, trying Overpass directly:", err.message);
        return fetchOverpass(q);
      })
      .then(function (osm) {
        const gj = osmtogeojson(osm);
        const seen = {};
        const features = [];
        gj.features.forEach(function (f) {
          if (!f.geometry || (f.geometry.type !== "Polygon" && f.geometry.type !== "MultiPolygon")) return;
          const n = wardNumberOf(f.properties || {});
          if (n === null || seen[n]) return;
          seen[n] = true;
          f.properties = { ward_number: n, municipality_name: myUnit.en, osm_id: f.id };
          features.push(f);
        });
        const out = { type: "FeatureCollection", features: features };
        if (features.length) {
          try { localStorage.setItem(cacheKey, JSON.stringify(out)); } catch (e) { /* too big, ignore */ }
        }
        return out;
      });
  }

  loadWardsFromOSM()
    .then(function (data) {
      if (data.features.length) return data;
      throw new Error("no wards in OSM");
    })
    .catch(function (err) {
      osmError = (err && err.message) ? err.message : String(err);
      console.error("OpenStreetMap ward loading failed:", err);
      // fallback: your own file, if you added geo/ward.geojson
      return fetch(GEO.ward).then(function (res) { if (!res.ok) throw new Error("missing"); return res.json(); });
    })
    .then(function (data) { wardData = data; wardState = "ready"; refreshWards(); })
    .catch(function () {
      if (osmError === "no wards in OSM") {
        wardData = { type: "FeatureCollection", features: [] };
        wardState = "ready";
      } else {
        wardState = "error";
      }
      refreshWards();
    })
    .then(startOutlines);

  function refreshWards() {
    unitWardNumbers = [];
    drawWards();
    renderWardPick();
  }

  function drawWards() {
    const t = text[lang];
    const status = $("geoStatus");

    if (wardState === "loading") { status.textContent = t.wardLoading; return; }
    if (wardState === "error") { status.textContent = t.wardFileError + (osmError ? " [" + osmError + "]" : ""); return; }

    const wp = GEO.wardProps;
    const unitKey = normName(myUnit.en);
    const distKey = normName(DISTRICT_BY_ID[myUnit.districtId].en);

    let mine = wardData.features.filter(function (f) {
      return normName(f.properties[wp.municipality]) === unitKey;
    });
    // several units in Nepal share a name, so narrow down by district when possible
    if (wp.district) {
      const narrowed = mine.filter(function (f) { return normName(f.properties[wp.district]) === distKey; });
      if (narrowed.length > 0) mine = narrowed;
    }

    unitWardNumbers = mine
      .map(function (f) { return Number(f.properties[wp.number]); })
      .filter(function (n, i, a) { return isFinite(n) && a.indexOf(n) === i; })
      .sort(function (a, b) { return a - b; });

    if (wardLayer) { layerControl.removeLayer(wardLayer); leafletMap.removeLayer(wardLayer); wardLayer = null; }
    if (mine.length === 0) { status.textContent = t.wardMissing; return; }

    const unitAlerts = wardAlerts[myUnit.id] || {};

    wardLayer = L.geoJSON({ type: "FeatureCollection", features: mine }, {
      style: function (f) {
        const no = String(f.properties[wp.number]);
        const isMine = no === String(myArea.ward);
        const a = unitAlerts[no];            // an alert exists ONLY for this exact ward
        return {
          color: isMine ? "#0d47a1" : "#546e7a",
          weight: isMine ? 4 : 1.5,
          fillColor: a ? colors[a.type] : (isMine ? "#fff176" : "#ffffff"),
          fillOpacity: a ? 0.55 : (isMine ? 0.25 : 0.05)
        };
      },
      onEachFeature: function (f, layer) {
        const no = String(f.properties[wp.number]);
        const a = unitAlerts[no];
        layer.bindTooltip(t.ward + esc(no) + (a ? ": " + t.alertTitle[a.type] : ": " + t.noAlert));
      }
    }).addTo(leafletMap);
    layerControl.addOverlay(wardLayer, t.layerWards);

    if (!wardFitted) {
      leafletMap.fitBounds(wardLayer.getBounds(), { padding: [20, 20] });
      wardFitted = true;
    }

    // Check the saved GPS position against the real ward shapes
    status.textContent = "";
    if (hasGps) {
      const hit = mine.find(function (f) { return inGeometry(pos.lng, pos.lat, f.geometry); });
      if (!hit) status.textContent = t.wardGpsOut;
      else {
        const n = String(hit.properties[wp.number]);
        status.textContent = n === String(myArea.ward)
          ? t.wardGpsOk
          : t.wardGpsDiff.replace("{n}", n).replace("{w}", myArea.ward);
      }
    }
  }

  // ---------- Alerts ----------
  // ---------- Choose the affected wards ----------
  let pickedWards = [String(myArea.ward)];

  // "1, 3, 5-7"  ->  ["1","3","5","6","7"]
  function parseWardList(str) {
    const out = [];
    String(str).split(/[,\s]+/).forEach(function (part) {
      const m = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!m) return;
      const a = parseInt(m[1], 10);
      const b = m[2] ? parseInt(m[2], 10) : a;
      for (let n = Math.min(a, b); n <= Math.max(a, b) && n <= 50; n++) {
        if (n >= 1 && out.indexOf(String(n)) === -1) out.push(String(n));
      }
    });
    return out;
  }

  function getPickedWards() {
    const box = $("wardPick");
    if (!box) return [String(myArea.ward)];   // old page without the picker: use my own ward
    if (unitWardNumbers.length > 0) {
      return Array.prototype.map.call(box.querySelectorAll("input[type=checkbox]:checked"),
        function (c) { return c.value; });
    }
    const typed = $("wardText");
    return typed ? parseWardList(typed.value) : pickedWards;
  }

  function renderWardPick() {
    const box = $("wardPick");
    if (!box) return;
    const t = text[lang];

    if (unitWardNumbers.length === 0) {
      // ward shapes not available: let the person type the numbers
      if ($("wardText")) return;
      box.innerHTML = '<input type="text" id="wardText" placeholder="' + esc(t.wardsTyped) +
        '" value="' + esc(pickedWards.join(", ")) + '">';
      return;
    }

    box.innerHTML = unitWardNumbers.map(function (n) {
      const on = pickedWards.indexOf(String(n)) !== -1;
      const mine = String(n) === String(myArea.ward);
      return '<label class="ward-chip' + (mine ? " mine" : "") + '"><input type="checkbox" value="' + n + '"' +
        (on ? " checked" : "") + ">" + n + "</label>";
    }).join("") +
      '<div class="ward-tools"><button type="button" id="wardAllBtn" class="btn-secondary">' + esc(t.wardsAll) +
      '</button><button type="button" id="wardNoneBtn" class="btn-secondary">' + esc(t.wardsNone) + "</button></div>";
  }

  if ($("wardPick")) {
    $("wardPick").addEventListener("change", function () { pickedWards = getPickedWards(); });
    $("wardPick").addEventListener("input", function () { pickedWards = getPickedWards(); });
    $("wardPick").addEventListener("click", function (e) {
      if (e.target.id === "wardAllBtn") { pickedWards = unitWardNumbers.map(String); renderWardPick(); }
      if (e.target.id === "wardNoneBtn") { pickedWards = []; renderWardPick(); }
    });
  }

  // One alert record for every affected ward
  function addAlert(type, source, wardList) {
    const wards = (wardList && wardList.length) ? wardList : [String(myArea.ward)];
    const base = Date.now();
    wards.forEach(function (w, i) {
      alerts.push({
        id: base + i,
        unitId: myArea.unitId,
        ward: Number(w),
        type: type,
        source: source,
        safeCount: 0,
        date: new Date().toLocaleString()
      });
    });
    writeJSON("alerts", alerts);
    renderAll();
    toast(wards.length > 1
      ? text[lang].alertSentMany.replace("{w}", wards.join(", "))
      : text[lang].alertSent);
  }

  function renderAlerts() {
    const t = text[lang];
    const mine = alerts.filter(inWard).sort(function (a, b) { return b.id - a.id; }).slice(0, 5);

    // newest alert for every OTHER ward of my local unit
    const others = {};
    alerts
      .filter(function (a) { return a.unitId === myArea.unitId && String(a.ward) !== String(myArea.ward); })
      .sort(function (a, b) { return a.id - b.id; })
      .forEach(function (a) { others[String(a.ward)] = a; });
    const otherKeys = Object.keys(others).sort(function (a, b) { return Number(a) - Number(b); });
    let otherHtml = "";
    if (otherKeys.length > 0) {
      otherHtml = '<div class="alert-other"><b>' + t.otherWards + "</b><br>" +
        otherKeys.map(function (n) { return t.ward + esc(n) + ": " + t.alertTitle[others[n].type]; }).join("<br>") +
        "</div>";
    }

    if (mine.length === 0) {
      $("alertBox").innerHTML = "<p>" + t.noAlerts + "</p>" + otherHtml;
      return;
    }

    let html = "";
    mine.forEach(function (a) {
      const sourceName = a.source === "forecast" ? t.sourceForecast : t.sourceSim;
      const demo = a.demo ? '<span class="tag">' + t.demoTag + "</span>" : "";
      html += `
        <div class="alert ${a.type}">
          <b>${t.alertTitle[a.type]} - ${esc(unitName(myUnit))}, ${t.ward}${esc(a.ward)}</b>
          <span class="tag">${sourceName}</span>${demo}
          <p>${t.alertText[a.type]}</p>
          <small>${esc(a.date)}</small><br>
          <button data-safe="${a.id}">${t.imSafe}</button>
          <span>${t.markedSafe}${a.safeCount}</span>
        </div>`;
    });
    $("alertBox").innerHTML = html + otherHtml;
  }

  $("alertBox").addEventListener("click", function (e) {
    const id = e.target.getAttribute("data-safe");
    if (id === null) return;
    const a = alerts.find(function (x) { return x.id === Number(id); });
    if (!a) return;
    a.safeCount = a.safeCount + 1;
    writeJSON("alerts", alerts);
    renderAll();
  });

  $("simulateBtn").addEventListener("click", function () {
    const picked = getPickedWards();
    if (picked.length === 0) { toast(text[lang].wardNone); return; }
    addAlert($("alertType").value, "simulation", picked);
  });

  // ---------- Real rain forecast (Open-Meteo, free, no key) ----------
  function formatDay(dateText) {
    const d = new Date(dateText + "T00:00:00");
    return d.toLocaleDateString(lang === "ne" ? "ne-NP" : "en-GB", {
      weekday: "short", day: "numeric", month: "short"
    });
  }

  function renderForecast() {
    const t = text[lang];
    if (lastForecast === null) {
      $("forecastBox").innerHTML = "";
      return;
    }

    let days = "";
    lastForecast.days.forEach(function (d) {
      days += '<div class="day"><span>' + formatDay(d.date) + "</span><b>" + d.mm.toFixed(1) + " mm</b></div>";
    });

    $("forecastBox").innerHTML =
      "<div>" + t.forecastTitle + "<b>" + lastForecast.total.toFixed(0) + " mm</b> " +
      '<span class="risk risk-' + lastForecast.risk + '">' + t.riskLabel + t[lastForecast.risk] + "</span></div>" +
      '<div class="forecast-days">' + days + "</div>" +
      '<p class="hint">' + t.forecastNote + "</p>";
  }

  $("forecastBtn").addEventListener("click", function () {
    const btn = $("forecastBtn");
    btn.disabled = true;
    $("forecastBox").textContent = text[lang].forecastLoading;

    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + pos.lat +
      "&longitude=" + pos.lng +
      "&daily=precipitation_sum&forecast_days=3&timezone=auto";

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then(function (data) {
        const days = data.daily.time.map(function (d, i) {
          return { date: d, mm: data.daily.precipitation_sum[i] || 0 };
        });

        let total = 0;
        days.forEach(function (d) { total = total + d.mm; });

        let risk = "low";
        if (total >= RAIN_HIGH) risk = "high";
        else if (total >= RAIN_MEDIUM) risk = "medium";

        lastForecast = { total: total, risk: risk, days: days };

        // Create a flood alert for medium/high risk (at most one per hour)
        let created = false;
        if (risk !== "low") {
          const recent = alerts.some(function (a) {
            return inWard(a) &&
                   a.source === "forecast" &&
                   Date.now() - a.id < 3600000;
          });
          if (!recent) {
            addAlert("flood", "forecast");
            created = true;
          }
        }
        if (!created) renderForecast();
      })
      .catch(function () {
        lastForecast = null;
        $("forecastBox").textContent = text[lang].forecastError;
      })
      .finally(function () {
        btn.disabled = false;
      });
  });

  // ---------- Damage reports ----------
  function renderReports() {
    const t = text[lang];
    const mine = reports.filter(inWard).sort(function (a, b) { return b.id - a.id; });

    if (mine.length === 0) {
      $("reportList").textContent = t.noReports;
      return;
    }

    let html = "";
    mine.forEach(function (r) {
      const demo = r.demo ? ' <span class="tag">' + t.demoTag + "</span>" : "";
      html += `
        <div class="report">
          <b>${esc(r.crop)}</b> - ${esc(r.area)} ${t.ropani} (${t.ward}${esc(r.ward)})${demo}<br>
          ${esc(r.details)}<br>
          <small>${esc(r.date)}</small><br>
          <button class="delete-btn" data-delete="${r.id}">${t.deleteBtn}</button>
        </div>`;
    });
    $("reportList").innerHTML = html;
  }

  $("reportList").addEventListener("click", function (e) {
    const id = e.target.getAttribute("data-delete");
    if (id === null) return;
    if (!confirm(text[lang].confirmDelete)) return;
    reports = reports.filter(function (r) { return r.id !== Number(id); });
    writeJSON("reports", reports);
    renderAll();
    toast(text[lang].reportDeleted);
  });

  $("reportBtn").addEventListener("click", function () {
    const t = text[lang];
    const crop = $("crop").value.trim();
    const area = $("area").value;
    const details = $("details").value.trim();

    if (crop === "" || area === "") {
      alert(t.fillFields);
      return;
    }
    if (Number(area) <= 0) {
      alert(t.badArea);
      return;
    }

    reports.push({
      id: Date.now(),
      crop: crop,
      area: area,
      details: details,
      unitId: myArea.unitId,
      ward: myArea.ward,
      date: new Date().toLocaleString()
    });
    writeJSON("reports", reports);

    $("crop").value = "";
    $("area").value = "";
    $("details").value = "";
    renderAll();
    toast(t.reportSaved);
  });

  // ---------- Relief requests ----------
  function renderRelief() {
    const t = text[lang];
    const mine = relief.filter(inWard).sort(function (a, b) { return b.id - a.id; });

    if (mine.length === 0) {
      $("reliefListBox").textContent = t.noRelief;
      return;
    }

    let html = "";
    mine.forEach(function (r) {
      const done = r.status === "delivered";
      const demo = r.demo ? ' <span class="tag">' + t.demoTag + "</span>" : "";
      html += `
        <div class="report">
          <b>${t[r.item]}</b> - ${esc(r.qty)} (${t.ward}${esc(r.ward)})${demo}<br>
          ${esc(r.note)}<br>
          <small>${esc(r.date)}</small><br>
          <b>${done ? t.delivered : t.pending}</b>
          ${done ? "" : `<button data-delivered="${r.id}">${t.markDelivered}</button>`}
        </div>`;
    });
    $("reliefListBox").innerHTML = html;
  }

  $("reliefListBox").addEventListener("click", function (e) {
    const id = e.target.getAttribute("data-delivered");
    if (id === null) return;
    const r = relief.find(function (x) { return x.id === Number(id); });
    if (!r) return;
    r.status = "delivered";
    writeJSON("relief", relief);
    renderAll();
  });

  $("reliefBtn").addEventListener("click", function () {
    const t = text[lang];
    const qty = $("reliefQty").value;

    if (qty === "" || Number(qty) <= 0) {
      alert(t.fillRelief);
      return;
    }

    relief.push({
      id: Date.now(),
      item: $("reliefItem").value,
      qty: qty,
      note: $("reliefNote").value.trim(),
      status: "pending",
      unitId: myArea.unitId,
      ward: myArea.ward,
      date: new Date().toLocaleString()
    });
    writeJSON("relief", relief);

    $("reliefQty").value = "";
    $("reliefNote").value = "";
    renderAll();
    toast(t.reliefSaved);
  });

  // ---------- Preparedness checklist ----------
  function prepPercent() {
    return Math.round(checked.length / CHECK_COUNT * 100);
  }

  function renderChecklist() {
    const t = text[lang];
    const percent = prepPercent();

    let html =
      "<b>" + t.prepScore + percent + "%</b>" +
      '<div class="progress"><div class="progress-bar" style="width:' + percent + '%"></div></div>';

    for (let i = 0; i < CHECK_COUNT; i++) {
      html += '<label class="check-item"><input type="checkbox" data-check="' + i + '"' +
        (checked.includes(i) ? " checked" : "") + "> " + t["check" + i] + "</label>";
    }
    $("checklistBox").innerHTML = html;
  }

  $("checklistBox").addEventListener("change", function (e) {
    const i = e.target.getAttribute("data-check");
    if (i === null) return;
    const n = Number(i);

    if (e.target.checked) {
      if (!checked.includes(n)) checked.push(n);
    } else {
      checked = checked.filter(function (x) { return x !== n; });
    }
    writeJSON(checklistKey, checked);
    renderChecklist();
    renderDashboard();
  });

  // ---------- Emergency contacts ----------
  function renderContacts() {
    const t = text[lang];
    let html = "";
    contacts.forEach(function (c) {
      html += '<a class="call-btn" href="tel:' + c.number + '">' + t[c.key] +
        "<b>" + c.number + "</b>" + t.call + "</a>";
    });
    $("contactsBox").innerHTML = html;
  }

  // ---------- Dashboard ----------
  function statBox(number, label) {
    return '<div class="stat"><b>' + number + "</b><span>" + label + "</span></div>";
  }

  let chart = null;

  function renderDashboard() {
    const t = text[lang];

    const myAlerts = alerts.filter(inWard);
    let safe = 0;
    myAlerts.forEach(function (a) { safe = safe + a.safeCount; });

    const myReports = reports.filter(inWard);
    let damaged = 0;
    myReports.forEach(function (r) { damaged = damaged + Number(r.area); });

    const myRelief = relief.filter(inWard);
    const pending = myRelief.filter(function (r) { return r.status === "pending"; }).length;

    $("stats").innerHTML =
      statBox(myAlerts.length, t.statAlerts) +
      statBox(safe, t.statSafe) +
      statBox(myReports.length, t.statReports) +
      statBox(Math.round(damaged * 10) / 10, t.statArea) +
      statBox(pending, t.statPending) +
      statBox(myRelief.length - pending, t.statDone) +
      statBox(prepPercent() + "%", t.statPrep);

    // Chart: damaged area for each crop
    const totals = {};
    myReports.forEach(function (r) {
      const key = r.crop.trim().toLowerCase();
      totals[key] = (totals[key] || 0) + Number(r.area);
    });
    const labels = Object.keys(totals);
    const values = labels.map(function (k) { return totals[k]; });

    if (chart) {
      chart.destroy();
      chart = null;
    }

    if (labels.length === 0 || typeof Chart === "undefined") {
      $("chartBox").style.display = "none";
      $("chartEmpty").style.display = "block";
      return;
    }

    $("chartBox").style.display = "block";
    $("chartEmpty").style.display = "none";

    chart = new Chart($("chart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{ label: t.chartTitle, data: values, backgroundColor: "#2e7d32" }]
      },
      options: {
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // ---------- Project tools ----------
  function loadDemo() {
    const now = Date.now();
    const id = myArea.unitId;
    const w = myArea.ward;
    const hour = 3600000;
    const when = function (h) { return new Date(now - h * hour).toLocaleString(); };

    alerts.push(
      { id: now - 2 * hour, unitId: id, ward: w, type: "flood", source: "simulation", safeCount: 14, date: when(2), demo: true },
      { id: now - 26 * hour, unitId: id, ward: w, type: "hailstorm", source: "simulation", safeCount: 9, date: when(26), demo: true }
    );

    reports.push(
      { id: now - 3 * hour, crop: "Paddy", area: "4.5", details: "Fields flooded after heavy rain.", unitId: id, ward: w, date: when(3), demo: true },
      { id: now - 4 * hour, crop: "Maize", area: "2", details: "Plants flattened by strong wind.", unitId: id, ward: w, date: when(4), demo: true },
      { id: now - 5 * hour, crop: "Vegetables", area: "1.5", details: "Hail damaged leaves and fruit.", unitId: id, ward: w, date: when(5), demo: true },
      { id: now - 6 * hour, crop: "Paddy", area: "3", details: "Water logging near the river bank.", unitId: id, ward: w, date: when(6), demo: true }
    );

    relief.push(
      { id: now - 7 * hour, item: "food", qty: "25", note: "Families near the river", status: "pending", unitId: id, ward: w, date: when(7), demo: true },
      { id: now - 8 * hour, item: "tent", qty: "8", note: "Temporary shelter", status: "pending", unitId: id, ward: w, date: when(8), demo: true },
      { id: now - 9 * hour, item: "medicine", qty: "40", note: "First aid kits", status: "delivered", unitId: id, ward: w, date: when(9), demo: true },
      { id: now - 10 * hour, item: "seeds", qty: "15", note: "Replanting support", status: "pending", unitId: id, ward: w, date: when(10), demo: true }
    );

    writeJSON("alerts", alerts);
    writeJSON("reports", reports);
    writeJSON("relief", relief);
    renderAll();
    toast(text[lang].demoLoaded);
  }

  function csvCell(value) {
    let s = String(value);
    // stop spreadsheet programs from running text that starts like a formula
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    const t = text[lang];
    const mine = reports.filter(inWard);

    if (mine.length === 0) {
      toast(t.nothingExport);
      return;
    }

    const rows = [["Date", "Province", "District", "Local unit", "Ward", "Crop", "Area (ropani)", "Details"]];
    mine.forEach(function (r) {
      rows.push([
        r.date,
        PROVINCE_BY_ID[DISTRICT_BY_ID[myUnit.districtId].provinceId].en,
        DISTRICT_BY_ID[myUnit.districtId].en,
        myUnit.en,
        r.ward, r.crop, r.area, r.details
      ]);
    });

    const csv = "\uFEFF" + rows.map(function (row) {
      return row.map(csvCell).join(",");
    }).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "damage-reports.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    if (!confirm(text[lang].confirmClear)) return;
    alerts = [];
    reports = [];
    relief = [];
    lastForecast = null;
    writeJSON("alerts", alerts);
    writeJSON("reports", reports);
    writeJSON("relief", relief);
    renderAll();
    toast(text[lang].cleared);
  }

  $("demoBtn").addEventListener("click", loadDemo);
  $("exportBtn").addEventListener("click", exportCsv);
  $("clearBtn").addEventListener("click", clearAll);

  // ---------- Banner ----------
  function showAreaBanner() {
    const t = text[lang];
    $("areaBanner").innerHTML =
      "<b>" + esc(unitName(myUnit)) + "</b>, " + t.ward + esc(myArea.ward) +
      " (" + esc(districtName(myUnit)) + ", " + esc(provinceName(myUnit)) + ")" +
      (hasGps
        ? ' <span class="tag">' + t.gpsTag +
          (myArea.gps.accuracy ? " ±" + Math.round(myArea.gps.accuracy) + " m" : "") + "</span>"
        : "") +
      ' <a href="location.html">' + t.change + "</a>";
  }

  // ---------- Draw everything ----------
  function renderAll() {
    showAreaBanner();
    renderAlerts();
    renderForecast();
    renderChecklist();
    renderDashboard();
    updateMap();
    renderReports();
    renderRelief();
    renderContacts();
  }

  // ---------- Language ----------
  function applyLanguage() {
    const t = text[lang];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const value = t[el.getAttribute("data-i18n")];
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const value = t[el.getAttribute("data-i18n-placeholder")];
      if (value !== undefined) el.placeholder = value;
    });

    $("langBtn").textContent = t.langButton;
    document.documentElement.lang = lang;
    renderAll();
  }

  $("langBtn").addEventListener("click", function () {
    lang = lang === "en" ? "ne" : "en";
    writeJSON("lang", lang);
    applyLanguage();
  });

  applyLanguage();
}