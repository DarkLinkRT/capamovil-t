import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import Photo from '../models/Foto';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";

export function usePhotoGallery() {

    const { getPhoto } = useCamera();
    const [photos, setPhotos] = useState<Photo[]>([]);

    var base64 = "";
  
    const takePhoto = async () => {
      const cameraPhoto = await getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        quality: 20
      });
      var fileName = new Date().getTime() + '.jpeg';
      const newPhotos = [{
        id : "",
        filepath: fileName,
        webviewPath: cameraPhoto.base64String
      }, ...photos];
      setPhotos(newPhotos);
    };
  
    return {
      photos , takePhoto
    };
  }