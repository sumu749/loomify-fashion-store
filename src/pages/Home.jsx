import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import LoomifyPromise from "../components/home/LoomifyPromise";
// import WhyChooseUs from "../components/home/WhyChooseUs";

const Home = () => {
    return (
        <>
            <Hero />
            <FeaturedProducts />
            <Categories />
            {/* <WhyChooseUs /> */}
            <LoomifyPromise />
        </>
    );
};

export default Home;
