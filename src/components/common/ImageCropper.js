import React, {useState} from 'react';
import ReactCrop from 'react-image-crop';
import PropTypes from 'prop-types';
import 'react-image-crop/dist/ReactCrop.css';

/**
 * @param {File} image - Image File Object
 * @param {Object} pixelCrop - pixelCrop Object from the 2nd argument of onChange or onComplete
 * @param {String} fileName - Name of the returned file in Promise
 */
const getCroppedImg = async (image, pixelCrop, fileName) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            img,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );
    };
    console.log(canvas.toDataURL('image/jpeg'));
    
    img.src = image;
    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        resolve(file);
      }, 'image/jpeg');
    });
}

const ImageSelectCropper = (props) => {
    const {
        imgSrc,
        onCropComplete = (newCrop) => console.log({newCrop}),
        onCloseClick = () => console.log('On close clicked'),
        minWidthInPixels = 20,
        circularCrop = false,
        filename = 'CroppedImage.jpg'
    } = props;
    const [crop, setCrop] = useState({ aspect: 1 });

    const getCroppedImageAsBlob = async () => {
        const blob = await getCroppedImg(imgSrc, crop, filename);
        onCropComplete(blob);
    }

    return <div className="overlay">
        <div 
            style={{
                position: 'fixed',
                top: '0',
                right: '0'
            }} 
            className="p-4 cropper-button"
            onClick={onCloseClick}
        >
            Close
        </div>
        <div 
            style={{
                position: 'fixed',
                top: '0',
                left: '0'
            }} 
            className="p-4 cropper-button"
            onClick={getCroppedImageAsBlob}
        >
            Crop
        </div>
        <ReactCrop 
            src={imgSrc} 
            crop={crop} 
            onChange={newCrop => setCrop(newCrop)}
            minWidth={minWidthInPixels}
            imageStyle={{maxWidth: '500px'}}
            className="my-5"
            circularCrop={circularCrop}
        />;
        
    </div>
};

ImageSelectCropper.propTypes = {
    onCropComplete: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    filename: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    minWidthInPixels: PropTypes.number,
    circularCrop: PropTypes.bool,
};

export default ImageSelectCropper;
