




console.log("i am working");

const dropZone = document.querySelector(".dropzone");
const fileInput = document.querySelector("#fileinput");
const search = document.querySelector(".search");

const bgProgress = document.querySelector(".bg-progress");
const percentDiv= document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");

const fileURL = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const emailContainer = document.querySelector(".email-container");
const emailSend = document.querySelector("#email-send");
const emailForm = document.querySelector("#email-form");

const maxAllowedSize = 100*1024*1024;


const hostURL = "http//localhost:3000/";
const uploadURL = `${hostURL}api/files`;
const emailURL = `${hostURL}api/files/give`;

dropZone.addEventListener('dragover',(e)=>{
    e.preventDefault();
    console.log("i am working");
   if(!dropZone.classList.contains("dragged")){
       dropZone.classList.add("dragged");
   }
});

dropZone.addEventListener('dragleave',()=>{
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener('drop',(e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
  
   fileInput.files = files;
   uploadFile();
});

fileInput.addEventListener('change',()=>{
    uploadFile();
})

search.addEventListener('click',()=>{
    fileInput.click();
});

const uploadFile = ()=>{
   
if(fileInput.files.length >1){
    fileInput.value="";
    alert("only upload one file");
    return ;
}
const file = fileInput.files[0];
if(file.size>maxAllowedSize){
    fileInput.value="";
    alert("uploaded file size must not exceed 100MB");
    return;
}
progressBar.style.display = "bolck";
    
    const formData = new FormData();

    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>{
       if(xhr.readyState === XMLHttpRequest.DONE){
           
           onUploadSuccess(xhr.responseText);
       }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);
}

const updateProgress = (e)=>{
    const percent = Math.round((e.loaded/e.total)*100);
   // console.log(percent);
   bgProgress.style.width = `${percent}%`;
   percentDiv.innerText = percent;
   progressBar.style.transform = `scaleX(${percent/100})`;
}

const onUploadSuccess = (res)=>{
    const{ file:url} = res;
console.log(url);
fileInput.value="";
emailForm[2].removeAttribute("disabled");
progressContainer.style.display = "none";
sharingContainer.style.display = "block";
emailSend.addEventListener('click',()=>{
        emailContainer.style.display = "block";
})

fileURL.value = "A unique url will be same when connected to backend server";
}

emailForm.addEventListener('submit',(e)=>{
    e.preventDefault();
const url = fileURL.value;
    const formData = {
        uuid : url.split("/").splice(-1,1)[0],
        emailTo:emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value,
    };
emailForm[2].setAttribute("disabled","true");

    fetch(emailURL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    }).then((res) =>res.json())
        .then(({success})=>{
            if(success){
                sharingContainer.style.display = "none";

            }
        });
});

