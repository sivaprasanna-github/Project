import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore,setDoc,doc,updateDoc,getDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);

//sign up
let signup = document.getElementById("signup")
signup.addEventListener("click",(e)=>{
    let signup_FullName = document.getElementById("signup-FullName").value
    let signup_username = document.getElementById("signup-username").value
    let signup_email = document.getElementById("signup-email").value
    let signup_phone = document.getElementById("signup-phone").value
    let signup_password = document.getElementById("signup-password").value
    let signup_gender = document.getElementById("signup-gender").value
    let signup_dob = document.getElementById("signup-dob").value
    let realdate = currentTime()
    let history = [];
    createUserWithEmailAndPassword(auth, signup_email, signup_password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        setDoc(doc(db, "users",user.uid), {
            fullName : signup_FullName,
            userName : signup_username,
            email:signup_email,
            phone:signup_phone,
            gender:signup_gender,
            dob:signup_dob,
            accountCreation:realdate,
            lastLogin:realdate,
            history:history
            });
            showMessage("signup Successful")
            showForm("loginForm")
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showMessage(errorMessage)
    });
})

//login
let login = document.getElementById("login")
login.addEventListener('click',(e)=>{
    let login_email = document.getElementById("login-email").value
    let login_password = document.getElementById("login-password").value
    let realdate = currentTime()
    signInWithEmailAndPassword(auth, login_email, login_password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        updateTime(user)
        
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showMessage(errorMessage+" please Signup")

    });

})

//author state
/*const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        window.open("dictionary.html")
    }
    });*/
    // Function to handle Google Sign-in
    let gsign = document.getElementById("googlesignin")
    gsign.addEventListener("click",()=>{
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
                // Check if user exists in the Firestore database
                getDoc(doc(db, "users", user.uid))
                    .then(docSnap => {
                        if (docSnap.exists()) {
                            updateTime(user)
                        } else {
                            // If user does not exist, show the form
                            document.getElementById('userForm').style.display = 'block';
                            document.getElementById('loginForm').style.display = 'none';
                            document.getElementById('signupForm').style.display = 'none';
                             
                            document.getElementById('g-email').value = user.email;
                            document.getElementById('g-fullName').value=user.displayName;
                            document.getElementById('profileForm').addEventListener('submit', (e) => {
                                e.preventDefault();
                                const g_fullName = document.getElementById('g-fullName').value;
                                const g_email = document.getElementById('g-email').value;
                                const g_username = document.getElementById('g-username').value;
                                const g_phone = document.getElementById('g-phone').value;
                                const g_gender = document.getElementById('g-gender').value;
                                const g_dob = document.getElementById('g-dob').value;
                                let realdate = currentTime()
                                let history = [];
                                // Save the new user data to Firestore
                                setDoc(doc(db, "users", user.uid), {
                                    fullName :g_fullName,
                                    userName :g_username,
                                    email:g_email,
                                    phone:g_phone,
                                    gender:g_gender,
                                    dob:g_dob,
                                    accountCreation:realdate,
                                    lastLogin:realdate,
                                    history:history
                                }).then(() => {
                                    console.log('User profile saved');
                                    document.getElementById('userForm').style.display = 'none';
                                    window.open("dictionary.html","_self")
                                }).catch((error) => {
                                    console.error("Error saving user data:", error);
                                });
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Error retrieving user data:", error);
                    });
                })
                .catch((error) => {
                    console.error("Error during sign-in:", error);
                });
            })
            document.getElementById("resetPassword").addEventListener("click",()=>{
                var resetMail = document.getElementById("reset-email").value;
                sendPasswordResetEmail(auth, resetMail)
                .then(() => {
                    showMessage("Reset email Sent")
                    
                })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
            });
            
        })
        async function updateTime(user){
            let realdate = currentTime()
            await setDoc(doc(db, "users", user.uid), { lastLogin: realdate }, { merge: true });
            window.open("dictionary.html","_self")
            console.log(realdate)
            console.log("success")
        }         
        function userdata(){
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('userdetails').style.display="block";
        }
        function currentTime(){
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata' 
            };
            const istDateTime = new Date().toLocaleString('en-IN', options);
            console.log(istDateTime)
            return istDateTime;
        }
        function showMessage(msg) {
            document.getElementById('messageText').textContent = msg;
            document.getElementById('messageBox').style.display = 'block';
        }
        document.querySelector('.ok-button').addEventListener("click",()=>{
            document.getElementById('messageBox').style.display = 'none';
        })
        
        