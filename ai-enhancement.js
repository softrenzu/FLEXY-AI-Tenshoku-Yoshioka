/* Optional real AI mode on Vercel. On GitHub Pages / Sakura static hosting, local demo remains usable. */
(function () {
"use strict";
const button=document.getElementById("run");
const host=window.location.hostname;
if (!button || host.endsWith("github.io") || window.location.protocol==="file:") return;
let serial=0;
button.addEventListener("click",async function(){
  const id=++serial;
  const originalLabel=button.textContent;
  button.textContent="AIが架空企業を逆面接中…";
  button.disabled=true;
  const controller=new AbortController();
  const clock=setTimeout(()=>controller.abort(),15000);
  try {
    const job=document.getElementById("job").value;
    const salary=Number(document.getElementById("salary").value);
    const style=document.getElementById("style").value;
    const r=await fetch("/api/interview",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({job,salary,style}),signal:controller.signal});
    if (!r.ok) return;
    const data=await r.json();
    if (id!==serial || data.mode!=="ai" || !Array.isArray(data.interviews) || data.interviews.length!==3) return;
    const logs=document.getElementById("logs");
    if (!logs) return;
    logs.replaceChildren();
    data.interviews.forEach(item=>{
      const block=document.createElement("div");
      block.className="log";
      const heading=document.createElement("strong");
      heading.textContent="あなたの代理AI → "+item.name;
      const question=document.createElement("p");
      question.textContent="「"+String(item.question||"")+"」";
      const company=document.createElement("strong");
      company.textContent="架空企業AI →";
      const answer=document.createElement("p");
      answer.textContent="「"+String(item.answer||"")+"」";
      block.append(heading,question,company,answer);
      logs.appendChild(block);
    });
    const info=document.createElement("p");
    info.className="muted";
    info.textContent=data.notice||"AIによる架空企業の応答です。";
    logs.prepend(info);
  } catch (_) { /* retain the working local simulation */ }
  finally { clearTimeout(clock); if(id===serial){button.disabled=false;button.textContent=originalLabel;} }
});
})();
