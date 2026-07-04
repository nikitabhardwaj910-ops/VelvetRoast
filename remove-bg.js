const Jimp = require("jimp");

async function removeBlackBackground() {
  try {
    const image = await Jimp.read("public/images/luxebrew-cup.png");
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      const maxVal = Math.max(red, green, blue);
      if (maxVal < 18) {
        this.bitmap.data[idx + 3] = 0; // 100% transparent
      } else if (maxVal < 45) {
        // Smooth feathered alpha edge
        const alpha = Math.floor(((maxVal - 18) / (45 - 18)) * 255);
        this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx + 3], alpha);
      }
    });

    await image.writeAsync("public/images/luxebrew-cup-transparent.png");
    console.log("Successfully generated public/images/luxebrew-cup-transparent.png");
  } catch (err) {
    console.error(err);
  }
}

removeBlackBackground();
