function checkValidAge()
{
    console.log("checkValidAge - Start")
    var age = document.getElementById("form-age")

    if (age.value < 18){
        alert("You must be at least 18 for apply for this job!");
        age.value = ""
        document.getElementById("form-age").focus();
        
        return false;
    }
    console.log("checkValidAge - End")
}

function submitSubscription()
{
    console.log("submitSubscription - Start")
    try{
        var name    = document.getElementById("form-name").value
        var surname = document.getElementById("form-surname").value
        var email   = document.getElementById("form-email").value
        var age     = document.getElementById("form-age").value
        var sex     = document.querySelector('input[name="sex-form"]:checked').value
        
        var result = "Your name is " + name + " " + surname + ".\<br\>"
        result += "A " + sex + " of " + age + " years. \<br\>" 
        result += "The email that you insert is : '" + email + "'."

        document.getElementById("submit-feedback").innerHTML = result
    } 
    catch{
        console.log("Error during script")
        document.getElementById("submit-feedback").innerHTML = ""
    }
    console.log("submitSubscription - End")
}