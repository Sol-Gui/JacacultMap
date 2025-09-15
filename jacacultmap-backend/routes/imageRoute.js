import express from "express";
const router = express.Router();

async function retrieveUserImageB64(req, res)  {
  res.send({
    image: "Test-image-Base64-String",
  })
}

router.post("/upload-photo", (req, res) => {
  res.json({ message: "Arquivo enviado com sucesso!" });
});

router.get("/get-image-b64", retrieveUserImageB64)

export default router;