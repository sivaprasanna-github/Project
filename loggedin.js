import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore,doc,getDoc,updateDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyDk-jY4LDcRw4or4A42BmH0_kbyOqQ3-Cc",
  authDomain: "authentication-app-6cf14.firebaseapp.com",
  databaseURL: "https://authentication-app-6cf14-default-rtdb.firebaseio.com",
  projectId: "authentication-app-6cf14",
  storageBucket: "authentication-app-6cf14.appspot.com",
  messagingSenderId: "169600919766",
  appId: "1:169600919766:web:742372a38728c7a5c0c177"
}; 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
let username = document.getElementById("user")
let fullName =document.querySelector(".fullName")
let userName =document.querySelector(".userName")
let Gmail =document.querySelector(".gmail")
let Phone =document.querySelector(".phone")
let Gender =document.querySelector(".gender")
let DOB =document.querySelector(".dob")
let displayHistory =document.getElementById("addHistory")
//author state
const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
    if (user) {
        getDoc(doc(db,"users",user.uid)).then(docSnap => {
           if(docSnap.exists()){
                let userdata =docSnap.data()
               console.log(userdata)
                  username.innerText=`Welcome, ${userdata.fullName}`
                  fullName.innerHTML=`<b>FullName:</b> ${userdata.fullName}`
                  userName.innerHTML=`<b>UserName:</b> ${userdata.userName}`
                  Gmail.innerHTML=`<b>Gmail:</b> ${userdata.email}`
                  Phone.innerHTML=`<b>Contact:</b> ${userdata.phone}`
                  Gender.innerHTML=`<b>Gender:</b> ${userdata.gender}`
                  DOB.innerHTML=`<b>Date-of-Birth:</b> ${userdata.dob}`
                let History = userdata.history
                console.log(History)
                displayHistory.innerHTML=""
                let count = 1
                History.forEach(element => {
                  let ele = document.createElement("h3")
                  ele.innerText=`${count}. ${element}`
                  count++
                  displayHistory.append(ele)
                });
           }else{
               console.log("no data")
           }
   })
    } else {
      // User is signed out
      window.open("index.html","_self");
    }
  });

let logout = document.getElementById("logout")
logout.addEventListener("click",(e)=>{
    signOut(auth).then(() => {
        window.open("index.html","_self");
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
      });
})
document.getElementById("history").addEventListener("click",()=>{
  document.getElementById('showHistory').style.display = 'block';
})
document.getElementsByClassName("fa-arrow-left")[0].addEventListener("click",()=>{
  document.getElementById('showHistory').style.display = 'none';
})
document.addEventListener('click', function(event) {
  const profileData = document.querySelector('.profile_data');
  const showHistory = document.querySelector('#showHistory');
  const profileButton = document.querySelector('#profile');

  if (!profileData.contains(event.target) && !showHistory.contains(event.target) && !profileButton.contains(event.target)) {
      profileData.style.display = 'none';
      showHistory.style.display = 'none';
  }
});
document.querySelector('#profile').addEventListener('click', function(event) {
  const profileData = document.querySelector('.profile_data');
  const showHistory = document.querySelector('#showHistory');
  profileData.style.display = profileData.style.display === 'flex' ? 'none' : 'flex';
  showHistory.style.display = 'none';
});

let search  = document.getElementById("search-btn")
search.addEventListener("click",()=>{
  addhistory();
})
let searchbar= document.getElementById("inp-word")
    searchbar.addEventListener("keypress",async (e)=>{
        if(e.key==="Enter"){
            addhistory();
        }
    })

async function addhistory() {
  let word = document.getElementById("inp-word").value;
  const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  if (!dictionaryResponse.ok) {
    console.error("Word not found in the dictionary API.");
    return;
  }
  const user = auth.currentUser;
  var localhistory = [];
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getDoc(doc(db, "users", user.uid)).then(docSnap => {
        if (docSnap.exists()) {
          let userdata = docSnap.data();
          localhistory = userdata.history || [];
          
          let searchdata = document.getElementById("inp-word").value;
          if(!localhistory.includes(searchdata)){
            
            localhistory.push(searchdata);
            
            updateDoc(doc(db, "users", user.uid), {
              history: localhistory
            });
            let History = userdata.history
                  console.log(History)
                  let count = 1
                  displayHistory.innerHTML=""
                  History.forEach(element => {
                    let ele = document.createElement("h3")
                    ele.innerText=`${count}. ${element}`
                    count++
                    displayHistory.append(ele)
                  });
          }
        }
      }).catch(error => {
        console.error("Error fetching document: ", error);
      });
    }
  });
}
