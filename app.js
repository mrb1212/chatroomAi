const express = require("express");
const path = require("path");
const cors = require("cors")
const { execSync } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3010;

   app.use(express.json({limit: '50mb'}))
   app.use(express.urlencoded({limit:'50mb'}))
   app.use(cors())
   

// Serve static files from dist
app.use(express.static(path.join(__dirname, "dist")));

// Route all requests to index.html (SPA handling)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


app.post("/github-webhook", (req, res) => {
    
    try {

        const payload = JSON.parse(req?.body?.payload)
        

    if(!payload){
        console.log("no payload", req)
        return
    }
    
    const branch = payload?.ref?.split("/").pop(); // Get the branch name
    
    
    if (branch === "production") {
        console.log("Production branch updated. Deploying...");

        execSync("cd /www/wwwroot/chat.keytex.ir && git pull origin production && npm install && npm run build && node restart chat.keytex.ir", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).send("Deployment failed");
            }
            if (stderr) console.error(`stderr: ${stderr}`);
            console.log(`stdout: ${stdout}`);
            res.status(200).send("Deployment successful");
            return
        });
    } else {
        res.status(200).send("Not production branch, skipping deployment.");
        return
    }
    } catch (error) {
        console.log("error", error)
        res.status(500).send("Deployment failed");
        return
    }
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});