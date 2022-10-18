const url = "https://hexschool.github.io/js-filter-data/data.json";
const list = document.querySelector(".showList");

let data = [];

//get data from url
function getData() {
  axios.get(url).then(function (response) {
    data = response.data.filter(
      (item) =>
        item.作物名稱 != null &&
        item.作物名稱 != "" &&
        item.交易量 != 0 &&
        item.種類代碼.trim() != ""
    );
    typeData = data;
    renderData(typeData);
    reset();
  });
}

getData();
//render data
function renderData(arr) {
  let str = "";
  arr.forEach((item) => {
    str += `<tr>
    <td>${item.作物名稱}</td>
    <td>${item.市場名稱}</td>
    <td>${item.上價}</td>
    <td>${item.中價}</td>
    <td>${item.下價}</td>
    <td>${item.平均價}</td>
    <td>${item.交易量}</td>
    </tr>`;
  });
  list.innerHTML = str;
}

//filter type
let typeData = [];
const buttons = document.querySelector(".button-group");
buttons.addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") {
    return;
  }
  let tabs = document.querySelectorAll(".button-group button");
  tabs.forEach((item) => {
    item.classList.remove("active");
  });
  let type = e.target.dataset.type;
  if (type == "all") {
    typeData = data;
  } else if (type == "N04") {
    typeData = data.filter((item) => item.種類代碼 == "N04");
  } else if (type == "N05") {
    typeData = data.filter((item) => item.種類代碼 == "N05");
  } else if (type == "N06") {
    typeData = data.filter((item) => item.種類代碼 == "N06");
  }
  e.target.classList.add("active");
  renderData(typeData);
  reset();
  searchResult.textContent = "";
});

//search bar
const search = document.querySelector(".search-group");
const crop = document.querySelector("#crop");
search.addEventListener("click", (e) => {
  if (e.target.nodeName != "BUTTON" || crop.value.trim() == "") {
    return;
  }
  searchFor();
});

crop.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    searchFor();
  }
});

const searchResult = document.querySelector("#js-crop-name");
function searchFor() {
  typeData = typeData.filter((item) => {
    let result = crop.value.trim();
    searchResult.textContent = `查看「${result}」的比價結果`;
    return item.作物名稱.toLowerCase().match(result.toLowerCase());
  });
  if (typeData.length == 0) {
    list.innerHTML = `<tr><td colspan="6" class="text-center p-3">查詢不到交易資訊QQ</td></tr>`;
  } else {
    renderData(typeData);
  }
  reset();
  crop.value = "";
}

//sort select
const sort = document.querySelector(".sort-select");
sort.addEventListener("change", (e) => {
  switch (e.target.value) {
    case "依上價排序":
      selectChange("上價");
      break;
    case "依中價排序":
      selectChange("中價");
      break;
    case "依下價排序":
      selectChange("下價");
      break;
    case "依平均價排序":
      selectChange("平均價");
      break;
    case "依交易量排序":
      selectChange("交易量");
      break;
    default:
  }
});

function selectChange(value) {
  typeData.sort((a, b) => {
    return a[value] - b[value];
  });
  renderData(typeData);
}

//sort by arrows
const sortAdv = document.querySelector(".js-sort-advanced");
sortAdv.addEventListener("click", (e) => {
  if (e.target.nodeName == "I") {
    let sortPrice = e.target.dataset.price;
    let sortArrow = e.target.dataset.sort;
    sort.value = `依${sortPrice}排序`;
    if (sortArrow == "up") {
      typeData.sort((a, b) => {
        return b[sortPrice] - a[sortPrice];
      });
    } else {
      typeData.sort((a, b) => {
        return a[sortPrice] - b[sortPrice];
      });
    }
    renderData(typeData);
  }
});

//reset sort value to default
function reset() {
  if (sort.value != "排序篩選") {
    sort.value = "排序篩選";
  }
}
