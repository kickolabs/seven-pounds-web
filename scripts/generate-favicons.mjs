import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"
import pngToIco from "png-to-ico"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

const SOURCE = path.join(
  root,
  "assets",
  "logo-source.png"
)

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }

async function writePng(size, outputPath) {
  await sharp(SOURCE)
    .resize(size, size, {
      fit: "contain",
      background: WHITE,
    })
    .png()
    .toFile(outputPath)
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Source logo not found: ${SOURCE}`)
  }

  const appDir = path.join(root, "app")
  const publicDir = path.join(root, "public")

  const sizes = [
    { size: 16, paths: [path.join(publicDir, "favicon-16x16.png")] },
    { size: 32, paths: [path.join(appDir, "icon.png"), path.join(publicDir, "favicon.png"), path.join(publicDir, "favicon-32x32.png")] },
    { size: 48, paths: [path.join(publicDir, "favicon-48x48.png")] },
    { size: 180, paths: [path.join(appDir, "apple-icon.png"), path.join(publicDir, "apple-touch-icon.png")] },
    { size: 192, paths: [path.join(publicDir, "icon-192.png")] },
    { size: 512, paths: [path.join(publicDir, "icon-512.png")] },
  ]

  for (const { size, paths: outputs } of sizes) {
    const buffer = await sharp(SOURCE)
      .resize(size, size, { fit: "contain", background: WHITE })
      .png()
      .toBuffer()

    for (const output of outputs) {
      fs.mkdirSync(path.dirname(output), { recursive: true })
      fs.writeFileSync(output, buffer)
      console.log(`Wrote ${output}`)
    }
  }

  const png16 = await sharp(SOURCE)
    .resize(16, 16, { fit: "contain", background: WHITE })
    .png()
    .toBuffer()
  const png32 = await sharp(SOURCE)
    .resize(32, 32, { fit: "contain", background: WHITE })
    .png()
    .toBuffer()
  const png48 = await sharp(SOURCE)
    .resize(48, 48, { fit: "contain", background: WHITE })
    .png()
    .toBuffer()

  const icoBuffer = await pngToIco([png16, png32, png48])
  const icoPaths = [path.join(appDir, "favicon.ico"), path.join(publicDir, "favicon.ico")]
  for (const icoPath of icoPaths) {
    fs.writeFileSync(icoPath, icoBuffer)
    console.log(`Wrote ${icoPath}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
