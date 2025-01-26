"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import classes from "./image-picker.module.css";

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState();

  const imageInput = useRef();

  function handlePickClick() {
    imageInput.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0]; // files: 선택됐던 모든 파일들의 배열
    if (!file) {
      return;
    }

    // FileReader : 자바스크립트 내장 클래스. 비동기적으로 파일을 읽음
    const fileReader = new FileReader();

    fileReader.onload = () => {
      // onLoad: 파일 읽기가 성공적으로 완료되면 발생
      setPickedImage(fileReader.result);
    };

    fileReader.readAsDataURL(file); // readAsDataURL(): 지정된 파일 내용 읽기 시작. 완료되면 fileReader의 result 속성에 파일 데이터 url이 저장됨
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
