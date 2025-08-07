
document.addEventListener("DOMContentLoaded", (event) => {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn){
    submitBtn.addEventListener("click", handleSubmit);
  }

  // if Search bar value exists and user clciks on search btn then call fetchFiletered func which further calls loadReports with searchQuery and page 1 as values 
  const searchBtn = document.getElementById("searchBtn")
  if (searchBtn) {
    searchBtn.addEventListener("click", fetchFilteredReports)
  }
});

// document.addEventListener("DOMContentLoaded", fetchReports);

const readableTime = new Date().toLocaleString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

function handleSubmit() {
  // event.preventDefault()
  const typeOfIncident = document.getElementById("typeDropdownValue").textContent;
  const location = document.getElementById("location").value.trim();
  const description = document.getElementById("description").value.trim();
  const landmarks = document.getElementById("landmarks").value.trim();
  const known = document.getElementById("knownDropdownValue").textContent;
  const gender = document.getElementById("genderDropdownBtn").textContent.trim();
  // becoz of .value it is showing undefined for known and jst "" for gender

  console.log("type:", document.getElementById("typeDropdownValue").textContent)
  console.log("location field:", document.getElementById("location").value);
console.log("description field:", document.getElementById("description").value);
console.log("landmarks field:", document.getElementById("landmarks").value);

//   Simple validation
// only push this alert when type is empty type = null and location = null and description = null
// don't psuh this alert if !type = false i.e type = true(contains some value) and we know false && anything = false
// if at any one of them is false then we push this alert  
if (!typeOfIncident && !location && !description) {
    alert("Please fill in Type, Location, and Description.");
    return;
  }

  

  const report = {
    typeOfIncident,
    location,
    description,
    landmarks,
    attackerKnown: known,
    attackerGender: gender,
    timeStamp: readableTime
  };

  console.log("Incident Report Submitted:", report);

  
    // alert("✅ Incident report submitted successfully.");
  // replace abv 2 lines by fetch funcn to connect frontend and backend on form submit

  fetch("https://auraguard.onrender.com/api/report/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(report)
})
  .then(response => {
    console.log("Response status:", response.status);
    return response.json();
  })
  .then(data => {
    console.log("response data: ", data)

    if (data.status === "success") {
      alert("✅ Incident report submitted successfully.");

      

      // Reset form
      document.querySelector("form").reset();
      // Reset dropdowns properly
      resetDropdowns();


      // Hide form, show thank-you
      document.getElementById("formcontainer").classList.add("hidden");
      document.getElementById("thankYouContainer").classList.remove("hidden");

      // automatically revert after 45 sec
      setTimeout(() => {
        document.getElementById("thankYouContainer").classList.add("hidden")
        document.getElementById("formcontainer").classList.remove("hidden")

        // Reset dropdowns properly
        resetDropdowns();

      }, 8000)
      
    } else {
      alert("❌ Submission failed: " + data.message);
    }
  })
  .catch(error => {
    console.error("❌ Error submitting report:", error);
    alert("❌ Something went wrong while submitting.");
  });

}

// -----------------------------------------------------------------
// --------------------------Reset dropdowns properly----------------
function resetDropdowns() {
  const dropdownIds = ['type', 'known', 'gender'];
  
  dropdownIds.forEach(id => {
    // Reset display text
    document.getElementById(`${id}DropdownValue`).textContent = 'Select';
    
    // Reset hidden input values
    const input = document.getElementById(`${id}Input`);
    if (input) {
      input.value = '';
    }
    
    // Make sure dropdown menus are closed
    const menu = document.getElementById(`${id}DropdownMenu`);
    if (menu) {
      menu.classList.add('hidden');
      menu.classList.add('opacity-0', 'scale-95');
      menu.classList.remove('opacity-100', 'scale-100');
    }
  });
}



// Handles show/hide of dropdown menu
function toggleDropdown(id) {
  const menu = document.getElementById(`${id}DropdownMenu`);
  menu.classList.toggle('hidden');
  if (!menu.classList.contains('hidden')) {
    requestAnimationFrame(() => {
      menu.classList.remove('opacity-0', 'scale-95');
      menu.classList.add('opacity-100', 'scale-100');
    });
  } else {
    menu.classList.add('opacity-0', 'scale-95');
    menu.classList.remove('opacity-100', 'scale-100');
  }
}

  // Object to store all selected dropdown values
const selectedValues = {
  known: '',
  gender: '',
  type: ''
};

// Handles selection of an option
function selectDropdownOption(id, value, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // 1. Update visible text
  document.getElementById(`${id}DropdownValue`).textContent = value;

  // 2. Update hidden input value
  const input = document.getElementById(`${id}Input`);
  if (input) {
    input.value = value;
  }

  // 3. Close the dropdown
  document.getElementById(`${id}DropdownMenu`).classList.add('hidden');
}


// Auto-hide all dropdowns if clicking outside
window.addEventListener('click', function (e) {
  const ids = ['known', 'gender', 'type'];
  ids.forEach(id => {
    const btn = document.getElementById(`${id}DropdownBtn`);
    const menu = document.getElementById(`${id}DropdownMenu`);
    if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
});

// ------------------------------
// Section Switcher for Tabs
// ------------------------------

function showSection(sectionId) {
  const sections = ['formcontainer', 'reports-section', 'facts-section', 'help-section'];
  sections.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(sectionId).classList.remove('hidden');
}

// Add listeners to navbar tabs
document.getElementById('tab-home').addEventListener('click', () => showSection('formcontainer'));

document.getElementById('tab-reports').addEventListener('click', () => {
  showSection('reports-section');
  // fetchFilteredReports(); // load reports dynamically
  loadReports(1)// UPDATED VERSION OF FETCH FILTERED
});

document.getElementById('tab-facts').addEventListener('click', () => {
  showSection('facts-section');
  
})

document.getElementById('tab-help').addEventListener('click', () => showSection('help-section'));


// ======----------------------------- FACTS SECTION ----------------==========
const facts = [
  "Only 1 in 10 harassment cases in India are reported to the police.",
  "35% of women globally have experienced physical or sexual violence.",
  "Many victims don’t report crimes due to fear or shame.",
  "Awareness campaigns increase reporting by up to 50% in urban areas.",
  "Crimes against women rose by 15% in the past 5 years in India.",
  "Most attacks are by someone the victim knows — not a stranger.",
  "Every 10 minutes, a woman is assaulted somewhere in the country.",
  "Legal help is free in many states for survivors of violence.",
  "You have the right to file a Zero FIR at any police station — even outside the incident location.",
  "Less than 5% of women report online abuse, even though it is a punishable offense.",
  "You can approach the National Commission for Women (NCW) directly through their website.",
"Every incident reported helps break the silence and shape a safer world for all."
];

function showRandomFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  const display = document.getElementById("factDisplay");
  if (display) display.textContent = fact;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("showFactBtn");
  if (btn) {
    btn.addEventListener("click", showRandomFact);
    showRandomFact(); // show one by default
  }
});
// ------------------------------------------------------------------------------


async function fetchFilteredReports() {
  const query = document.getElementById("default-search").value.trim();
  // Reset to page 1 when searching
  await loadReports(1, query);
    }

// ----------------------------------------------------------------------
    //                  LOAD REPORTS WITH SEARCH, PAGINATION AND SORTING
    // ------------------------------------------------------------------

let currentPage = 1;
let totalPages = 1;
const limitPerPage = 5;


async function loadReports(page = 1, searchQuery = '') {
  try {
    // Clean search query
    const cleanSearch = searchQuery ? searchQuery.trim() : '';
    
    // Build URL with parameters
    let url = "https://auraguard.onrender.com/api/report/reports";
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page', page.toString());
    params.append('limit', limitPerPage.toString());
    
    // Add search if exists
    if (cleanSearch) {
      params.append('search', cleanSearch);
    }
    
    // Add sorting
    const sortValue = document.getElementById('sortSelect')?.value || 'latest';
    if (sortValue === 'oldest') {
      params.append('sort', 'timeStamp');
    } else {
      params.append('sort', '-timeStamp');
    }
    
    url += `?${params.toString()}`;
    console.log('Fetching:', url);

    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Response:', data);

    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch reports');
    }

    const reports = data.data.reports;
    
    // Update pagination variables
    currentPage = data.page;
    totalPages = Math.ceil(data.total / data.limit);
    
    // Render reports
    renderReports(reports);
    
    // Update pagination UI
    updatePaginationUI();

  } catch (err) {
    console.error('Error loading reports:', err);
    const container = document.getElementById('reportList');
    if (container) {
      container.innerHTML = '<p class="text-center text-red-600">Error loading reports. Please try again.</p>';
    }
  }
}

// --------------------------------------Helper function to update pagination UI--------------------
function updatePaginationUI() {
  const pageIndicator = document.getElementById('pageIndicator');
  if (pageIndicator) {
    pageIndicator.innerText = `Page ${currentPage} of ${totalPages}`;
  }
  
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
    prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
    prevBtn.classList.toggle('cursor-not-allowed', prevBtn.disabled);
  }
  
  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.classList.toggle('opacity-50', nextBtn.disabled);
    nextBtn.classList.toggle('cursor-not-allowed', nextBtn.disabled);
  }
}


// --------------------- Add pagination button event listeners--------------------:
document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentPage > 1) {
    const searchQuery = document.getElementById("default-search").value.trim();
    loadReports(currentPage - 1, searchQuery);
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentPage < totalPages) {
    const searchQuery = document.getElementById("default-search").value.trim();
    loadReports(currentPage + 1, searchQuery);
  }
});


// ----------------------------------------BELOW WILL DISPLAY REPORTS------------------
// Render report cards
function renderReports(reports) {
  const container = document.getElementById('reportList');
  container.innerHTML = '';

  if (reports.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-600">No reports found.</p>';
    return;
  }

  reports.forEach(report => {
    const card = document.createElement('div');
    card.classList.add('bg-white', 'shadow', 'rounded-lg', 'p-4', 'mb-4');

    card.innerHTML = `
      <h3 class="text-lg font-semibold mb-1">${report.typeOfIncident}</h3>
      <p><strong>Location:</strong> ${report.location}</p>
      <p><strong>Landmarks:</strong> ${report.landmarks}</p>
      <p><strong>Description:</strong> ${report.description}</p>
      <p><strong>Attacker Gender:</strong> ${report.attackerGender}</p>
      <p><strong>Timestamp:</strong> ${report.timeStamp}</p>
    `;

    container.appendChild(card);
  });
}


// ------------------------------ADD event listener for SORT BY dropdown------------------------------
document.getElementById('sortSelect').addEventListener('change', () => {
  const searchQuery = document.getElementById("default-search").value.trim()
  loadReports(1, searchQuery); //if user enters searchQuery then changes sort by value
} )


// -----------------------------------------------
// ----------------------VIEWS COUNTER----------------
document.addEventListener("DOMContentLoaded", () => {
  fetch('https://auraguard.onrender.com/api/views')
    .then(res => res.json())
    .then(data => {
      const counter = document.getElementById('view-counter');
      if (counter) {
        counter.textContent = data.views;
      }
    })
    .catch(err => {
      console.error('Error fetching view count:', err);
    });
});
