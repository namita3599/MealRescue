import {React, useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box , useTheme, useMediaQuery} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileModal from '../components/ProfileModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenProfile = () => {
    setTimeout(() => {
      setOpenProfileModal(true);
    }, 0); // Let the stack clear first
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
    <AppBar position="static">
      <Toolbar
        sx={{
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "space-between",
          gap: isMobile ? 2 : 0,
          py: isMobile ? 2 : 1,
        }}
      >

      <Box
        component={Link}
        to="/"
        sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
      >
      <img src="/whitelogo.png" alt="logo" style={{ width: 260, marginRight: 12 }} />
    </Box>

        {/*Links */}
        <Box>
          {user ? (
            <>
              {/*Normal User Links */}
              {user.role === 'user' && (
                <>
                  <Button color="inherit" component={Link} to="/create">
                    Create Post
                  </Button>
                </>
              )}

              {/*NGO Links */}
              {user.role === 'ngo' && (
                <Button color="inherit" component={Link} to="/claimed-posts">
                  Claimed
                </Button>
              )}

              {/* Common Links*/}
                <Button color="inherit" onClick={handleOpenProfile}>
                  Profile
                </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              {/*(not logged in) */}
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>

    {user && (
      <ProfileModal
        open={openProfileModal}
        handleClose={() => setOpenProfileModal(false)}
      />
    )}
    </>
  );
};

export default Navbar;