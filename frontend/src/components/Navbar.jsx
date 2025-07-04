import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
              <Button color="inherit" component={Link} to="/profile">
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
  );
};

export default Navbar;