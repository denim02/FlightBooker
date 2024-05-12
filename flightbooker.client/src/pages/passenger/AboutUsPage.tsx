import { Container, Typography, Grid, Box } from "@mui/material";
import aboutUsHeroBg from "../../assets/images/about-us-hero.jpg";
import myPicture from "../../assets/images/me.png";

const AboutUsPage = () => {
  return (
    <div>
      <Box
        className="relative bg-cover bg-center h-80 flex items-center justify-center text-white"
        sx={{
          backgroundImage: `url(${aboutUsHeroBg})`,
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      </Box>

      <Container className="py-8">
        <Box className="max-w-3xl">
        <Typography
          variant="h3"
          gutterBottom
          className="text-background font-light"
        >
          Our Mission
        </Typography>
        <Typography variant="body1" className="mb-4">
          At FlightBooker, our mission is to make travel accessible to everyone.
          We strive to provide a seamless booking experience, offering a wide
          range of flights at competitive prices. Whether you're planning a
          family vacation, a business trip, or a solo adventure, we're here to
          help you find the perfect flight that suits your needs and budget.
        </Typography>
        <Typography variant="body1" className="mb-4">
          We are committed to customer satisfaction and aim to exceed your
          expectations with our exceptional service. Our team works tirelessly
          to ensure that your journey is comfortable and stress-free from start
          to finish. With FlightBooker, you can travel with confidence, knowing
          that you're in good hands every step of the way.
        </Typography>
        <Typography variant="body1" className="mb-4">
          Additionally, we are dedicated to sustainability and reducing our
          environmental impact. We actively support initiatives that promote
          eco-friendly travel practices and strive to minimize carbon emissions
          associated with air travel. Together, we can make a positive
          difference in the world while exploring its wonders.
        </Typography>
        </Box>
        <Typography
          variant="h3"
          gutterBottom
          className="text-background font-light"
        >
          Our Team
        </Typography>
        <Grid
          container
          spacing={2}
          alignContent="center"
          justifyContent="center"
        >
          <Grid item>
            <img
              src={myPicture}
              alt="Team Member 1"
              className="w-72 h-auto mx-auto rounded-full"
            />
            <Typography className="text-lg font-light">Deni Mastori</Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AboutUsPage;
