import { Check } from "lucide-react";
import Container from "../common/Container";
import Button from "../common/Button";
import promiseImage from "../../assets/images/promise.jpg";

const features = [
    "Premium Materials",
    "Free Worldwide Shipping",
    "30-Day Easy Returns",
    "Secure Checkout",
];

const LoomifyPromise = () => {
    return (
        <section className="py-24">
            <Container>
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* Left */}

                    <div>
                        <img
                            src={promiseImage}
                            alt="Loomify Promise"
                            className="aspect-4/5 w-full rounded-card object-cover shadow-card"
                        />
                    </div>

                    {/* Right */}

                    <div>
                        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                            The Loomify Promise
                        </span>

                        <h2 className="mt-4 text-4xl font-bold text-primary lg:text-5xl">
                            Designed for Everyday Luxury.
                        </h2>

                        <p className="mt-6 max-w-lg leading-8 text-gray-600">
                            Every piece at Loomify is crafted with premium
                            fabrics and timeless design, giving you comfort,
                            confidence, and quality that lasts.
                        </p>

                        <div className="mt-10 space-y-5">
                            {features.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                                        <Check
                                            size={18}
                                            className="text-accent"
                                        />
                                    </div>

                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button className="mt-10">Learn More</Button>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default LoomifyPromise;
