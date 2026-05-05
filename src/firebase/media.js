import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { collection, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { FIREBASE_PATHS } from "../constants/firebasePaths";
import { db, storage } from "./config";
import { assertFirebaseReady } from "./status";

const MAX_IMAGE_WIDTH = 1280;
const UPLOAD_SIZE_LIMIT_BYTES = 25 * 1024 * 1024;

function guessExtension(contentType = "") {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("quicktime")) return "mov";
  if (contentType.includes("video")) return "mp4";
  return "jpg";
}

function normalizePickedType(asset) {
  if (asset?.type === "video" || asset?.mimeType?.startsWith("video/")) {
    return "video";
  }

  return "image";
}

async function preparePickedAsset(asset) {
  const pickedType = normalizePickedType(asset);

  if (pickedType === "video") {
    return {
      contentType: asset.mimeType || "video/mp4",
      durationMillis: asset.duration || null,
      fileName: asset.fileName || "video.mp4",
      height: asset.height || null,
      sizeBytes: asset.fileSize || asset.file?.size || null,
      type: "video",
      uri: asset.uri,
      webFile: asset.file || null,
      width: asset.width || null,
    };
  }

  const shouldResize = asset.width && asset.width > MAX_IMAGE_WIDTH;
  const manipulated = await ImageManipulator.manipulateAsync(
    asset.uri,
    shouldResize ? [{ resize: { width: MAX_IMAGE_WIDTH } }] : [],
    {
      compress: 0.82,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  return {
    contentType: "image/jpeg",
    durationMillis: null,
    fileName: asset.fileName || "image.jpg",
    height: manipulated.height || asset.height || null,
    sizeBytes: asset.fileSize || asset.file?.size || null,
    type: "image",
    uri: manipulated.uri,
    webFile: null,
    width: manipulated.width || asset.width || null,
  };
}

export async function pickChatMediaFromLibrary() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Photo library permission is required to share media.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    allowsMultipleSelection: false,
    mediaTypes: ["images", "videos"],
    quality: 0.82,
    selectionLimit: 1,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  return preparePickedAsset(result.assets[0]);
}

export async function uploadChatMedia({ chatId, media, onProgress }) {
  assertFirebaseReady();

  if (!storage) {
    throw new Error("Firebase Storage is not ready.");
  }

  const attachmentId = doc(collection(db, FIREBASE_PATHS.chats, chatId, FIREBASE_PATHS.attachments)).id;
  const extension = guessExtension(media.contentType);
  const storagePath = `chats/${chatId}/attachments/${attachmentId}/original.${extension}`;
  const fileRef = ref(storage, storagePath);
  const blob = media.webFile || (await fetch(media.uri).then((response) => response.blob()));
  const sizeBytes = media.sizeBytes || blob.size || null;

  if (sizeBytes && sizeBytes > UPLOAD_SIZE_LIMIT_BYTES) {
    throw new Error("Please choose a file smaller than 25 MB.");
  }

  const uploadTask = uploadBytesResumable(fileRef, blob, {
    contentType: media.contentType,
    customMetadata: {
      chatId,
      attachmentId,
    },
  });

  await new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.totalBytes > 0 ? snapshot.bytesTransferred / snapshot.totalBytes : 0;
        onProgress?.(progress);
      },
      reject,
      resolve,
    );
  });

  const downloadURL = await getDownloadURL(fileRef);

  return {
    attachmentId,
    contentType: media.contentType,
    downloadURL,
    durationMillis: media.durationMillis,
    height: media.height,
    sizeBytes,
    storagePath,
    type: media.type,
    width: media.width,
  };
}
