let websites = {};
let dataLoaded = false;

// تحميل البيانات
function loadWebsitesData() {
  if (dataLoaded) return Promise.resolve();

  const files = [
    './data/QBS.json',
    './data/QRS.json',
    './data/QUS.json',
    './data/QWS.json',
    './data/QMS.json',
    './data/websites.json',
    './data/alasyah.json'
  ];

  const fetchPromises = files.map(file =>
    fetch(file)
      .then(res => {
        if (!res.ok) {
          throw new Error(`خطأ في تحميل الملف: ${file}`);
        }
        return res.json();
      })
  );

  return Promise.all(fetchPromises)
    .then(dataArray => {
      dataArray.forEach(data => {
        Object.assign(websites, data);
      });
      dataLoaded = true;
      console.log("✅ تم تحميل البيانات");
    })
    .catch(error => {
      console.error("❌ خطأ:", error);
    });
}


// عناصر الصفحة
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");
const suggestionsContainer = document.getElementById("suggestions");


// البحث التلقائي
let searchTimer;

if (searchInput) {
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      showSuggestions(this.value.trim());
    }, 300);
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch(this.value.trim());
      suggestionsContainer.style.display = "none";
    }
  });
}


// إخفاء الاقتراحات
document.addEventListener("click", function (e) {
  if (
    searchInput &&
    suggestionsContainer &&
    !searchInput.contains(e.target) &&
    !suggestionsContainer.contains(e.target)
  ) {
    suggestionsContainer.style.display = "none";
  }
});


// ✅ عرض الاقتراحات (المهم)
function showSuggestions(searchTerm) {
  loadWebsitesData().then(() => {

    suggestionsContainer.innerHTML = "";
    suggestionsContainer.style.display = "none";

    if (!searchTerm) return;

    const matches = Object.keys(websites)
      .filter(key =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);

    if (matches.length > 0) {
      matches.forEach(key => {
        const item = document.createElement("div");
        item.textContent = key;
        item.className = "suggestion-item";

        item.onclick = () => {
          searchInput.value = key;
          performSearch(key);
          suggestionsContainer.style.display = "none";
        };

        suggestionsContainer.appendChild(item);
      });

      suggestionsContainer.style.display = "block";
    }

  });
}


// ✅ تنفيذ البحث (المهم)
function performSearch(searchTerm) {
  loadWebsitesData().then(() => {

    resultsContainer.innerHTML = "<p>جارٍ البحث...</p>";

    if (!searchTerm) {
      resultsContainer.innerHTML = "<p>الرجاء إدخال كلمة للبحث</p>";
      return;
    }

    const foundKey = Object.keys(websites).find(key =>
      key.toLowerCase() === searchTerm.toLowerCase()
    );

    if (foundKey) {
      resultsContainer.innerHTML = "";

      const link = document.createElement("a");
      link.href = websites[foundKey];
      link.textContent = "انقر هنا للانتقال إلى الموقع";
      link.target = "_blank";
      link.className = "result-link";

      resultsContainer.appendChild(link);

    } else {
      resultsContainer.innerHTML = "<p>لم يتم العثور على الموقع</p>";
    }

  });
}
