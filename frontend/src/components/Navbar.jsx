import { Link } from 'react-router-dom';

const Navbar = () => {
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
                  <Button color="inherit" component={Link} to="/myposts">
                    My Posts
                  </Button>
                </>
              )}

              {/*NGO Links */}
              {user.role === 'ngo' && (
                <Button color="inherit" component={Link} to="/claimed">
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
