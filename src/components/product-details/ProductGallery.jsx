const ProductGallery = ({ product }) => {
    return (
        <div>
            <img
                src={product.image}
                alt={product.name}
                className="
                    aspect-4/5
                    w-full
                    rounded-card
                    object-cover
                    shadow-card
                "
            />
        </div>
    );
};

export default ProductGallery;
