function mode()
{
  const toggleBtn = document.getElementById("mode");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
}
mode();
function toggle()
{
    var dialog=document.querySelector("#addTeacher");
    dialog.addEventListener("click",function(){
        gsap.to("#dialog-box",{
            display:"flex",
            duration:1
        })
    })
    var close=document.querySelector("#dialog-box i");
    close.addEventListener("click",function(){
      gsap.to("#dialog-box",{
        display:"none"
      })
    })
}
function deleteTeacher(){
  var clear=document.querySelector("#clear");
  clear.addEventListener("click",function(){
    gsap.to("#confirm-box",{
      display:"flex"
    })
  })
  var yes=document.querySelector("#yes");
  yes.addEventListener("click",function(){
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    gsap.to("#confirm-box",{
      display:"none"
    })
  })
  var no=document.querySelector("#no");
  no.addEventListener("click",function(){
    gsap.to("#confirm-box",{
      display:"none"
    })
  })
}
deleteTeacher();
toggle();

function teacher() {
  // Load teachers from localStorage (if available), otherwise default list
  let teachers = JSON.parse(localStorage.getItem("teachers")) || [
    { name: "SANTOKH SINGH", mobile: "xxxxx-xxxxx", dept: "CSE" },
    { name: "SHIVANI KUMARI", mobile: "xxxxx-xxxxx", dept: "CSE" },
    { name: "GURMESH SINGH", mobile: "xxxxx-xxxxx", dept: "CSE" },
    { name: "MANPREET KAUR", mobile: "xxxxx-xxxxx", dept: "CSE" }
  ];

  const tableBody = document.querySelector("tbody");
  const form = document.querySelector("#dialog-box form");

  // Save teachers to localStorage
  function saveTeachers() {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }

  // Render the table from array
  function renderTable() {
    tableBody.innerHTML = "";

    teachers.forEach((t, i) => {
      const row = `
        <tr>
          <td>${i + 1}</td>
          <td>${t.name}</td>
          <td>${t.mobile}</td>
          <td>
            <select>
              <option value="select">Select</option>
              <option value="nf1">N-F1</option>
              <option value="nf2">N-F2</option>
              <option value="ns1">N-S1</option>
              <option value="ns2">N-S2</option>
            </select>
          </td>
          <td>${t.dept.toUpperCase()}</td>
          <td>
            <select>
              <option value="select">Select</option>
              <option value="newton">Newton</option>
              <option value="einstein">Einstein</option>
              <option value="pharma">Pharma</option>
              <option value="law">Law</option>
            </select>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  }

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    gsap.to("#dialog-box",{
      display:"none",
    })
    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const dept = document.getElementById("dept").value;

    teachers.push({ name, mobile, dept });
    saveTeachers();  // ✅ Save to localStorage
    renderTable();
    form.reset();
  });

  // Initial render
  renderTable();
}
teacher();
