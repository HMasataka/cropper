/** @jsxRuntime classic */
/** @jsx jsx */

import React, { useState, useEffect, useCallback } from "react";

import { jsx, css } from "@emotion/react";

import Cropper, { Area } from "react-easy-crop";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

type CropComponentProps = {};

const CropComponent: React.FC<CropComponentProps> = ({}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState<string>("");
  const [openState, setOpenState] = useState<boolean>(false);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      console.log(croppedArea, croppedAreaPixels);
    },
    []
  );

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null || e.target.files.length == 0) {
      return;
    }

    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }

    setFile(file);
    setOpenState(true);
  };

  useEffect(() => {
    let fileReader: FileReader;
    let ignore = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result && !ignore) {
          setImage(result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }

    return () => {
      ignore = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  return (
    <>
      <input type="file" accept=".png, .jpg, .jpeg" onChange={changeHandler} />
      {openState && (
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      )}
    </>
  );
};

export default CropComponent;
