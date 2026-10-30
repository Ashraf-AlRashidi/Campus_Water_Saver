const STORAGE_KEY = "campusWaterSaverReports";
const demoReports = [
  {id:"CWS-204815",name:"Demo Student",email:"demo@aiu.edu.eg",location:"Library",issue:"Dripping tap",specific:"Ground floor",description:"Demo report for interface preview.",status:"Resolved",date:"2026-10-20"},
  {id:"CWS-204712",name:"Demo Student",email:"demo@aiu.edu.eg",location:"Student Hub",issue:"Running toilet",specific:"Restroom",description:"Demo report for interface preview.",status:"Pending",date:"2026-10-21"},
  {id:"CWS-204603",name:"Demo Student",email:"demo@aiu.edu.eg",location:"Restrooms",issue:"Leaking pipe",specific:"First floor",description:"Demo report for interface preview.",status:"Under inspection",date:"2026-10-22"},
  {id:"CWS-204501",name:"Demo Student",email:"demo@aiu.edu.eg",location:"Academic Building",issue:"Water pooling",specific:"Near entrance",description:"Demo report for interface preview.",status:"Resolved",date:"2026-10-23"},
  {id:"CWS-204398",name:"Demo Student",email:"demo@aiu.edu.eg",location:"Laboratories",issue:"Dripping tap",specific:"Lab corridor",description:"Demo report for interface preview.",status:"Pending",date:"2026-10-24"},
  {id:"CWS-204287",name:"Demo Student",email:"demo@aiu.edu.eg",location:"Outdoor Area",issue:"Broken water fixture",specific:"Garden",description:"Demo report for interface preview.",status:"Under inspection",date:"2026-10-25"},
  {id:"CWS-204176",name:"Demo Student",email:"demo@aiu.edu.eg",location:"Sports Facilities",issue:"Leaking pipe",specific:"Changing area",description:"Demo report for interface preview.",status:"Resolved",date:"2026-10-26"},
  {id:"CWS-204065",name:"Demo Student",email:"demo@aiu.edu.eg",location:"Library",issue:"Running toilet",specific:"Second floor",description:"Demo report for interface preview.",status:"Pending",date:"2026-10-27"}
];
const $ = (id) => document.getElementById(id);
function getReports(){
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(saved) ? saved : demoReports; }
  catch { return demoReports; }
}
function saveReports(reports){ localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); }
function statusClass(status){ return status === "Resolved" ? "resolved" : status === "Under inspection" ? "review" : "pending"; }
function renderDashboard(){
  const reports = getReports();
  const pending = reports.filter(r=>r.status==="Pending").length;
  const review = reports.filter(r=>r.status==="Under inspection").length;
  const resolved = reports.filter(r=>r.status==="Resolved").length;
  $("totalReports").textContent = String(reports.length).padStart(2,"0");
  $("pendingReports").textContent = String(pending).padStart(2,"0");
  $("reviewReports").textContent = String(review).padStart(2,"0");
  $("resolvedReports").textContent = String(resolved).padStart(2,"0");
  $("reportsTable").innerHTML = reports.slice().reverse().slice(0,6).map(r=>`<tr><td>${escapeHtml(r.id)}</td><td>${escapeHtml(r.location)}</td><td>${escapeHtml(r.issue)}</td><td><span class="status-pill ${statusClass(r.status)}">${escapeHtml(r.status)}</span></td></tr>`).join("") || '<tr><td colspan="4">No reports yet</td></tr>';
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("reportForm").addEventListener("submit", e=>{
  e.preventDefault();
  const report = {
    id:"CWS-"+Math.floor(100000+Math.random()*900000),
    name:$("studentName").value.trim(), email:$("studentEmail").value.trim(),
    location:$("location").value, issue:$("issueType").value,
    specific:$("specificLocation").value.trim(), description:$("description").value.trim(),
    status:"Pending", date:new Date().toISOString().slice(0,10)
  };
  const reports=getReports(); reports.push(report); saveReports(reports); renderDashboard();
  $("successMessage").innerHTML=`Your demo report was submitted successfully. Your report ID is <strong>${report.id}</strong>. Save this ID to track its status.`;
  $("successMessage").classList.add("show");
  $("trackId").value=report.id;
  $("reportForm").reset(); $("charCount").textContent="0";
  $("successMessage").scrollIntoView({behavior:"smooth",block:"nearest"});
});
$("trackForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=$("trackId").value.trim().toUpperCase();
  const report=getReports().find(r=>r.id.toUpperCase()===id);
  $("trackResult").innerHTML=report
    ? `Report <strong>${escapeHtml(report.id)}</strong> · ${escapeHtml(report.location)} · ${escapeHtml(report.issue)} <span class="status-pill ${statusClass(report.status)}">${escapeHtml(report.status)}</span><br><small>Submitted: ${escapeHtml(report.date)} · Demonstration status only</small>`
    : "We could not find that report ID in this browser. Check the ID and try again.";
});
$("description").addEventListener("input",()=>{$("charCount").textContent=$("description").value.length;});
$("menuToggle").addEventListener("click",()=>$("nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));
document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",()=>{
  document.querySelectorAll(".nav-link").forEach(x=>x.classList.remove("active"));a.classList.add("active");
}));
renderDashboard();
