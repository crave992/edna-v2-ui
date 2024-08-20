import { ClassImageGalleryDto } from '@/dtos/ClassDto';
import React from 'react';

interface ImageGalleryProps {
  photos: ClassImageGalleryDto[];
}

interface DashboardGalleryItem {
  classImageGallery: ClassImageGalleryDto;
}

interface DashboardImageGalleryProps {
  photos: DashboardGalleryItem[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ photos }) => {

  return (
    <div className="tw-flex tw-flex-row tw-overflow-x-hidden">
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.imageUrl}
          className="tw-w-full tw-h-[258px] tw-object-cover"
          alt={`Photo ${photo.id}`}
        />
      ))}
    </div>
  );
};

export const DashboardImageGallery: React.FC<DashboardImageGalleryProps> = ({ photos }) => {
  return (
    <div className="tw-flex tw-flex-row tw-overflow-x-hidden">
      {photos && photos.map((photo) => (
        <img
          key={photo.classImageGallery.id}
          src={photo.classImageGallery.imageUrl}
          className="tw-w-full tw-h-[258px] tw-object-cover"
          alt={`Photo ${photo.classImageGallery.id}`}
        />
      ))}
    </div>
  );
};

export const DashboardImageGallerySkeleton = () => {
  return (
    <div className="tw-px-lg tw-gap-xl tw-flex-wrap tw-flex">
      <div className={`tw-flex tw-h-[258px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>

      <div className={`tw-flex tw-h-[258px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>

      <div className={`tw-flex tw-h-[258px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>

      <div className={`tw-flex tw-h-[258px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>

      <div className={`tw-flex tw-h-[258px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>
    </div>
  );
}

export default ImageGallery;
