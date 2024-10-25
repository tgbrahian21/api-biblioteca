import {upload} from "../config/configImage.js";

export const uploadImageSingle = (file) => upload.single(file);    