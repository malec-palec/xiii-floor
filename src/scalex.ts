export class ScaleX {
  static scale2x(imageData: ImageData): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const dest = new ImageData(width * 2, height * 2);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const index = (j * width + i) * 4;
        const E = this.getPixel(imageData, i, j);

        let E0 = E,
          E1 = E,
          E2 = E,
          E3 = E;

        if (i > 0 && j > 0 && i < width - 1 && j < height - 1) {
          const B = this.getPixel(imageData, i, j - 1);
          const D = this.getPixel(imageData, i - 1, j);
          const F = this.getPixel(imageData, i + 1, j);
          const H = this.getPixel(imageData, i, j + 1);

          if (B !== H && D !== F) {
            E0 = D === B ? D : E;
            E1 = B === F ? F : E;
            E2 = D === H ? D : E;
            E3 = H === F ? F : E;
          }
        }

        this.setPixel(dest, i * 2, j * 2, E0);
        this.setPixel(dest, i * 2 + 1, j * 2, E1);
        this.setPixel(dest, i * 2, j * 2 + 1, E2);
        this.setPixel(dest, i * 2 + 1, j * 2 + 1, E3);
      }
    }
    return dest;
  }

  static scale3x(imageData: ImageData): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const dest = new ImageData(width * 3, height * 3);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const E = this.getPixel(imageData, i, j);

        let E0 = E,
          E1 = E,
          E2 = E,
          E3 = E,
          E4 = E,
          E5 = E,
          E6 = E,
          E7 = E,
          E8 = E;

        if (i > 0 && j > 0 && i < width - 1 && j < height - 1) {
          const A = this.getPixel(imageData, i - 1, j - 1);
          const B = this.getPixel(imageData, i, j - 1);
          const C = this.getPixel(imageData, i, j + 1);
          const D = this.getPixel(imageData, i - 1, j);
          const F = this.getPixel(imageData, i + 1, j);
          const G = this.getPixel(imageData, i - 1, j + 1);
          const H = this.getPixel(imageData, i, j + 1);
          const I = this.getPixel(imageData, i + 1, j + 1);

          if (B !== H && D !== F) {
            E0 = D === B ? D : E;
            E1 = (D === B && E !== C) || (B === F && E !== A) ? B : E;
            E2 = B === F ? F : E;
            E3 = (D === B && E !== G) || (D === H && E !== A) ? D : E;
            E4 = E;
            E5 = (B === F && E !== I) || (H === F && E !== C) ? F : E;
            E6 = D === H ? D : E;
            E7 = (D === H && E !== I) || (H === F && E !== G) ? H : E;
            E8 = H === F ? F : E;
          }
        }

        this.setPixel(dest, i * 3, j * 3, E0);
        this.setPixel(dest, i * 3 + 1, j * 3, E1);
        this.setPixel(dest, i * 3 + 2, j * 3, E2);

        this.setPixel(dest, i * 3, j * 3 + 1, E3);
        this.setPixel(dest, i * 3 + 1, j * 3 + 1, E4);
        this.setPixel(dest, i * 3 + 2, j * 3 + 1, E5);

        this.setPixel(dest, i * 3, j * 3 + 2, E6);
        this.setPixel(dest, i * 3 + 1, j * 3 + 2, E7);
        this.setPixel(dest, i * 3 + 2, j * 3 + 2, E8);
      }
    }
    return dest;
  }

  static getPixel(imageData: ImageData, x: number, y: number): number {
    const index = (y * imageData.width + x) * 4;
    return (
      (imageData.data[index + 0] << 16) |
      (imageData.data[index + 1] << 8) |
      imageData.data[index + 2] |
      (imageData.data[index + 3] << 24)
    );
  }

  static setPixel(imageData: ImageData, x: number, y: number, color: number): void {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index + 0] = (color >> 16) & 0xff; // Red
    imageData.data[index + 1] = (color >> 8) & 0xff; // Green
    imageData.data[index + 2] = color & 0xff; // Blue
    imageData.data[index + 3] = (color >> 24) & 0xff; // Alpha
  }
}
