import { useEffect, useState } from "react";
import Helper from "../Config/Helper";

const ImageInput = ({id, required = false, label = "", onChange, error, value = ""}) => {

    const [hasImage, setHasImage] = useState(false);
    const [imageOpacity, setImageOpacity] = useState(0.5);

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            processFile(file);
        }
    }

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => updatePreview(e.target.result);
        reader.readAsDataURL(file);
        if (onChange) {
            onChange(file);
        }
    }

    const updatePreview = (imageUrl) => {
        const preview = document.getElementById(`preview-${id}`);
        if (preview) {
            preview.style.backgroundImage = `url(${imageUrl})`;
            setHasImage(true);
            setImageOpacity(0);
        }
    }

    useEffect(() => {
        if (value) {
            const imageUrl = Helper.serverImage(value);
            updatePreview(imageUrl);
        }
    }, [value]);

    return (
        <div>
            <label class={`fw-semibold fs-6 mb-2 ${required ? 'required' : ''}`}>{label}</label>
            <label for={id}>
                <div className="image-outer-placeholder" id={`preview-${id}`} onMouseEnter={() => setImageOpacity(0.5)} onMouseLeave={() => hasImage ? setImageOpacity(0) : null}>
                    <img className="image-placeholder" src={Helper.staticImage('assets/photo-1.png')} style={{ opacity: imageOpacity, backgroundColor: `${hasImage ? '#413f3f' : 'transparent'}` }} />
                </div>
            </label>
            <input type="file" className="file-input" id={id} accept=".jpg, .png, .jpeg, .svg, .webp" onChange={onImageChange} />
            <small className="error">{error}</small>
        </div>
    )
}

export default ImageInput;