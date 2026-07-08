import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedJobs from "./components/FeaturedJobs";
import TopCompanies from "./components/TopCompanies";
import Stats from "./components/Stats";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import "./Home.css";

const Home = () => (
  <>
    <Hero />
    <Stats />
    <FeaturedJobs />
    <Categories />
    <TopCompanies />
    <WhyChooseUs />
    <Testimonials />
    <CTA />
  </>
);

export default Home;
