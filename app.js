const defaultParticipants = [
  {last:"Dittert", first:"Sebastian", kst:"13701"},
  {last:"Hachenberg", first:"Marcel", kst:"13701"},
  {last:"Schiffner", first:"Pierre", kst:"50212"},
  {last:"Treichel", first:"Viktor", kst:"50212"},
  {last:"Schmidt", first:"Steffen", kst:"25901"},
  {last:"Caltepe", first:"Yusuf", kst:"25901"},
  {last:"Warkentin", first:"Kevin", kst:"4140002611"},
  {last:"Birinci", first:"Enez", kst:"25702"},
  {last:"Bavtijari", first:"Nebi", kst:"25702"},
  {last:"Przystarz", first:"Krystian", kst:"25705"}
];
const participants = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem("attendance-participants") || "null");
    return Array.isArray(saved) && saved.length ? saved : defaultParticipants.map(p=>({...p}));
  } catch { return defaultParticipants.map(p=>({...p})); }
})();
// Erstimport der historischen Listen. ? = noch manuell zu prüfen; zählt NICHT als Anwesenheit.
const historicalSeed = {
 '2025-04':[2,5,23,26,28], '2025-06':[11,14,16,18,28], '2025-07':[2], '2025-08':[20,23,25,30],
 '2025-11':[1,3,5,8,10,12,15,17,19,24,29], '2025-12':[1,3,6,8,10,13,15,20],
 '2026-01':[12,14,17,19,21,24,26,28,31], '2026-02':[2,4,7,9,11,14,16,18,21,23,25],
 '2026-03':[2,4,9,11,14,18,21,23,25,28], '2026-04':[15],
 '2026-05':[4,6,9,11,13,18,20,27,30], '2026-06':[1,3,8,10,13,15,17,20,22,24],
 '2026-08':[8,10,12,15,17,19,22,24,26,29,31],
 '2026-09':[2,5,7,9,14,16,19,21,23,26,28,30]
};
// Gut lesbare Einträge aus den Originalfotos Januar bis April 2026.
// Ein Slash bleibt Abwesenheit; leere/unklare Felder werden mit ? zur Prüfung markiert.
const transcribed = {
 '2026-01': [
  ['/', 'SD','SD','SD','SD','SD','/','/','SD'],
  ['MH','MH','MH','MH','MH','MH','MH','MH','MH'],
  ['PS','/','PS','PS','PS','PS','PS','PS','PS'],
  ['VT','VT','VT','VT','VT','VT','VT','VT','/'],
  ['STS','STS','STS','STS','STS','STS','STS','STS','STS'],
  ['YC','YC','/','YC','/','YC','YC','/','YC'],
  ['KW','KW','KW','KW','KW','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB'],
  ['NB','NB','NB','/','NB','NB','NB','NB','NB'],
  ['KP','KP','KP','KP','KP','KP','KP','KP','KP']
 ],
 '2026-02': [
  ['SD','/','SD','SD','SD','SD','/','SD','SD','/','SD'],
  ['MH','/','MH','MH','/','MH','MH','MH','/','MH','MH'],
  ['PS','/','PS','PS','PS','PS','PS','PS','PS','PS','PS'],
  ['VT','VT','VT','VT','/','VT','VT','VT','VT','/','VT'],
  ['STS','STS','STS','STS','STS','STS','STS','STS','STS','STS','STS'],
  ['YC','YC','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
  ['KW','KW','KW','KW','KW','KW','/','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB','EB','?'],
  ['NB','/','NB','NB','NB','NB','NB','NB','NB','NB','?'],
  ['KP','KP','KP','/','KP','KP','KP','/','KP','KP','KP']
 ],
 '2026-03': [
  ['SD','SD','/','SD','SD','SD','SD','SD','SD','SD'],
  ['MH','MH','MH','MH','MH','MH','/','MH','MH','MH'],
  ['PS','PS','PS','/','PS','PS','/','PS','PS','PS'],
  ['VT','VT','VT','VT','VT','VT','VT','VT','VT','VT'],
  ['STS','STS','STS','STS','/','STS','STS','STS','STS','STS'],
  ['YC','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
  ['KW','KW','KW','KW','KW','KW','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB','EB'],
  ['NB','NB','NB','NB','NB','NB','NB','NB','NB','NB'],
  ['KP','KP','KP','KP','KP','/','KP','KP','KP','KP']
 ],
 '2026-04': [['SD'],['MH'],['PS'],['VT'],['STS'],['YC'],['KW'],['EB'],['NB'],['KP']]
};
function installHistoricalSeed(){
  // Neue historische Monate separat ergänzen, ohne bereits gespeicherte Monate/Änderungen zu überschreiben.
  if(!localStorage.getItem('attendance:2026-09')) {
    const month='2026-09';
    const dayNums=historicalSeed[month];
    const dates=dayNums.map(d=>`${month}-${String(d).padStart(2,'0')}`);
    const rows=[
      ['/','SD','SD','SD','/','SD','SD','SD','SD','/','/','?'],
      ['MH','MH','/','MH','MH','MH','MH','MH','MH','MH','/','?'],
      ['PS','PS','PS','PS','PS','PS','?','PS','/','PS','?','?'],
      ['VT','VT','/','/','VT','VT','VT','VT','VT','VT','VT','?'],
      ['STS','/','STS','STS','STS','/','STS','STS','STS','STS','STS','STS'],
      ['YC','YC','/','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
      ['KW','KW','KW','KW','KW','KW','KW','KW','KW','KW','KW','KW'],
      ['EB','EB','/','/','/','EB','EB','EB','EB','EB','EB','EB'],
      ['NB','/','/','/','NB','NB','NB','NB','/','NB','/','NB'],
      ['/','/','/','/','KP','KP','KP','KP','KP','KP','KP','/']
    ];
    const attendance={}; dates.forEach((d,j)=>{attendance[d]={}; rows.forEach((r,i)=>attendance[d][i]=r[j]||'?');});
    localStorage.setItem('attendance:'+month,JSON.stringify({dates,attendance,source:'September 2026 vom Foto übertragen; ? = prüfen, bitte Handschrift kontrollieren'}));
  }
  if(localStorage.getItem('attendance-historical-seed-v1')) return;
  Object.entries(historicalSeed).forEach(([month,dayNums])=>{
    const dates=dayNums.map(d=>`${month}-${String(d).padStart(2,'0')}`);
    const attendance={};
    dates.forEach(d=>{attendance[d]={}; for(let i=0;i<defaultParticipants.length;i++) attendance[d][i]='?';});
    const rows=transcribed[month];
    if(rows) rows.forEach((vals,i)=>vals.forEach((v,j)=>{if(dates[j]) attendance[dates[j]][i]=v;}));
    localStorage.setItem('attendance:'+month,JSON.stringify({dates,attendance,source:'historische Liste; ? = prüfen'}));
  });
  localStorage.setItem('attendance-historical-seed-v1','done');
}

const $ = id => document.getElementById(id);
function saveParticipants(){ localStorage.setItem("attendance-participants", JSON.stringify(participants)); }
const now = new Date();
const monthInput = $("month");
monthInput.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
let dates = [];
let attendance = {};
let hourSettings = {totalHours:1000, requiredPercent:70, weekdayHours:4, saturdayHours:6};


function monthKey(){return monthInput.value || `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;}
function loadMonth(){
  const saved = JSON.parse(localStorage.getItem("attendance:"+monthKey()) || "{}");
  dates = saved.dates || [];
  attendance = saved.attendance || {};
  render();
  renderOverview();
  renderArchiveList();
}
function saveMonth(){localStorage.setItem("attendance:"+monthKey(),JSON.stringify({dates,attendance}));}
function showStatus(message,error=false,ok=false){const el=$("status");el.textContent=message;el.className="status"+(error?" error":ok?" ok":"");}
function saveHourSettings(){
  hourSettings = {
    totalHours: Math.max(1, Number($("totalHours").value)||1000),
    requiredPercent: Math.min(100,Math.max(0,Number($("requiredPercent").value)||0)),
    weekdayHours: Math.max(0,Number($("weekdayHours").value)||0),
    saturdayHours: Math.max(0,Number($("saturdayHours").value)||0)
  };
  localStorage.setItem("attendance-hour-settings", JSON.stringify(hourSettings));
  renderOverview();
}
function dayHours(date){
  const day = new Date(date+"T12:00:00").getDay(); // 0=Sun, 6=Sat
  if(day===0) return 0;
  return day===6 ? hourSettings.saturdayHours : hourSettings.weekdayHours;
}
function isPresent(value){
  const v=(value||"").trim();
  return v!=="" && v!=="?" && v!=="/" && v!=="—" && v!=="-" && !["E","K","U"].includes(v.toUpperCase());
}
function ensureReviewOptions(){
  const select=$("reviewParticipant");
  if(!select) return;
  const current=select.value;
  select.innerHTML="";
  participants.forEach((p,i)=>{
    const option=document.createElement("option");
    option.value=String(i);
    option.textContent=`${i+1}. ${p.first} ${p.last}`;
    select.appendChild(option);
  });
  if(current && Number(current)<participants.length) select.value=current;
}
function renderDayReview(){
  const select=$("reviewParticipant");
  const body=$("dayReviewBody");
  if(!select || !body) return;
  const index=Number(select.value||0);
  const p=participants[index];
  body.innerHTML="";
  dates.forEach(date=>{
    const tr=document.createElement("tr");
    const d=new Date(date+"T12:00:00");
    const weekday=d.toLocaleDateString("de-DE",{weekday:"long"});
    const hours=dayHours(date);
    const tdDate=document.createElement("td");tdDate.textContent=d.toLocaleDateString("de-DE");tr.appendChild(tdDate);
    const tdDay=document.createElement("td");tdDay.textContent=weekday;tr.appendChild(tdDay);
    const tdHours=document.createElement("td");tdHours.textContent=`${hours} Std.`;tr.appendChild(tdHours);
    const tdStatus=document.createElement("td");
    const status=document.createElement("select");
    status.className="attendance-status";
    [["","Nicht eingetragen / abwesend"],["X","Anwesend"],["/","Abwesend"],["E","Entschuldigt"],["K","Krank"],["U","Unentschuldigt"]].forEach(([value,label])=>{
      const option=document.createElement("option");option.value=value;option.textContent=label;status.appendChild(option);
    });
    const current=(attendance[date]||{})[index]||"";
    status.value=isPresent(current)?"X":current==="/"?"/":["E","K","U"].includes(current)?current:"";
    status.addEventListener("change",()=>{
      attendance[date]=attendance[date]||{};
      attendance[date][index]=status.value;
      saveMonth();
      renderOverview();
      renderDayReview();
      showStatus("Anwesenheit geändert und gespeichert.",false,true);
    });
    tdStatus.appendChild(status);tr.appendChild(tdStatus);
    body.appendChild(tr);
  });
}
function getSavedMonths(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key && key.startsWith("attendance:") && /^attendance:\d{4}-\d{2}$/.test(key)) keys.push(key);
  }
  return keys.sort().map(key=>{
    try { return {month:key.slice("attendance:".length), data:JSON.parse(localStorage.getItem(key)||"{}")}; }
    catch { return {month:key.slice("attendance:".length),data:{dates:[],attendance:{}}}; }
  });
}
function monthLabelForKey(key){const [y,m]=key.split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString("de-DE",{month:"long",year:"numeric"});}
function renderPersonTabs(){
  const box=$("personTabs"); if(!box) return;
  const current=Number($("reviewParticipant")?.value||0);
  box.innerHTML="";
  participants.forEach((p,i)=>{
    const b=document.createElement("button"); b.type="button"; b.className="person-tab"+(i===current?" active":"");
    b.setAttribute("role","tab"); b.setAttribute("aria-selected",String(i===current));
    b.textContent=`${p.first} ${p.last}`;
    b.addEventListener("click",()=>{$("reviewParticipant").value=String(i);renderOverview();});
    box.appendChild(b);
  });
}
function renderPersonMonthTable(index){
  const body=$("personMonthBody"); if(!body) return;
  body.innerHTML="";
  const months=getSavedMonths();
  let allPresentDays=0,allDays=0,allPresentHours=0,allScheduledHours=0;
  months.forEach(({month,data})=>{
    const monthDates=(data.dates||[]).slice().sort();
    let presentDays=0,scheduledHours=0,presentHours=0;
    monthDates.forEach(d=>{
      const h=dayHours(d); scheduledHours+=h;
      if(isPresent(((data.attendance||{})[d]||{})[index])) { presentDays++; presentHours+=h; }
    });
    allPresentDays+=presentDays; allDays+=monthDates.length; allPresentHours+=presentHours; allScheduledHours+=scheduledHours;
    const tr=document.createElement("tr");
    const vals=[monthLabelForKey(month),`${presentDays}`,`${monthDates.length}`,`${monthDates.length?(presentDays/monthDates.length*100).toLocaleString("de-DE",{maximumFractionDigits:1}):"0,0"} %`,`${presentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`];
    vals.forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);}); body.appendChild(tr);
  });
  const tr=document.createElement("tr");tr.className="total-row";
  const pct=allDays?allPresentDays/allDays*100:0;
  const vals=["GESAMT",`${allPresentDays}`,`${allDays}`,`${pct.toLocaleString("de-DE",{maximumFractionDigits:1})} %`,`${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`];
  vals.forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);});body.appendChild(tr);
}
function renderOverview(){
  const body=$("overviewBody");
  if(!body) return;
  ensureReviewOptions();
  renderPersonTabs();
  body.innerHTML="";
  const total=hourSettings.totalHours;
  const useCourseTotal=$("useCourseTotal")?.checked || false;
  const goal=total*hourSettings.requiredPercent/100;
  participants.forEach((p,i)=>{
    let present=0, scheduled=0;
    dates.forEach(date=>{
      const h=dayHours(date);
      scheduled+=h;
      if(isPresent((attendance[date]||{})[i])) present+=h;
    });
    const percent=scheduled>0 ? present/scheduled*100 : 0;
    const coursePercent=useCourseTotal ? present/total*100 : percent;
    const remaining=Math.max(0,goal-present);
    const tr=document.createElement("tr");
    const values=[
      `${p.last}, ${p.first}`,
      `${present.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`,
      `${scheduled.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`,
      `${percent.toLocaleString("de-DE",{maximumFractionDigits:1})} %`,
      `${coursePercent.toLocaleString("de-DE",{maximumFractionDigits:1})} %`,
      remaining===0 ? "Ziel erreicht" : `${remaining.toLocaleString("de-DE",{maximumFractionDigits:1})} Std. fehlen`
    ];
    values.forEach((value,j)=>{const td=document.createElement("td");td.textContent=value;if(j===4){td.className=coursePercent>=hourSettings.requiredPercent?"good":"needs-work";}if(j===5){td.className=remaining===0?"good":"needs-work";}tr.appendChild(td);});
    body.appendChild(tr);
  });
  const selected=Number($("reviewParticipant")?.value||0);
  let selectedPresent=0, selectedScheduled=0;
  dates.forEach(date=>{const h=dayHours(date);selectedScheduled+=h;if(isPresent((attendance[date]||{})[selected]))selectedPresent+=h;});
  const selectedPct=total>0?selectedPresent/total*100:0;
  const target=total*hourSettings.requiredPercent/100;
  const remaining=Math.max(0,target-selectedPresent);
  const months=getSavedMonths();
  let allPresentDays=0,allDays=0,allPresentHours=0,allScheduledHours=0;
  months.forEach(({data})=>{
    (data.dates||[]).forEach(d=>{allDays++;const h=dayHours(d);allScheduledHours+=h;if(isPresent(((data.attendance||{})[d]||{})[selected])){allPresentDays++;allPresentHours+=h;}});
  });
  const allPct=useCourseTotal ? (total>0?allPresentHours/total*100:0) : (allScheduledHours>0?allPresentHours/allScheduledHours*100:0);
  $("reviewSummary").innerHTML=`<strong>${participants[selected].first} ${participants[selected].last}</strong><span>Aktueller Monat: ${selectedPresent.toLocaleString("de-DE")} Std. anwesend</span><span class="review-percent">Gesamtquote: ${allPct.toLocaleString("de-DE",{maximumFractionDigits:1})}% (${useCourseTotal ? `${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} von ${total} Std.` : `${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} von ${allScheduledHours.toLocaleString("de-DE",{maximumFractionDigits:1})} bisher erfassten Soll-Std.`})</span><span>Gesamtstunden anwesend: ${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.</span><span>Erfasste Sollstunden: ${allScheduledHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.</span><span>${useCourseTotal ? `${remaining.toLocaleString("de-DE",{maximumFractionDigits:1})} Std. bis zur Kurszielmarke (bezogen auf ${total} Kursstunden)` : "Prozentwert bezieht sich nur auf bisher erfasste Unterrichtsstunden."}</span>`;
  renderPersonMonthTable(selected);
  renderDayReview();
}
function render(){
  const head=$("tableHead");
  head.innerHTML='<th>Nr.</th><th>Nachname</th><th>Vorname</th><th>KST.</th>';
  dates.forEach((date,index)=>{
    const th=document.createElement("th");th.className="date-head";
    const label=document.createElement("span");label.textContent=new Date(date+"T12:00:00").getDate()+".";
    const del=document.createElement("button");del.className="remove-date";del.textContent="entfernen";del.title="Unterrichtstag entfernen";
    del.addEventListener("click",()=>{dates.splice(index,1);saveMonth();render();});
    th.append(label,del);head.appendChild(th);
  });
  const body=$("tableBody");body.innerHTML="";
  participants.forEach((person,i)=>{
    const tr=document.createElement("tr");
    const num=document.createElement("td");num.textContent=String(i+1);tr.appendChild(num);
    [["last","name"],["first","name"],["kst","kst"]].forEach(([field,cls])=>{
      const td=document.createElement("td");td.className=cls;
      const input=document.createElement("input");input.value=person[field];input.setAttribute("aria-label",`${field} Teilnehmer ${i+1}`);
      input.addEventListener("change",()=>{person[field]=input.value.trim();saveParticipants();renderOverview();showStatus("Teilnehmerdaten gespeichert.",false,true);});
      td.appendChild(input);tr.appendChild(td);
    });
    dates.forEach(date=>{
      const td=document.createElement("td");
      const input=document.createElement("input");input.maxLength=12;input.placeholder="—";
      input.value=(attendance[date]||{})[i]||"";
      input.setAttribute("aria-label",`${person.first} ${person.last}, ${date}`);
      input.title="Feld anklicken, um das Kürzel automatisch einzutragen; danach bei Bedarf bearbeiten";
      input.addEventListener("click",()=>{
        if(!input.value.trim()){
          const initials=["SD","MH","PS","VT","STS","YC","KW","EB","NB","KP"][i] || (person.first[0]+person.last[0]).toUpperCase();
          input.value=initials;
          attendance[date]=attendance[date]||{};attendance[date][i]=initials;
          saveMonth();renderOverview();
        }
      });
      input.addEventListener("change",()=>{attendance[date]=attendance[date]||{};attendance[date][i]=input.value.trim();saveMonth();renderOverview();});
      td.appendChild(input);tr.appendChild(td);
    });
    body.appendChild(tr);
  });
  saveMonth();
  renderOverview();
}
function addDate(value){
  const date=value || $("newDate").value;
  if(!date){showStatus("Bitte zuerst ein Datum auswählen.",true);return;}
  if(date.slice(0,7)!==monthKey()){showStatus("Das Datum liegt nicht im ausgewählten Monat.",true);return;}
  if(dates.includes(date)){showStatus("Dieser Unterrichtstag ist bereits eingetragen.",true);return;}
  dates.push(date);dates.sort();$("newDate").value="";saveMonth();render();showStatus("Unterrichtstag hinzugefügt.",false,true);
}
function monthLabel(){const [y,m]=monthKey().split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString("de-DE",{month:"long",year:"numeric"});}
function createPdf(){
  if(!window.jspdf || !window.jspdf.jsPDF) throw new Error("PDF-Bibliothek konnte nicht geladen werden. Bitte Internetverbindung prüfen.");
  [...$("tableBody").rows].forEach((row,i)=>{participants[i].last=row.cells[1].querySelector("input").value;participants[i].first=row.cells[2].querySelector("input").value;participants[i].kst=row.cells[3].querySelector("input").value;});
  saveParticipants();
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
  // Originalähnliche Vorlage: Monat/Jahr oben, Teilnehmer links, Datumsfelder rechts.
  doc.setFont("helvetica","bold");doc.setFontSize(13);
  doc.text("Anwesenheitsliste",doc.internal.pageSize.getWidth()-14,12,{align:"right"});
  doc.setFontSize(11);
  doc.text("Meisterkurs Kunststoff/Kautschuk",doc.internal.pageSize.getWidth()-14,18,{align:"right"});
  doc.setFont("helvetica","normal");doc.setFontSize(9);
  doc.text(`Monat/Jahr: ${monthLabel()}`,10,17);
  doc.text("Teilnehmer Continental Korbach",10,22);
  const maxDateCols=18;
  const visibleDates=dates.slice(0,maxDateCols);
  const emptyCols=Math.max(0,Math.min(6,maxDateCols-visibleDates.length));
  const dateHeaders=[...visibleDates.map(d=>String(new Date(d+"T12:00:00").getDate())),...Array(emptyCols).fill("")];
  const head=[["Lfd. Nr.","Name","Vorname","KST.",...dateHeaders]];
  const body=participants.map((p,i)=>[String(i+1),p.last,p.first,p.kst,...visibleDates.map(d=>(attendance[d]||{})[i]||""),...Array(emptyCols).fill("")]);
  const pageW=doc.internal.pageSize.getWidth();
  const dateCount=dateHeaders.length;
  const fixedWidths={0:11,1:39,2:39,3:22};
  const fixedTotal=Object.values(fixedWidths).reduce((a,b)=>a+b,0);
  const dateWidth=(pageW-20-fixedTotal)/Math.max(1,dateCount);
  const columnStyles={0:{cellWidth:fixedWidths[0]},1:{cellWidth:fixedWidths[1],halign:"left"},2:{cellWidth:fixedWidths[2],halign:"left"},3:{cellWidth:fixedWidths[3]}};
  for(let c=4;c<4+dateCount;c++) columnStyles[c]={cellWidth:dateWidth};
  doc.autoTable({head,body,startY:27,theme:"grid",styles:{font:"helvetica",fontSize:8,cellPadding:2.2,minCellHeight:8,halign:"center",valign:"middle",lineColor:[75,85,95],lineWidth:.22,textColor:[25,25,25]},headStyles:{fillColor:[255,255,255],textColor:[25,25,25],fontStyle:"bold",lineColor:[75,85,95]},columnStyles,margin:{left:10,right:10},tableWidth:pageW-20});
  const y=doc.lastAutoTable.finalY+8;
  doc.setFontSize(8);doc.text("Der Teilnehmer bestätigt seine Anwesenheit mit seinem Namenskürzel.",10,Math.min(y,195));
  return doc;
}
function renderArchiveList(){
  const el=$("archiveList"); if(!el) return;
  const months=getSavedMonths();
  el.innerHTML="<strong>Abgelegte Monatslisten</strong>";
  if(!months.length){el.innerHTML+="<p class=\"muted small\">Noch keine Monate gespeichert.</p>";return;}
  const list=document.createElement("div");list.className="archive-items";
  months.forEach(({month,data})=>{
    const row=document.createElement("div");row.className="archive-item";
    const label=document.createElement("span");label.textContent=monthLabelForKey(month)+` · ${(data.dates||[]).length} Unterrichtstage`;
    const btn=document.createElement("button");btn.type="button";btn.className="button secondary";btn.textContent="Öffnen";
    btn.addEventListener("click",()=>{$("month").value=month;loadMonth();showMainView(false);window.scrollTo({top:0,behavior:"smooth"});});
    row.append(label,btn);list.appendChild(row);
  });
  el.appendChild(list);
}
$("archiveMonth")?.addEventListener("click",()=>{
  saveMonth();
  const archived=JSON.parse(localStorage.getItem("attendance-archived-months")||"[]");
  const key=monthKey();
  if(!archived.includes(key)) archived.push(key);
  localStorage.setItem("attendance-archived-months",JSON.stringify(archived));
  renderArchiveList();
  showStatus(`${monthLabel()} wurde gespeichert und in der Monatsablage abgelegt.`,false,true);
});

function pdfFileName(){return "Anwesenheit_"+monthKey()+".pdf";}
function pdfBase64(doc){return doc.output("datauristring").split(",")[1];}
$("addDate").addEventListener("click",()=>{$("newDate").focus();});
$("addDateValue").addEventListener("click",()=>addDate());
$("month").addEventListener("change",loadMonth);
$("makePdf").addEventListener("click",()=>{
  try{
    saveMonth();
    const doc=createPdf();
    const blob=doc.output("blob");
    const url=URL.createObjectURL(blob);
    const preview=window.open(url,"_blank");
    if(!preview){
      const link=document.createElement("a");link.href=url;link.download=pdfFileName();link.click();
      showStatus("Druckvorschau wurde blockiert; die PDF wurde stattdessen heruntergeladen.",false,true);
    } else {
      showStatus("Druckvorschau geöffnet. Dort kannst du drucken, speichern oder teilen.",false,true);
    }
  }catch(e){showStatus(e.message||"PDF konnte nicht erstellt werden.",true);}
});
async function makeAndShare(){
  try {
    saveMonth();
    const doc = createPdf();
    const blob = doc.output("blob");
    const file = new File([blob], pdfFileName(), {type:"application/pdf"});
    if (navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
      await navigator.share({files:[file], title:`Anwesenheit ${monthLabel()}`, text:`Anwesenheitsliste ${monthLabel()}`});
      showStatus("Teilen-Menü geöffnet.",false,true);
    } else {
      doc.save(pdfFileName());
      showStatus("PDF heruntergeladen. Öffne die Datei und nutze anschließend „Teilen“ auf deinem Gerät.",false,true);
    }
  } catch(e) {
    if (e && e.name === "AbortError") {
      showStatus("Teilen abgebrochen. Die PDF wurde nicht versendet.",false,false);
    } else {
      showStatus(e.message || "PDF konnte nicht geteilt werden.",true);
    }
  }
}
$("sharePdf").addEventListener("click",makeAndShare);
$("newClass").addEventListener("click",()=>{
  const confirmed=window.confirm("Neue Klasse vorbereiten? Dabei werden alle gespeicherten Anwesenheitsmonate in diesem Browser gelöscht. Die Teilnehmernamen bleiben erhalten und können danach geändert werden. Diese Aktion kann nicht rückgängig gemacht werden.");
  if(!confirmed) return;
  Object.keys(localStorage).filter(key=>key.startsWith("attendance:")).forEach(key=>localStorage.removeItem(key));
  dates=[]; attendance={}; saveMonth(); render(); renderOverview();
  showStatus("Alte Anwesenheitsdaten gelöscht. Du kannst jetzt die Teilnehmernamen für die neue Klasse ändern.",false,true);
});

["totalHours","requiredPercent","weekdayHours","saturdayHours"].forEach(id=>{
  $(id).addEventListener("change",()=>{
    saveHourSettings();
    showStatus("Anwesenheitsberechnung aktualisiert.",false,true);
  });
});
hourSettings=JSON.parse(localStorage.getItem("attendance-hour-settings")||'{"totalHours":1000,"requiredPercent":70,"weekdayHours":4,"saturdayHours":6}');
$("totalHours").value=hourSettings.totalHours;
$("requiredPercent").value=hourSettings.requiredPercent;
$("weekdayHours").value=hourSettings.weekdayHours;
$("saturdayHours").value=hourSettings.saturdayHours;

function showMainView(showOverview){
  document.body.classList.toggle("show-overview",showOverview);
  const btn=$("openOverview");
  if(btn) btn.textContent=showOverview ? "Zurück zur Monatsliste" : "Anwesenheitsübersicht";
  if(showOverview) renderOverview();
}
$("openOverview")?.addEventListener("click",()=>{
  showMainView(!document.body.classList.contains("show-overview"));
});
const backButton=document.createElement("button");
backButton.type="button"; backButton.className="button secondary overview-back";
backButton.textContent="← Zurück zur Monatsliste";
backButton.addEventListener("click",()=>showMainView(false));
const overviewPanel=$("overviewPanel");
if(overviewPanel) overviewPanel.insertBefore(backButton,overviewPanel.firstChild);

$("reviewParticipant")?.addEventListener("change",renderOverview);
$("useCourseTotal")?.addEventListener("change",()=>{
  const help=$("quoteModeHelp");
  if(help) help.textContent=$("useCourseTotal").checked
    ? "Aktiv: Quote wird auf die eingestellten gesamten Kursstunden bezogen."
    : "Standard: Quote nur bezogen auf die bisher erfassten Unterrichtsstunden.";
  renderOverview();
});

installHistoricalSeed();
loadMonth();
renderArchiveList();
