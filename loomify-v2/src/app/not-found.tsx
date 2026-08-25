export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-primary">404</h1>

                <h2 className="mt-4 text-2xl font-semibold">
                    Product Not Found
                </h2>

                <p className="mt-3 text-gray-500">
                    The product you are looking for does not exist.
                </p>
            </div>
        </div>
    );
}
