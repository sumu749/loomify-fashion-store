import Button from "../components/common/Button";
import Container from "../components/common/Container";

const Home = () => {
    return (
        <Container className="py-20">
            <h1 className="text-5xl font-bold mb-6">Welcome to Loomify</h1>

            <Button>Shop Collection</Button>
        </Container>
    );
};

export default Home;
