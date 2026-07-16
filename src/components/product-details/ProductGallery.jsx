import { useState } from "react";
import { motion } from "framer-motion";

const ProductGallery = ({ product }) => {
    const images =
        product.images?.length > 0 ? product.images : [product.image];

    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="flex flex-col-reverse gap-5 md:flex-row">
            {/* ================= Thumbnails ================= */}

            <div className="flex gap-3 overflow-x-auto md:w-24 md:flex-col md:gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            selectedImage === image
                                ? "scale-105 border-accent shadow-lg"
                                : "border-transparent opacity-70 hover:scale-105 hover:border-gray-300 hover:opacity-100"
                        }
                                `}
                    >
                        <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="
                                h-20
                                w-16
                                object-cover
                                sm:h-24
                                sm:w-20
                            "
                        />
                    </button>
                ))}
            </div>

            {/* ================= Main Image ================= */}

            <div className="flex-1 overflow-hidden rounded-card bg-stone-100">
                <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt={product.name}
                    initial={{
                        opacity: 0,
                        scale: 1.05,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.35,
                    }}
                    className="
                        aspect-4/5
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-110
                    "
                />
            </div>
        </div>
    );
};

export default ProductGallery;
