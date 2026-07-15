import { ArrowRight } from "lucide-react";

import Container from "../common/Container";
import Button from "../common/Button";

const Newsletter = () => {
    return (
        <section className="py-24">
            <Container>
                <div className="overflow-hidden rounded-card border border-border bg-stone-50 px-6 py-16 text-center md:px-12">
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                        Stay Connected
                    </span>

                    <h2 className="mt-5 text-4xl font-bold text-primary md:text-5xl">
                        Join the Loomify Community
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                        Be the first to discover new arrivals, exclusive
                        collections, special offers, and timeless fashion
                        inspiration delivered straight to your inbox.
                    </p>

                    <form className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="h-14 flex-1 rounded-full border border-border bg-white px-6 outline-none transition focus:border-accent"
                        />

                        <Button size="lg" className="rounded-full px-8">
                            Subscribe
                            <ArrowRight size={18} />
                        </Button>
                    </form>
                </div>
            </Container>
        </section>
    );
};

export default Newsletter;
