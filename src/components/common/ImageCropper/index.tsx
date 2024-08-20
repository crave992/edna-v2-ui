import Image from 'next/image';
import React, { FunctionComponent, ReactElement, SyntheticEvent, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

interface ImageCropperProps {
  picture: string;
  closeModal: (event: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  savePicture: (image: string) => void;
}

const ImageCropperModal: FunctionComponent<ImageCropperProps> = ({
  closeModal,
  savePicture,
  picture,
}): ReactElement => {
  const imgRef = useRef<AvatarEditor | null>(null);
  const [zoom, setZoom] = useState(1);

  const onClickSave = () => {
    if (imgRef.current) {
      const canvasScaled = imgRef.current.getImageScaledToCanvas() as HTMLCanvasElement;
      savePicture(canvasScaled.toDataURL('image/jpeg'))
    }
  }

  const setEditorRef = (editor: AvatarEditor) => (imgRef.current = editor)

  return (
    <div>
      {!!picture && (
        <div className="App">
          <div className="tw-text-center">
            <AvatarEditor
              ref={setEditorRef}
              image={picture}
              width={300}
              height={300}
              border={50}
              color={[255, 255, 255, 0.6]}
              scale={zoom}
              rotate={0}
            />
          </div>
          <div className="controls">
            <input
              type="range"
              value={zoom}
              min={1}
              max={5}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="slider tw-w-full tw-h-3 tw-bg-[#407096] tw-rounded-lg tw-cursor-pointer tw-range-lg"
            />
          </div>
        </div>
      )}
      <div className='tw-mt-[5px] tw-flex tw-justify-end'>
        <button
          onClick={closeModal}
          className='tw-bg-white hover:tw-bg-gray-100 tw-text-gray-800 tw-font-semibold tw-py-2 tw-px-4 tw-border tw-border-solid tw-border-gray-200 tw-rounded'
        >
          Cancel
        </button>
        <button
          onClick={onClickSave}
          className="tw-bg-[#407096] hover:tw-bg-[#124873] tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-border tw-border-solid tw-border-[#407096] tw-rounded tw-ml-2"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ImageCropperModal;
