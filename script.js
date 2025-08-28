// light and dark mode

function mode()
{
  const toggleBtn = document.getElementById("mode");

if (localStorage.getItem("theme") === "dark") { //stores and check preffered theme
  document.body.classList.add("dark");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.innerHTML = "🌑";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.innerHTML = "☀️";
  }
});
}
mode();

// add teacher dialog box functionality
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


// store teacher data in local storage functionality
function teacher() {
  // Load teachers from localStorage (if available), otherwise default list
  let teachers = JSON.parse(localStorage.getItem("teachers")||"[]");

  const teachersTbody = document.querySelector("#teacherTable tbody");
  const superTbody = document.querySelector("#superTable tbody");
  const form = document.querySelector("#dialog-box form");

  if(!teachersTbody){
    return; 
  }

  function saveTeachers() {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }

  // Superintendent store
  function getSupers(){
    return JSON.parse(localStorage.getItem("superintendents")) || "[]";
  }
  function saveSupers(list){
    localStorage.setItem("superintendents", JSON.stringify(list));
    if(typeof updateSuperLinkState === 'function'){
      updateSuperLinkState();
    }
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

    if(teachers.length === 0) {
      const noDataRow = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; font-size: 18px; color: #666;">
            No data here 😢
          </td>
        </tr>
      `;
      teachersTbody.innerHTML = noDataRow;
    } else {
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
    
    // Update download button states after rendering
    updateDownloadButtonStates();
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
    } else {
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
    
      // Update download button states after rendering
  updateDownloadButtonStates();
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
      updateDownloadButtonStates();
      form.reset();
    });
  }

  // Initial render
  renderTable();
  renderSuperTable();
  
  // Check and update download button states
  updateDownloadButtonStates();

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
        window.__pendingDelete = { table: 'teacher', index: idx };
        const c4 = document.querySelector('#confirm-box4');
        if(window.gsap && c4){ gsap.to('#confirm-box4',{display:'flex'}) } else if(c4){ c4.style.display = 'flex'; }
      }
    } else if(target.closest && target.closest('.delete-teacher')){
      const btn = target.closest('.delete-teacher');
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if(!isNaN(idx)){
        window.__pendingDelete = { table: 'teacher', index: idx };
        const c4 = document.querySelector('#confirm-box4');
        if(window.gsap && c4){ gsap.to('#confirm-box4',{display:'flex'}) } else if(c4){ c4.style.display = 'flex'; }
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
        updateDownloadButtonStates(); // Update button states after moving teacher
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
        if(!isNaN(idx)){
          window.__pendingDelete = { table: 'super', index: idx };
          const c4 = document.querySelector('#confirm-box4');
          if(window.gsap && c4){ gsap.to('#confirm-box4',{display:'flex'}) } else if(c4){ c4.style.display = 'flex'; }
        }
      } else if(target.closest && target.closest('.delete-super')){
        const btn = target.closest('.delete-super');
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if(!isNaN(idx)){
          window.__pendingDelete = { table: 'super', index: idx };
          const c4 = document.querySelector('#confirm-box4');
          if(window.gsap && c4){ gsap.to('#confirm-box4',{display:'flex'}) } else if(c4){ c4.style.display = 'flex'; }
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

//deleting teacher (clear)
function deleteTeacher(){
  let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
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
      if(tbody){
        var noDataRow = '\n        <tr>\n          <td colspan="8" style="text-align: center; padding: 40px; font-size: 18px; color: #666;">\n            No data here 😢\n          </td>\n        </tr>\n      ';
        tbody.innerHTML = noDataRow;
      }
      localStorage.setItem("teachers", JSON.stringify([]));
      teachers.length = 0; // Update the local array
      
      // Close the dialog first
      if(window.gsap){
        gsap.to("#confirm-box1",{
          display:"none"
        })
        // Use a small delay to ensure dialog closes before updating buttons
        setTimeout(function() {
          updateDownloadButtonStates();
        }, 300);
      } else {
        // Fallback if GSAP is not available
        const confirmBox = document.querySelector("#confirm-box1");
        if(confirmBox) {
          confirmBox.style.display = "none";
        }
        updateDownloadButtonStates();
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

// delete superintendent (clear)
function deleteSuper(){
var clear=document.querySelector("#clear2");
  if(!clear){ return; }
  clear.addEventListener("click",function(){
    if(window.gsap){
      gsap.to("#confirm-box3",{
        display:"flex"
      })
    }
  })
  var yes=document.querySelector("#yes3");
  if(yes){
    yes.addEventListener("click",function(){
      const tbody = document.querySelector("#superTable tbody");
      if(tbody){
        var noDataRow = '\n        <tr>\n          <td colspan="7" style="text-align: center; padding: 40px; font-size: 18px; color: #666;">\n            No data here 😢\n          </td>\n        </tr>\n      ';
        tbody.innerHTML = noDataRow;
      }
      localStorage.setItem("superintendents", JSON.stringify([]));
      updateSuperLinkState();
      
      // Close the dialog first
      if(window.gsap){
        gsap.to("#confirm-box3",{
          display:"none"
        })
        // Use a small delay to ensure dialog closes before updating buttons
        setTimeout(function() {
          updateDownloadButtonStates();
        }, 300);
      } else {
        // Fallback if GSAP is not available
        const confirmBox = document.querySelector("#confirm-box3");
        if(confirmBox) {
          confirmBox.style.display = "none";
        }
        updateDownloadButtonStates();
      }
    })
  }
  var no=document.querySelector("#no3");
  if(no){
    no.addEventListener("click",function(){
      if(window.gsap){
        gsap.to("#confirm-box3",{
          display:"none"
        })
      }
    })
  }
}
deleteSuper()

// superintendent panel button enabled and disabled
function updateSuperLinkState(){
  var superLink = document.querySelector('#superintendent');
  if(!superLink) return;
  var supers = JSON.parse(localStorage.getItem('superintendents')) || [];
  if(supers.length === 0){
    superLink.classList.add('disabled');
  } else {
    superLink.classList.remove('disabled');
  }
}

// check availability of superintendent
function superintendent(){
  var superLink = document.querySelector("#superintendent");
  if(!superLink) return;
  updateSuperLinkState();
}
superintendent();

// update of superintendent button
(function bindSuperLinkAutoUpdate(){
  var superLink = document.querySelector('#superintendent');
  if(!superLink) return;
  function refresh(){ updateSuperLinkState(); }
  window.addEventListener('storage', refresh);
  document.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'visible'){ refresh(); } });
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
})();

// deletion of individual teacher and superintendent by clicking ❌
(function fastDeleteHook(){
  var pending = null;
  var box = document.querySelector('#confirm-box4');
  var yes = document.querySelector('#yes4');
  var no = document.querySelector('#no4');

  function showConfirm(){ if(window.gsap && box){ gsap.to('#confirm-box4',{display:'flex'}) } else if(box){ box.style.display = 'flex'; } }
  function hideConfirm(){ if(window.gsap && box){ gsap.to('#confirm-box4',{display:'none'}) } else if(box){ box.style.display = 'none'; } }
  function onYes(){
    if(!pending){ hideConfirm(); return; }
    if(pending.table === 'teacher'){
      var t = JSON.parse(localStorage.getItem('teachers')) || [];
      if(pending.index >= 0 && pending.index < t.length){ t.splice(pending.index, 1); localStorage.setItem('teachers', JSON.stringify(t)); }
    } else if(pending.table === 'super'){
      var s = JSON.parse(localStorage.getItem('superintendents')) || [];
      if(pending.index >= 0 && pending.index < s.length){
        var removed = s.splice(pending.index, 1)[0];
        localStorage.setItem('superintendents', JSON.stringify(s));
        var t2 = JSON.parse(localStorage.getItem('teachers')) || [];
        t2.push({ name: removed.name, mobile: removed.mobile, dept: removed.dept });
        localStorage.setItem('teachers', JSON.stringify(t2));
        if(typeof updateSuperLinkState === 'function'){ updateSuperLinkState(); }
      }
    }
    pending = null;
    hideConfirm();
    
    // Update button states before reloading
    if(typeof updateDownloadButtonStates === 'function'){
      updateDownloadButtonStates();
    }
    
    try { location.reload(); } catch(e) {}
  }
  function onNo(){ pending = null; hideConfirm(); }

  if(yes){ yes.addEventListener('click', function(e){ e.preventDefault(); onYes(); }); }
  if(no){ no.addEventListener('click', function(e){ e.preventDefault(); onNo(); }); }
  if(box){ box.addEventListener('click', function(e){ var t=e.target; if(!t) return; if(t.id==='yes4'){ e.preventDefault(); onYes(); } if(t.id==='no4'){ e.preventDefault(); onNo(); } }); }

  document.addEventListener('click', function(e){
    var target = e.target; if(!target) return;
    var delTeacher = target.closest ? target.closest('.delete-teacher') : null;
    var delSuper = target.closest ? target.closest('.delete-super') : null;
    if(delTeacher && delTeacher.getAttribute){ var idxT = parseInt(delTeacher.getAttribute('data-index'),10); if(!isNaN(idxT)){ pending = { table:'teacher', index: idxT }; showConfirm(); } }
    else if(delSuper && delSuper.getAttribute){ var idxS = parseInt(delSuper.getAttribute('data-index'),10); if(!isNaN(idxS)){ pending = { table:'super', index: idxS }; showConfirm(); } }
  });
})();

// Export to PDF handlers (landscape)
(function exportPdfHook(){
  var teacherBtn = document.querySelector('#exportTeachers');
  var superBtn = document.querySelector('#exportSupers');

  function exportTeachersStructured(){
    var table = document.querySelector('#teacherTable');
    if(!table || !window.jspdf || !window.jspdf.jsPDF) return;
    var doc = new window.jspdf.jsPDF({orientation: 'landscape', unit: 'pt', format: 'a4'});

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
  function getCellText(td){
    var select = td.querySelector("select");
    if(select){
      return select.options[select.selectedIndex].text.trim();
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

// superintendent login
function superLogin(){
  window.addEventListener('load', function(){
    (function superLoginAndGuard(){
     // If on login page, open dialog and handle login
     var loginDialog = document.querySelector('#dialog-box2');
     if(loginDialog){
       try {
         if(typeof loginDialog.showModal === 'function'){
           loginDialog.showModal();
         } else {
           // Fallback if <dialog> API not supported
           loginDialog.setAttribute('open','');
           loginDialog.style.display = 'flex';
         }
       } catch(e) {
         // Last resort fallback
         loginDialog.setAttribute('open','');
         loginDialog.style.display = 'flex';
       }
       var btn = document.querySelector('#superLoginBtn');
       function doLogin(e){
         if(e){ e.preventDefault(); }
         var idRaw = (document.querySelector('#id')||{}).value || '';
         var pwdRaw = (document.querySelector('#password')||{}).value || '';
         var id = String(idRaw).trim().toUpperCase();
         var pwd = String(pwdRaw).trim();
         var supers = JSON.parse(localStorage.getItem('superintendents')) || [];
         var found = supers.find(function(s){
           var sid = (s && s.id) ? String(s.id).trim().toUpperCase() : '';
           var spw = (s && s.password) ? String(s.password).trim() : '';
           return (sid===id && spw===pwd);
         });
         if(found){
           localStorage.setItem('super_session', JSON.stringify({ id: found.id, name: found.name, ts: Date.now() }));
           window.location.href = 'superintendent.html';
         } else {
           alert('Invalid ID or Password');
         }
       }
       if(btn){ btn.addEventListener('click', doLogin); }
       var form = loginDialog.querySelector('#superLoginForm');
       if(form){ form.addEventListener('submit', doLogin); }
       var idInput = document.querySelector('#id');
       var pwdInput = document.querySelector('#password');
       function onEnter(e){ if(e && e.key === 'Enter'){ e.preventDefault(); doLogin(e); } }
       if(idInput){ idInput.addEventListener('keydown', onEnter); }
       if(pwdInput){ pwdInput.addEventListener('keydown', onEnter); }
     }
     // If on superintendent page, enforce session and show logout
     var isSuperPage = !!document.querySelector('title') && /Superintendent Panel/i.test(document.title);
     if(isSuperPage){
       var sessionRaw = localStorage.getItem('super_session');
       if(!sessionRaw){
         window.location.href = 'superLogin.html';
         return;
       }
       // add simple logout button if not present
       var btn = document.querySelector('#logoutSuper');
       btn.addEventListener('click', function(){
        localStorage.removeItem('super_session');
        window.location.href = 'index.html';
      });
     }
    })();

   });
}
superLogin();

function importExcel(){
  const importExcelBtn = document.getElementById("import_excel");
  const importDialogBox = document.getElementById("import-dialog-box");
  const closeImportDialogBtn = document.getElementById("close-import-dialog");
  const importForm = document.getElementById("import-form");
  const excelFileInput = document.getElementById("excel_file");

  if (importExcelBtn && importDialogBox) {
    importExcelBtn.addEventListener("click", function() {
      if (window.gsap) {
        gsap.to(importDialogBox, {
          display: "flex",
          duration: 0.3, // Shorter duration for opening
          opacity: 1,
          scale: 1,
          ease: "power3.out"
        });
      } else {
        importDialogBox.style.display = "flex";
      }
    });
  }

  if (closeImportDialogBtn && importDialogBox) {
    closeImportDialogBtn.addEventListener("click", function() {
      if (window.gsap) {
        gsap.to(importDialogBox, {
          display: "none",
          duration: 0.3, // Shorter duration for closing
          opacity: 0,
          scale: 0.8,
          ease: "power3.in"
        });
      } else {
        importDialogBox.style.display = "none";
      }
      importForm.reset(); // Clear the file input
    });
  }
}
importExcel();

// File import and parsing logic
const importForm = document.getElementById("import-form");
if (importForm) {
  importForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const fileInput = document.getElementById("excel_file");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file to import.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      const data = event.target.result;
      let teachersData = [];

      if (file.name.endsWith(".csv")) {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            teachersData = results.data.map(row => ({
              name: row["Teacher Name"] || row["name"] || "",
              mobile: row["Mobile"] || row["mobile"] || "",
              dept: row["Department"] || row["dept"] || ""
            }));
            storeAndRenderTeachers(teachersData);
          }
        });
      } else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length > 1) {
          const headers = json[0];
          teachersData = json.slice(1).map(row => {
            let teacher = {};
            headers.forEach((header, index) => {
              const key = header.toLowerCase().replace(/ /g, '');
              if (key === "teachername" || key === "name") {
                teacher.name = row[index] || "";
              } else if (key === "mobile") {
                teacher.mobile = row[index] || "";
              } else if (key === "department" || key === "dept") {
                teacher.dept = row[index] || "";
              }
            });
            return teacher;
          });
        }
        storeAndRenderTeachers(teachersData);
      } else {
        alert("Unsupported file type. Please upload a CSV, XLS, or XLSX file.");
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
}

function storeAndRenderTeachers(newTeachers) {
  let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
  teachers = teachers.concat(newTeachers);
  localStorage.setItem("teachers", JSON.stringify(teachers));
  // Re-render the main teacher table
  teacher(); // Call the main teacher function to re-render the table
  // Close the import dialog
  const importDialogBox = document.getElementById("import-dialog-box");
  const importForm = document.getElementById("import-form");
  if (window.gsap && importDialogBox) {
    gsap.to(importDialogBox, {
      display: "none",
      duration: 0.3,
      opacity: 0,
      scale: 0.8,
      ease: "power3.in"
    });
  } else if (importDialogBox) {
    importDialogBox.style.display = "none";
  }
  if(importForm) importForm.reset();
  alert("Teacher data imported successfully!");
}

// Initialize download button states when page loads
window.addEventListener('load', function() {
  if(typeof updateDownloadButtonStates === 'function') {
    updateDownloadButtonStates();
  }
});

// Function to update download button states based on table data
  function updateDownloadButtonStates() {
    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
    let supers = JSON.parse(localStorage.getItem("superintendents")) || [];
    const teacherBtn = document.querySelector('#exportTeachers');
    const superBtn = document.querySelector('#exportSupers');
    
    if (teacherBtn) {
      if (teachers.length === 0) {
        teacherBtn.disabled = true;
        teacherBtn.style.opacity = '0.5';
        teacherBtn.style.cursor = 'not-allowed';
        teacherBtn.title = 'No teacher data available to download';
      } else {
        teacherBtn.disabled = false;
        teacherBtn.style.opacity = '1';
        teacherBtn.style.cursor = 'pointer';
        teacherBtn.title = 'Download teacher plan';
      }
    }
    
    if (superBtn) {
      if (supers.length === 0) {
        superBtn.disabled = true;
        superBtn.style.opacity = '0.5';
        superBtn.style.cursor = 'not-allowed';
        superBtn.title = 'No superintendent data available to download';
      } else {
        superBtn.disabled = false;
        superBtn.style.opacity = '1';
        superBtn.style.cursor = 'pointer';
        superBtn.title = 'Download superintendent plan';
      }
    }
  }