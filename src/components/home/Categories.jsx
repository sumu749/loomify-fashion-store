import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

import categories from "../../data/categories";
import CategoryCard from "../categories/CategoryCard";

const Categories = () => {
    return (
        <section className="py-20">
            <Container>
                <SectionTitle
                    subtitle="Collections"
                    title="Shop by Category"
                    description="Explore our curated collections tailored to every lifestyle."
                />

                <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Categories;
