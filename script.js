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