/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import React, { useState, useEffect, useCallback } from "react";

import Cropper, { Area } from "react-easy-crop";

import getCroppedImg from "scripts/getCroppedImg";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

type CropComponentProps = {};

const CropComponent: React.FC<CropComponentProps> = ({}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState<string>("");
  const [croppedImageSrc, setCroppedImageSrc] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<File | undefined>();
  const [openState, setOpenState] = useState<boolean>(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, image]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null || e.target.files.length == 0) {
      return;
    }

    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
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

  useEffect(() => {
    let fileReader: FileReader;
    let ignore = false;
    if (croppedImage) {
      fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result && !ignore) {
          setCroppedImageSrc(result as string);
        }
      };
      fileReader.readAsDataURL(croppedImage);
    }

    return () => {
      ignore = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [croppedImage]);

  return (
    <>
      <input type="file" accept=".png, .jpg, .jpeg" onChange={changeHandler} />
      {openState && (
        <div css={cropContainer}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}
      <button onClick={showCroppedImage} css={btn}>
        AAA
      </button>
      {croppedImage && (
        <img css={croppedImageStyle} src={croppedImageSrc} alt="" />
      )}
    </>
  );
};

const btn = css``;

const cropContainer = css`
  position: relative;
  width: 100%;
  background-color: #333;
  height: 200px;
`;

const croppedImageStyle = css`
  max-height: 300px;
`;
export default CropComponent;
