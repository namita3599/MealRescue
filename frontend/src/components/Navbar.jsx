import {React, useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileModal from '../components/ProfileModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openProfileModal, setOpenProfileModal] = useState(false);

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
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* App Logo/Name */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          Meal Rescue
        </Typography>

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