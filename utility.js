function getAppPath(){
    // Return the current direcotry path
    // adjusting it for Linux or Windows
    const fs = require("fs");

    let path = __dirname;
    
    if(path.includes("home/")){
        // We are on Linux
        path = "file://" + path + "/index.html";
    } else {
        // We are on Window
        path = path + "\\index.html"
    }

    console.log(" ---- Current path: " + path)

    if (fs.existsSync(path)) {
      // path exists
      console.log("Exists:", path);
    } else {
      console.log("DOES NOT exist:", path);
    }
    return path
}

module.exports = getAppPath;