import Button from "../components/common/Button";
import Container from "../components/common/Container";

const Home = () => {
    return (
        <Container className="py-20">
            <h1 className="text-5xl font-bold mb-6">Welcome to Loomify</h1>

            <Button>Shop Collection</Button>
            <Button variant="outline">Shop Collection</Button>
            <div className="bg-primary text-white p-10 rounded-card">
                Loomify Theme Working
            </div>
        </Container>
    );
};

export default Home;
