import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
// import WhyChooseUs from "../components/home/WhyChooseUs";

const Home = () => {
    return (
        <>
            <Hero />
            <FeaturedProducts />
            <Categories />
            {/* <WhyChooseUs /> */}
        </>
    );
};

export default Home;
