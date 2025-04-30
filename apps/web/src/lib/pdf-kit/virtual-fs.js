import Helvetica from "./font/data/Helvetica.afm";

class VirtualFileSystem {
  constructor() {
    this.fileData = {};
    this.writeFileSync("data/Helvetica.afm", Helvetica); // load the default font
  }

  readFileSync(fileName, options = {}) {
    const encoding = typeof options === "string" ? options : options.encoding;
    const virtualFileName = normalizeFilename(fileName);

    const data = this.fileData[virtualFileName];
    if (data == null) {
      throw new Error(`File '${virtualFileName}' not found in virtual file system`);
    }

    if (encoding) {
      // return a string
      return typeof data === "string" ? data : data.toString(encoding);
    }

    return Buffer.from(data, typeof data === "string" ? "base64" : undefined);
  }

  readFile(fileName, options = {}) {
    const encoding = typeof options === "string" ? options : options.encoding;
    const virtualFileName = normalizeFilename(fileName);

    const data = this.fileData[virtualFileName];
    if (data == null) {
      return Promise.reject(new Error(`File '${virtualFileName}' not found in virtual file system`));
    }

    if (encoding) {
      // return a string
      return Promise.resolve(typeof data === "string" ? data : data.toString(encoding));
    }

    return Promise.resolve(Buffer.from(data, typeof data === "string" ? "base64" : undefined));
  }

  writeFileSync(fileName, content) {
    this.fileData[normalizeFilename(fileName)] = content;
  }

  bindFileData(data = {}, options = {}) {
    if (options.reset) {
      this.fileData = data;
    } else {
      Object.assign(this.fileData, data);
    }
  }
}

function normalizeFilename(fileName) {
  if (fileName.indexOf(__dirname) === 0) {
    fileName = fileName.substring(__dirname.length);
  }

  if (fileName.indexOf("/") === 0) {
    fileName = fileName.substring(1);
  }

  return fileName;
}

const virtualFileSystemInstance = new VirtualFileSystem();

export const readFileSync = virtualFileSystemInstance.readFileSync.bind(virtualFileSystemInstance);
export const readFile = virtualFileSystemInstance.readFile.bind(virtualFileSystemInstance);
export default virtualFileSystemInstance;
