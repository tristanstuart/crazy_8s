document.getElementById("pass2").onblur=function(){
    var pass1 = document.getElementById("pass1").value;
    var pass2 = document.getElementById("pass2").value;
    if (pass1 != pass2) {
        alert("Passwords must match!");
        return false;
    }
    return true;    
};