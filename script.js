function mode()
{
    var mode=document.querySelector("#mode");
    var toggle=0;
    mode.addEventListener("click",function(){
        if(toggle==0)
        {
            gsap.to("body",{
            backgroundColor:"#222",
            color:"#dadada"
            });
            gsap.to("td,#pg1-container h2,#pg1-container h3,#header h1,#header h3,select",{
                color:"#dadada"
            });
gsap.to("#dialog-box input",{
color:"#111"
});
            mode.innerHTML="🌑";
            toggle=1;
        }
        else{
            gsap.to("body",{
            backgroundColor:"#dadada",
            color:"#111"
            });
            gsap.to("td,#pg1-container h2,#pg1-container h3,#header h1,#header h3,select",{
                color:"#111"
            });
            mode.innerHTML="☀️";
            toggle=0;
        }
    })
}
mode()
function toggle()
{
    var dialog=document.querySelector("#addTeacher");
    dialog.addEventListener("click",function(){
        gsap.to("#dialog-box",{
            display:"flex",
            duration:1
        })
    })
}
toggle();

function teacher()
{
    const teacherData = [];

  const form = document.getElementById("teacherForm");
  const tableBody = document.getElementById("teacherTableBody");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // get values
    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const dept = document.getElementById("dept").value;

    // push into array
    teacherData.push({ name, mobile, dept });

    // re-render table
    renderTable();

    // clear form
    form.reset();
  });

  function renderTable() {
    tableBody.innerHTML = ""; // clear old rows

    teacherData.forEach((teacher, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${teacher.name}</td>
        <td>${teacher.mobile}</td>
        <td>
          <select>
            <option value="select">Select</option>
            <option value="nf1">N-F1</option>
            <option value="nf2">N-F2</option>
            <option value="ns1">N-S1</option>
            <option value="ns2">N-S2</option>
          </select>
        </td>
        <td>${teacher.dept}</td>
        <td>
          <select>
            <option value="select">Select</option>
            <option value="newton">Newton</option>
            <option value="einstein">Einstein</option>
            <option value="pharma">Pharma</option>
            <option value="law">Law</option>
          </select>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }
}
teacher();