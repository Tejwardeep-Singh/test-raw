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
    toggleBtn.innerHTML = "🌑";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.innerHTML = "☀️";
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
    return; 
  }

  function saveTeachers() {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }

  // Superintendent store
  function getSupers(){
    return JSON.parse(localStorage.getItem("superintendents")) || [];
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
      return;
    }
    else{
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
      if(tbody){
        var noDataRow = '\n        <tr>\n          <td colspan="8" style="text-align: center; padding: 40px; font-size: 18px; color: #666;">\n            No data here 😢\n          </td>\n        </tr>\n      ';
        tbody.innerHTML = noDataRow;
      }
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
      if(window.gsap){
        gsap.to("#confirm-box3",{
          display:"none"
        })
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

//   var yes4 = document.querySelector('#yes4');
//   var no4 = document.querySelector('#no4');
//   var box4 = document.querySelector('#confirm-box4');
//   function hideBox(){ if(window.gsap && box4){ gsap.to('#confirm-box4',{display:'none'}) } else if(box4){ box4.style.display = 'none'; } }
//   function handleYes(){
//       var ctx = window.__pendingDelete;
//       if(!ctx){ hideBox(); return; }
//       if(ctx.table === 'teacher'){
//         var tList = JSON.parse(localStorage.getItem('teachers')) || [];
//         if(ctx.index >= 0 && ctx.index < tList.length){
//           tList.splice(ctx.index, 1);
//           localStorage.setItem('teachers', JSON.stringify(tList));
//         }
//         // re-render if on controller page
//         // fallthrough to refresh
//       } else if(ctx.table === 'super'){
//         var sList = JSON.parse(localStorage.getItem('superintendents')) || [];
//         if(ctx.index >= 0 && ctx.index < sList.length){
//           var removed = sList.splice(ctx.index, 1)[0];
//           localStorage.setItem('superintendents', JSON.stringify(sList));
//           // move back to teachers WITHOUT id/password
//           var tList2 = JSON.parse(localStorage.getItem('teachers')) || [];
//           tList2.push({ name: removed.name, mobile: removed.mobile, dept: removed.dept });
//           localStorage.setItem('teachers', JSON.stringify(tList2));
//         }
//         if(typeof updateSuperLinkState === 'function'){ updateSuperLinkState(); }
//       }
//       window.__pendingDelete = null;
//       // refresh visible tables if present
//       var tBody = document.querySelector('#teacherTable tbody');
//       var sBody = document.querySelector('#superTable tbody');
//       if(tBody || sBody){ try { location.reload(); } catch(e) {} }
//       hideBox();
//   }
//   if(yes4){ yes4.addEventListener('click', handleYes); }
//   if(no4){ no4.addEventListener('click', hideBox); }
//   // Robust: delegate too, in case dynamic content replaces nodes
//   document.addEventListener('click', function(e){
//     var t = e.target;
//     if(!t) return;
//     var clickedYes = t.closest ? t.closest('#yes4') : null;
//     var clickedNo = t.closest ? t.closest('#no4') : null;
//     if(clickedYes){ e.preventDefault(); handleYes(); }
//     if(clickedNo){ e.preventDefault(); hideBox(); }
//   }, true);
//   // Container-scoped listener as another fallback
//   if(box4){
//     box4.addEventListener('click', function(e){
//       var t = e.target;
//       if(!t) return;
//       if(t.id === 'yes4'){ e.preventDefault(); handleYes(); }
//       if(t.id === 'no4'){ e.preventDefault(); hideBox(); }
//     });
//   }
// })();
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
function superintendent(){
  var superLink = document.querySelector("#superintendent");
  if(!superLink) return;
  updateSuperLinkState();
}
superintendent();

(function bindSuperLinkAutoUpdate(){
  var superLink = document.querySelector('#superintendent');
  if(!superLink) return;
  function refresh(){ updateSuperLinkState(); }
  window.addEventListener('storage', refresh);
  document.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'visible'){ refresh(); } });
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
})();

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
function updateSuperLinkState(){
  var superLink = document.querySelector("#superintendent");
  if(!superLink) return;
  var supers = JSON.parse(localStorage.getItem("superintendents")) || [];
  if(supers.length === 0){
    superLink.classList.add("disabled");
  } else {
    superLink.classList.remove("disabled");
  }
}
