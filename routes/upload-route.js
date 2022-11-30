const router = require("express").Router();
const path = require("path");
const { v4 } = require("uuid");

router.post("/uploadFile", (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).send({ success: false, file: { url: "No files were uploaded." } });

    let sampleFile = req.files.foo;
    let fileNames = sampleFile.name.split(".");
    let extention = fileNames[fileNames.length - 1];
    const fileName = v4() + "." + extention;
    const uploadPath = path.join(path.dirname(__dirname), "public", "uploads", fileName);
    const fileURL = `http://localhost/uploads/${fileName}`;

    sampleFile.mv(uploadPath, (err) => {
        // console.log(err);
        if (err) return res.status(500).send({ success: false, file: { url: "No URL." } });
        res.send({ success: true, file: { url: fileURL } });
    });
});
router.post("/fetchUrl", (req, res) => {
    if (!req.body.url) return res.status(400).send({ success: false, file: { url: "No URL." } });
    res.send({ success: true, file: { url: req.body.url } });
});

module.exports = router;