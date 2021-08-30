const playButton=document.getElementsByClassName("play")[0];
const lapButton=document.getElementsByClassName("lap")[0];
const resetButton=document.getElementsByClassName("reset")[0];
const clearButton=document.getElementsByClassName("lap-clear-button")[0];
const minute=document.getElementsByClassName("minute")[0];
const second=document.getElementsByClassName("sec")[0];
const centiSecond=document.getElementsByClassName("msec")[0];
const laps=document.getElementsByClassName("laps")[0];
const bg=document.getElementsByClassName("outer-circle")[0];

let isPlay = false;
let minCounter=0;
let min;
let secCounter=0;
let sec;
let centiCounter=0;
let centiSec;
let isReset=false;
let lapItem=0;

//隱藏按鈕
const toggleButton=()=>{
    lapButton.classList.remove("hidden")
    resetButton.classList.remove("hidden")
}
//開始按鈕 
const play=()=>{
    if(!isPlay && !isReset){
        playButton.innerHTML='暫停';
        bg.classList.add("animation-bg");//顏色變化
        //60秒加一分鐘
        min= setInterval(()=>{
            minute.innerText=`${++minCounter} :`;
            },60*1000);
        //1000毫秒加一秒
        sec= setInterval(()=>{
                //秒數=60 歸零
                if(secCounter===60){
                    secCounter=0;
                }
            second.innerText=`${++secCounter} : `;
            },1000);

        centiSec= setInterval(()=>{
            if(centiCounter===100){
                centiCounter=0;
            }
            centiSecond.innerText=`${++centiCounter}`;
            },10);
        isPlay=true;
        isReset=true;
        
    }else{
        playButton.innerHTML='開始';
        clearInterval(min);
        clearInterval(sec);
        clearInterval(centiSec);
        isPlay=false;
        isReset=false;
        secCounter='0'
        minCounter='0'
        centiCounter='0'
        
        
        bg.classList.remove("animation-bg");
    }
    toggleButton();
}



const reset=()=>{
    isReset=true;
    play();

    lapButton.classList.add("hidden");
    resetButton.classList.add("hidden");
    minute.innerHTML= '0 :';
    second.innerHTML= '0 :';
    centiSecond.innerHTML= '0';
    
}

const lap=()=>{
    const li=document.createElement("li");
    const number=document.createElement("span");
    const timeStamp=document.createElement("span");

    li.setAttribute("class","lap-item");
    number.setAttribute("class","number");
    timeStamp.setAttribute("class","time-stamp");
    number.innerHTML=`#${++lapItem}`;
    timeStamp.innerHTML=`${minCounter} : ${secCounter} : ${centiCounter}`;
    
    li.append(number,timeStamp);
    laps.append(li);

    clearButton.classList.remove("hidden");
}
const clearAll=()=>{
    laps.innerHTML='';
    laps.append(clearButton)
    clearButton.classList.add("hidden");
    lapItem=0;
}

playButton.addEventListener("click",play);
resetButton.addEventListener("click",reset);
lapButton.addEventListener("click",lap);
clearButton.addEventListener("click",clearAll);