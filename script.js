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
    var box=document.querySelector("#dialog-box");
    if(dialog && box && window.gsap){
      dialog.addEventListener("click",function(){
          gsap.to("#dialog-box",{
              display:"flex",
              duration:1
          })
      })
      var close=document.querySelector("#dialog-box i");
      if(close){
        close.addEventListener("click",function(){
          gsap.to("#dialog-box",{
            display:"none"
          })
        })
      }
    }
}
toggle();
function teacher() {
  // Load teachers from localStorage (if available), otherwise default list
  let teachers = JSON.parse(localStorage.getItem("teachers")) || [
    { name: "SANTOKH SINGH", mobile: "xxxxx-xxxxx", dept: "CSE" },
    { name: "SHIVANI KUMARI", mobile: "xxxxx-xxxxx", dept: "CSE" },
    { name: "GURMESH SINGH", mobile: "xxxxx-xxxxx", dept: "CSE" },
    { name: "MANPREET KAUR", mobile: "xxxxx-xxxxx", dept: "CSE" }
  ];

  const teachersTbody = document.querySelector("#teacherTable tbody");
  const superTbody = document.querySelector("#superTable tbody");
  const form = document.querySelector("#dialog-box form");

  if(!teachersTbody){
    return; // not on controller page
  }

  // Save teachers to localStorage
  function saveTeachers() {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }

  // Superintendent store
  function getSupers(){
    return JSON.parse(localStorage.getItem("superintendents")) || [];
  }
  function saveSupers(list){
    localStorage.setItem("superintendents", JSON.stringify(list));
    updateSuperLinkState();
  }

  function generateId(){
    return "SUP-" + Math.random().toString(36).slice(2,8).toUpperCase();
  }
  function generatePassword(){
    const base = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    return base.slice(0,10);
  }

  // Render the table from array
  function renderTable() {
    teachersTbody.innerHTML = "";

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
          <td>
            <select>
              <option value="select">Select</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </td>
          <td>${t.dept.toUpperCase()}</td>
          <td><input type="radio" name='radio' class='radio' data-index='${i}'></td>    
          <td><button class='delete-teacher' data-index='${i}'><h4>❌</h4></button></td>
        </tr>
      `;
      teachersTbody.innerHTML += row;
    });
  }

  function renderSuperTable(){
    if(!superTbody) return;
    const supers = getSupers();
    superTbody.innerHTML = "";
    
    if(supers.length === 0) {
      // Show "no data" message with sad emoji when table is empty
      const noDataRow = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; font-size: 18px; color: #666;">
            No data here 😢
          </td>
        </tr>
      `;
      superTbody.innerHTML = noDataRow;
      return;
    }
    
    supers.forEach((s, i) => {
      const row = `
        <tr>
          <td>${i + 1}</td>
          <td>${s.name}</td>
          <td>${s.mobile}</td>
          <td>${s.dept.toUpperCase()}</td>
          <td>${s.id}</td>
          <td>${s.password}</td>
          <td><button class='delete-super' data-index='${i}'><h4>❌</h4></button></td>
        </tr>
      `;
      superTbody.innerHTML += row;
    });
  }

  // Handle form submission
  if(form){
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if(window.gsap){
        gsap.to("#dialog-box",{
          display:"none",
        })
      }
      const name = document.getElementById("name").value;
      const mobile = document.getElementById("mobile").value;
      const dept = document.getElementById("dept").value;

      teachers.push({ name, mobile, dept });
      saveTeachers();
      renderTable();
      form.reset();
    });
  }

  // Initial render
  renderTable();
  renderSuperTable();

  // Handle move to superintendent via confirm box
  var pendingIndex = null;
  const confirmBox = document.querySelector("#confirm-box2");
  const yes2 = document.querySelector("#yes2");
  const no2 = document.querySelector("#no2");

  // event delegation for radios
  teachersTbody.addEventListener("click", function(e){
    const target = e.target;
    if(target && target.classList && target.classList.contains("radio")){
      pendingIndex = parseInt(target.getAttribute("data-index"), 10);
      if(window.gsap && confirmBox){
        gsap.to("#confirm-box2",{ display:"flex" })
      } else if(confirmBox){
        confirmBox.style.display = "flex";
      }
    } else if(target && target.classList && target.classList.contains('delete-teacher')){
      const idx = parseInt(target.getAttribute('data-index'), 10);
      if(!isNaN(idx)){
        teachers.splice(idx, 1);
        saveTeachers();
        renderTable();
      }
    } else if(target.closest && target.closest('.delete-teacher')){
      const btn = target.closest('.delete-teacher');
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if(!isNaN(idx)){
        teachers.splice(idx, 1);
        saveTeachers();
        renderTable();
      }
    }
  });

  if(yes2){
    yes2.addEventListener("click", function(){
      if(pendingIndex !== null && pendingIndex >= 0 && pendingIndex < teachers.length){
        const teacherToMove = teachers.splice(pendingIndex, 1)[0];
        const supers = getSupers();
        supers.push({
          name: teacherToMove.name,
          mobile: teacherToMove.mobile,
          dept: teacherToMove.dept,
          id: generateId(),
          password: generatePassword()
        });
        saveTeachers();
        saveSupers(supers);
        renderTable();
        renderSuperTable();
      }
      pendingIndex = null;
      if(window.gsap && confirmBox){
        gsap.to("#confirm-box2",{ display:"none" })
      } else if(confirmBox){
        confirmBox.style.display = "none";
      }
    });
  }
  if(superTbody){
    superTbody.addEventListener('click', function(e){
      const target = e.target;
      if(target && target.classList && target.classList.contains('delete-super')){
        const idx = parseInt(target.getAttribute('data-index'), 10);
        const supers = getSupers();
        if(!isNaN(idx) && idx >= 0 && idx < supers.length){
          supers.splice(idx, 1);
          saveSupers(supers);
          renderSuperTable();
        }
      } else if(target.closest && target.closest('.delete-super')){
        const btn = target.closest('.delete-super');
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const supers = getSupers();
        if(!isNaN(idx) && idx >= 0 && idx < supers.length){
          supers.splice(idx, 1);
          saveSupers(supers);
          renderSuperTable();
        }
      }
    });
  }

  if(no2){
    no2.addEventListener("click", function(){
      pendingIndex = null;
      if(window.gsap && confirmBox){
        gsap.to("#confirm-box2",{ display:"none" })
      } else if(confirmBox){
        confirmBox.style.display = "none";
      }
    });
  }
}
teacher();
function deleteTeacher(){
  var clear=document.querySelector("#clear");
  if(!clear){ return; }
  clear.addEventListener("click",function(){
    if(window.gsap){
      gsap.to("#confirm-box1",{
        display:"flex"
      })
    }
  })
  var yes=document.querySelector("#yes1");
  if(yes){
    yes.addEventListener("click",function(){
      const tbody = document.querySelector("#teacherTable tbody");
      if(tbody){ tbody.innerHTML = ""; }
      localStorage.setItem("teachers", JSON.stringify([]));
      if(window.gsap){
        gsap.to("#confirm-box1",{
          display:"none"
        })
      }
    })
  }
  var no=document.querySelector("#no1");
  if(no){
    no.addEventListener("click",function(){
      if(window.gsap){
        gsap.to("#confirm-box1",{
          display:"none"
        })
      }
    })
  }
}
deleteTeacher()
function deleteSuper(){
var clear=document.querySelector("#clear2");
  if(!clear){ return; }
  clear.addEventListener("click",function(){
    if(window.gsap){
      gsap.to("#confirm-box1",{
        display:"flex"
      })
    }
  })
  var yes=document.querySelector("#yes1");
  if(yes){
    yes.addEventListener("click",function(){
      const tbody = document.querySelector("#superTable tbody");
      if(tbody){ tbody.innerHTML = ""; }
      localStorage.setItem("superintendents", JSON.stringify([]));
      if(window.gsap){
        gsap.to("#confirm-box1",{
          display:"none"
        })
      }
    })
  }
  var no=document.querySelector("#no1");
  if(no){
    no.addEventListener("click",function(){
      if(window.gsap){
        gsap.to("#confirm-box1",{
          display:"none"
        })
      }
    })
  }
}
deleteSuper()
function superintendent(){
  // kept for backward compatibility; logic handled inside teacher()
}
superintendent();

// Index page: toggle superintendent link enabled/disabled
function updateSuperLinkState(){
  var superLink = document.querySelector("#superintendent");
  var superTable=document.querySelector("#superTable tbody");
  if(!superLink) return;
  var supers = JSON.parse(localStorage.getItem("superintendents")) || [];
  if(supers.length === 0){
    superLink.classList.add("disabled");
  } else {
    superLink.classList.remove("disabled");
  }
}
updateSuperLinkState();

// Fast delete buttons (no dialog)
(function fastDeleteHook(){
  var deleteTeachersBtn = document.querySelector('#deleteTeachers h4');
  var deleteSupersBtn = document.querySelector('#deleteSupers h4');
  if(deleteTeachersBtn){
    deleteTeachersBtn.addEventListener('click', function(){
      localStorage.setItem('teachers', JSON.stringify([]));
      var tbody = document.querySelector('#teacherTable tbody');
      if(tbody){ tbody.innerHTML = ""; }
    });
  }
  if(deleteSupersBtn){
    deleteSupersBtn.addEventListener('click', function(){
      localStorage.setItem('superintendents', JSON.stringify([]));
      var tbody = document.querySelector('#superTable tbody');
      if(tbody){ tbody.innerHTML = ""; }
      updateSuperLinkState();
    });
  }
})();

// Export to PDF handlers (landscape)
(function exportPdfHook(){
  var teacherBtn = document.querySelector('#exportTeachers');
  var superBtn = document.querySelector('#exportSupers');

  function exportTeachersStructured(){
    var table = document.querySelector('#teacherTable');
    if(!table || !window.jspdf || !window.jspdf.jsPDF) return;
    var doc = new window.jspdf.jsPDF({orientation: 'landscape', unit: 'pt', format: 'a4'});

    // Add heading
    doc.setFontSize(18);
    doc.text("Global Group Of Institutes", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
    doc.setFontSize(14);
    doc.text("Teacher Table", doc.internal.pageSize.getWidth() / 2, 65, { align: "center" });

    var head = [['S.no', 'Teacher Name', 'Mobile', 'Room Number', 'Shift', 'Department']];
    var body = [];
    var rows = table.querySelectorAll('tbody tr');

    rows.forEach(function(tr){
      var tds = tr.querySelectorAll('td');
      if(tds.length >= 6){
        body.push([
          tds[0].textContent.trim(),
          tds[1].textContent.trim(),
          tds[2].textContent.trim(),
          getCellText(tds[3]),
          getCellText(tds[4]),
          getCellText(tds[5])
        ]);
      }
    });

    if(doc.autoTable){
      doc.autoTable({
        startY: 80,  // table starts after headings
        head: head,
        body: body,
        styles: { fontSize: 10 }
      });
    }
    doc.save('teachers.pdf');
  }

  function exportSupersStructured(){
    var table = document.querySelector('#superTable');
    if(!table || !window.jspdf || !window.jspdf.jsPDF) return;
    var doc = new window.jspdf.jsPDF({orientation: 'landscape', unit: 'pt', format: 'a4'});

    // Add heading
    doc.setFontSize(18);
    doc.text("Global Group Of Institutes", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
    doc.setFontSize(14);
    doc.text("Superintendent Table", doc.internal.pageSize.getWidth() / 2, 65, { align: "center" });

    var head = [['S.no', 'Teacher Name', 'Mobile', 'Department']];
    var body = [];
    var rows = table.querySelectorAll('tbody tr');

    rows.forEach(function(tr){
      var tds = tr.querySelectorAll('td');
      if(tds.length >= 4){
        body.push([
          tds[0].textContent.trim(),
          tds[1].textContent.trim(),
          tds[2].textContent.trim(),
          getCellText(tds[3])
        ]);
      }
    });

    if(doc.autoTable){
      doc.autoTable({
        startY: 80,
        head: head,
        body: body,
        styles: { fontSize: 10 }
      });
    }
    doc.save('superintendents.pdf');
  }

  // ✅ Helper to extract text correctly (fixes <select>)
  function getCellText(td){
    var select = td.querySelector("select");
    if(select){
      return select.options[select.selectedIndex].text.trim(); // only selected option
    }
    return td.textContent.trim();
  }

  if(teacherBtn){
    teacherBtn.addEventListener('click', exportTeachersStructured);
  }
  if(superBtn){
    superBtn.addEventListener('click', exportSupersStructured);
  }
})();
