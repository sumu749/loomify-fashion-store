import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import LoomifyPromise from "../components/home/LoomifyPromise";
import Newsletter from "../components/home/Newsletter";
import StatsSection from "../components/home/StatsSection";
// import WhyChooseUs from "../components/home/WhyChooseUs";

const Home = () => {
    return (
        <>
            <Hero />

            <Categories />

            <FeaturedProducts />

            <LoomifyPromise />

            <StatsSection />

            <Newsletter />
        </>
    );
};

export default Home;
