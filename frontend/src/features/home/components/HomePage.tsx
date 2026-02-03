import { Box } from '@mui/material';
import Navbar from '../../../components/common/Navbar';
import Hero from '../../../components/common/Hero';
import Footer from '../../../components/common/Footer';

function HomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Hero />
      </Box>
      <Footer />
    </Box>
  );
}

export default HomePage;