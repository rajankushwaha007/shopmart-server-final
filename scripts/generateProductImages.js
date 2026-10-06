const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const inputFolder = path.join(
    __dirname,
    "../public/uploads/products"
)

const outputFolder = path.join(
    __dirname,
    "../public/uploads/products/generated"
)

const TOTAL_IMAGES = 500


// Create output folder
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, {
        recursive: true
    })
}


// Get existing images
const sourceImages = fs
    .readdirSync(inputFolder)
    .filter(file =>
        /\.(jpg|jpeg|png|webp)$/i.test(file)
    )
    .filter(file => file !== "generated")


if (sourceImages.length === 0) {
    throw new Error(
        "No source images found in public/uploads/products"
    )
}


console.log(
    `Found ${sourceImages.length} source images`
)

console.log(
    `Generating ${TOTAL_IMAGES} product images...\n`
)


async function generateImages() {

    for (let i = 1; i <= TOTAL_IMAGES; i++) {

        const sourceFile =
            sourceImages[
                (i - 1) % sourceImages.length
            ]

        const sourcePath =
            path.join(
                inputFolder,
                sourceFile
            )


        const outputName =
            `product-${String(i).padStart(3, "0")}.jpg`


        const outputPath =
            path.join(
                outputFolder,
                outputName
            )


        const width = 800
        const height = 800


        const flip =
            i % 2 === 0


        const rotate =
            ((i % 7) - 3) * 0.5


        const brightness =
            0.92 + ((i % 9) * 0.02)


        let image =
            sharp(sourcePath)
                .resize(
                    width,
                    height,
                    {
                        fit: "cover",
                        position: "centre"
                    }
                )


        if (flip) {
            image = image.flop()
        }


        image = image
            .rotate(rotate)
            .modulate({
                brightness: brightness,
                saturation: 1 + ((i % 5) * 0.04)
            })
            .jpeg({
                quality: 90
            })


        await image.toFile(outputPath)


        if (i % 50 === 0) {
            console.log(
                `Generated ${i}/${TOTAL_IMAGES}`
            )
        }
    }


    console.log(
        "\n================================="
    )

    console.log(
        "500 PRODUCT IMAGES GENERATED"
    )

    console.log(
        "================================="
    )

    console.log(
        `Output folder: ${outputFolder}`
    )
}


generateImages()
    .catch(error => {

        console.error(
            "\nImage generation error:"
        )

        console.error(error)

        process.exit(1)
    })