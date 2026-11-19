const inquiryForm=document.querySelector('#inquiry-form');
const inquiryStatus=document.querySelector('#inquiry-status');
const dateInput=document.querySelector('#request-date');
const today=new Date();const todayValue=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');dateInput.min=todayValue;
let lastStatus='';
const inquiryMessages={opened:{en:'Your email app was requested to open. Review and send the message there. Nothing has been sent by this website. If no app opened, use Copy request and email it to ahmed.fathi.aziz@gmail.com.',ar:'تم طلب فتح تطبيق البريد. راجع الرسالة وأرسلها من هناك؛ لم يرسل الموقع أي رسالة. إذا لم يفتح التطبيق، انسخ الطلب وأرسله إلى ahmed.fathi.aziz@gmail.com.'},copied:{en:'Request copied. Paste it into an email to ahmed.fathi.aziz@gmail.com and send it.',ar:'تم نسخ الطلب. الصقه في رسالة إلى ahmed.fathi.aziz@gmail.com ثم أرسلها.'},manual:{en:'Automatic copying is unavailable. Select and copy the prepared text below, then email it to ahmed.fathi.aziz@gmail.com.',ar:'النسخ التلقائي غير متاح. حدد النص المجهّز أدناه وانسخه ثم أرسله إلى ahmed.fathi.aziz@gmail.com.'}};
function showInquiryStatus(key){lastStatus=key;inquiryStatus.textContent=inquiryMessages[key][document.documentElement.lang==='ar'?'ar':'en'];}
function composeInquiry(){
 const ar=document.documentElement.lang==='ar';const values=Object.fromEntries(new FormData(inquiryForm));
 const labels=ar?['نوع الطلب','الموضوع','الموعد المفضل','الاسم','البريد الإلكتروني','الهاتف','الجهة','طريقة التنفيذ','تفاصيل إضافية']:['Request type','Topic','Preferred date','Name','Email','Phone','Organization','Delivery format','Additional details'];
 const kind=values.type==='training'?(ar?'تدريب':'Training'):(ar?'تعاون':'Collaboration');
 const formats={discuss:ar?'يُحدد لاحقًا':'To be discussed',online:ar?'عن بُعد':'Online',onsite:ar?'حضوري':'On-site'};
 const entries=[kind,values.topic.trim(),values.date,values.name.trim(),values.email.trim(),values.phone.trim()||'-',values.organization.trim()||'-',formats[values.format],values.message.trim()||'-'];
 const body=labels.map((label,i)=>label+': '+entries[i]).join('\n');
 return {subject:kind+' - '+values.topic.trim(),body};
}
function validateInquiry(){for(const id of ['request-topic','request-name']){const input=document.getElementById(id);input.setCustomValidity(input.value.trim()?'':(document.documentElement.lang==='ar'?'يرجى ملء هذا الحقل.':'Please fill out this field.'));}return inquiryForm.reportValidity();}
for(const id of ['request-topic','request-name'])document.getElementById(id).addEventListener('input',event=>event.target.setCustomValidity(''));
inquiryForm.addEventListener('submit',event=>{event.preventDefault();if(!validateInquiry())return;const message=composeInquiry();const link='mailto:ahmed.fathi.aziz@gmail.com?subject='+encodeURIComponent(message.subject)+'&body='+encodeURIComponent(message.body);showInquiryStatus('opened');window.location.href=link;});
document.getElementById('copy-inquiry').addEventListener('click',async()=>{if(!validateInquiry())return;const message=composeInquiry();const text=message.subject+'\n\n'+message.body;const fallback=document.getElementById('request-copy-fallback');try{await navigator.clipboard.writeText(text);fallback.hidden=true;showInquiryStatus('copied');}catch{fallback.value=text;fallback.hidden=false;fallback.focus();fallback.select();showInquiryStatus('manual');}});
document.addEventListener('portfolio-language',()=>{if(lastStatus)showInquiryStatus(lastStatus);for(const id of ['request-topic','request-name'])document.getElementById(id).setCustomValidity('');document.getElementById('request-copy-fallback').hidden=true;});
